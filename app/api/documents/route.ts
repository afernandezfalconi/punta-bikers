import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/api-auth';
import { adminClient } from '@/lib/supabase-admin';

const BUCKET = 'documents';
const MAX_SIZE = 5 * 1024 * 1024;
const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'application/pdf': 'pdf',
};

function fail(error: string, code: string, status: number) {
  return NextResponse.json({ error, code }, { status });
}

// File signature check: the declared MIME type is client-controlled, the bytes are not.
function matchesType(bytes: Uint8Array, mime: string): boolean {
  if (mime === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mime === 'image/png') return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (mime === 'application/pdf') return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
  return false;
}

async function validate(file: FormDataEntryValue | null, label: string) {
  if (!(file instanceof File)) return { error: `Missing ${label} file` };
  if (!EXT[file.type]) return { error: 'Only JPEG, PNG or PDF files are allowed' };
  if (file.size === 0 || file.size > MAX_SIZE) return { error: 'Each file must be 5MB or less' };
  const buf = new Uint8Array(await file.arrayBuffer());
  if (!matchesType(buf, file.type)) return { error: 'File content does not match its type' };
  return { buf, file };
}

// Customer uploads ID photos for one of their rentals. This never advances the
// rental: only an admin approval (PATCH /api/documents/[id]) does.
export async function POST(req: NextRequest) {
  try {
    const auth = await getAuth(req);
    if (!auth) return fail('Unauthorized', 'UNAUTHORIZED', 401);

    const form = await req.formData();
    const rentalId = form.get('rentalId');
    const documentType = form.get('documentType');
    if (typeof rentalId !== 'string' || (documentType !== 'INE' && documentType !== 'PASSPORT')) {
      return fail('Invalid rentalId or documentType', 'VALIDATION_ERROR', 400);
    }

    const front = await validate(form.get('front'), 'front');
    if ('error' in front) return fail(front.error ?? 'Invalid file', 'INVALID_FILE', 400);
    const back = await validate(form.get('back'), 'back');
    if ('error' in back) return fail(back.error ?? 'Invalid file', 'INVALID_FILE', 400);

    const supabase = adminClient();
    const { data: rental } = await supabase
      .from('rentals')
      .select('id, user_id, status')
      .eq('id', rentalId)
      .maybeSingle();
    if (!rental || rental.user_id !== auth.user.id) return fail('Rental not found', 'NOT_FOUND', 404);
    if (rental.status !== 'pending_doc') {
      return fail('This rental is not waiting for documents', 'INVALID_STATE', 409);
    }

    const { data: pending } = await supabase
      .from('documents')
      .select('id')
      .eq('rental_id', rentalId)
      .eq('status', 'pending')
      .limit(1);
    if (pending?.length) return fail('Documents already submitted and under review', 'ALREADY_PENDING', 409);

    const stamp = Date.now();
    const frontPath = `${rentalId}/front-${stamp}.${EXT[front.file.type]}`;
    const backPath = `${rentalId}/back-${stamp}.${EXT[back.file.type]}`;

    for (const [path, part] of [[frontPath, front], [backPath, back]] as const) {
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, part.buf, { contentType: part.file.type });
      if (error) throw error;
    }

    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          rental_id: rentalId,
          user_id: auth.user.id,
          document_type: documentType,
          front_path: frontPath,
          back_path: backPath,
          status: 'pending',
        },
      ])
      .select('id, document_type, status, created_at')
      .single();
    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Documents POST error:', error instanceof Error ? error.message : error);
    return fail('Failed to upload documents', 'DOCUMENT_UPLOAD_FAILED', 500);
  }
}

// Admin review queue, with short-lived signed URLs (the bucket is private).
export async function GET(req: NextRequest) {
  try {
    const auth = await getAuth(req);
    if (!auth?.isAdmin) return fail('Forbidden', 'FORBIDDEN', 403);

    const status = req.nextUrl.searchParams.get('status') ?? 'pending';
    const supabase = adminClient();
    const { data, error } = await supabase
      .from('documents')
      .select('id, rental_id, document_type, status, rejection_reason, front_path, back_path, created_at')
      .eq('status', status)
      .order('created_at', { ascending: true });
    if (error) throw error;

    const items = await Promise.all(
      (data ?? []).map(async (d) => {
        const [front, back] = await Promise.all([
          supabase.storage.from(BUCKET).createSignedUrl(d.front_path, 300),
          supabase.storage.from(BUCKET).createSignedUrl(d.back_path, 300),
        ]);
        return {
          id: d.id,
          rental_id: d.rental_id,
          document_type: d.document_type,
          status: d.status,
          rejection_reason: d.rejection_reason,
          created_at: d.created_at,
          front_url: front.data?.signedUrl ?? null,
          back_url: back.data?.signedUrl ?? null,
        };
      })
    );
    return NextResponse.json(items);
  } catch (error) {
    console.error('Documents GET error:', error instanceof Error ? error.message : error);
    return fail('Failed to fetch documents', 'DOCUMENTS_FETCH_FAILED', 500);
  }
}
