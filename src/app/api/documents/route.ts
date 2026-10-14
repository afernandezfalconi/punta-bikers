import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_ERROR' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const rentalId = formData.get('rentalId') as string
    const documentType = formData.get('documentType') as string
    const frontFile = formData.get('front') as File
    const backFile = formData.get('back') as File

    if (!rentalId || !documentType || !frontFile || !backFile) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(frontFile.type) || !allowedTypes.includes(backFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, PDF allowed', code: 'INVALID_FILE_TYPE' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB each)
    const maxSize = 5 * 1024 * 1024
    if (frontFile.size > maxSize || backFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum 5MB per file', code: 'FILE_TOO_LARGE' },
        { status: 400 }
      )
    }

    // Upload files to Supabase Storage
    const timestamp = Date.now()
    const frontFileName = `documents/${rentalId}/front-${timestamp}.${getFileExtension(frontFile.type)}`
    const backFileName = `documents/${rentalId}/back-${timestamp}.${getFileExtension(backFile.type)}`

    const frontBuffer = await frontFile.arrayBuffer()
    const backBuffer = await backFile.arrayBuffer()

    const { error: frontUploadError } = await supabase.storage
      .from('rentals')
      .upload(frontFileName, frontBuffer, {
        contentType: frontFile.type,
      })

    if (frontUploadError) {
      return NextResponse.json(
        { error: 'Failed to upload front document', code: 'UPLOAD_ERROR' },
        { status: 500 }
      )
    }

    const { error: backUploadError } = await supabase.storage
      .from('rentals')
      .upload(backFileName, backBuffer, {
        contentType: backFile.type,
      })

    if (backUploadError) {
      return NextResponse.json(
        { error: 'Failed to upload back document', code: 'UPLOAD_ERROR' },
        { status: 500 }
      )
    }

    // Get public URLs
    const frontUrl = supabase.storage.from('rentals').getPublicUrl(frontFileName).data.publicUrl
    const backUrl = supabase.storage.from('rentals').getPublicUrl(backFileName).data.publicUrl

    // Save document record to database
    const { data: documentData, error: docError } = await supabase
      .from('Document')
      .insert([
        {
          rental_id: rentalId,
          document_type: documentType,
          front_photo_url: frontUrl,
          back_photo_url: backUrl,
          status: 'PENDING',
        },
      ])
      .select()

    if (docError) {
      return NextResponse.json(
        { error: 'Failed to save document record', code: 'DB_ERROR' },
        { status: 500 }
      )
    }

    // Update rental status
    const { error: updateError } = await supabase
      .from('Rental')
      .update({ rental_status: 'PENDING_PAYMENT' })
      .eq('id', rentalId)

    if (updateError) {
      console.error('Error updating rental status:', updateError)
    }

    return NextResponse.json({
      success: true,
      data: documentData?.[0],
    })
  } catch (err: any) {
    console.error('Error uploading documents:', err)
    return NextResponse.json(
      { error: 'Failed to upload documents', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

function getFileExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'application/pdf': 'pdf',
  }
  return extensions[mimeType] || 'bin'
}
