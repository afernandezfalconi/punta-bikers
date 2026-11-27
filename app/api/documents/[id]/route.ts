import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuth } from '@/lib/api-auth';
import { adminClient } from '@/lib/supabase-admin';
import { sendEmail, documentApprovedEmail, documentRejectedEmail } from '@/lib/email';

const bodySchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('approve') }),
  z.object({ action: z.literal('reject'), reason: z.string().trim().min(3).max(500) }),
]);

function fail(error: string, code: string, status: number) {
  return NextResponse.json({ error, code }, { status });
}

// Admin approves or rejects a document. Approval moves the rental to pending_payment.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuth(req);
    if (!auth?.isAdmin) return fail('Forbidden', 'FORBIDDEN', 403);

    const parsed = bodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return fail('Invalid action (a rejection needs a reason)', 'VALIDATION_ERROR', 400);

    const { id } = await params;
    const supabase = adminClient();
    const { data: doc } = await supabase
      .from('documents')
      .select('id, rental_id, user_id, document_type, status')
      .eq('id', id)
      .maybeSingle();
    if (!doc) return fail('Document not found', 'NOT_FOUND', 404);
    if (doc.status !== 'pending') return fail('Document was already reviewed', 'ALREADY_REVIEWED', 409);

    const approved = parsed.data.action === 'approve';
    const reason = parsed.data.action === 'reject' ? parsed.data.reason : null;

    const { error } = await supabase
      .from('documents')
      .update({
        status: approved ? 'approved' : 'rejected',
        rejection_reason: reason,
        reviewed_by: auth.user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('status', 'pending');
    if (error) throw error;

    if (approved) {
      const { error: rentalError } = await supabase
        .from('rentals')
        .update({ status: 'pending_payment', updated_at: new Date().toISOString() })
        .eq('id', doc.rental_id)
        .eq('status', 'pending_doc');
      if (rentalError) throw rentalError;
    }

    // Notify the customer; a mail failure must not undo the review.
    try {
      const { data: customer } = await supabase.auth.admin.getUserById(doc.user_id);
      const email = customer?.user?.email;
      if (email) {
        const base = process.env.NEXT_PUBLIC_APP_URL ?? '';
        const customerName = String(customer.user?.user_metadata?.first_name ?? 'Cliente');
        if (approved) {
          await sendEmail({
            to: email,
            subject: 'Tu documento fue aprobado',
            html: documentApprovedEmail({
              customerName,
              rentalId: doc.rental_id,
              documentType: doc.document_type,
              nextStepLink: `${base}/dashboard/rentals/${doc.rental_id}`,
            }),
          });
        } else {
          await sendEmail({
            to: email,
            subject: 'Tu documento necesita revisión',
            html: documentRejectedEmail({
              customerName,
              rentalId: doc.rental_id,
              documentType: doc.document_type,
              reason: reason ?? '',
              resubmitLink: `${base}/dashboard/rentals/${doc.rental_id}/documents`,
            }),
          });
        }
      }
    } catch (mailError) {
      console.error('Document review email failed:', mailError instanceof Error ? mailError.message : mailError);
    }

    return NextResponse.json({ success: true, status: approved ? 'approved' : 'rejected' });
  } catch (error) {
    console.error('Document PATCH error:', error instanceof Error ? error.message : error);
    return fail('Failed to review document', 'DOCUMENT_REVIEW_FAILED', 500);
  }
}
