import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'
import { sendEmail, documentApprovedEmail, documentRejectedEmail } from '@/lib/email'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_ERROR' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, reason } = body

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Fetch document
    const { data: document, error: docError } = await supabase
      .from('Document')
      .select('*, Rental(*)')
      .eq('id', params.id)
      .single()

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Update document status
    const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED'
    const { error: updateError } = await supabase
      .from('Document')
      .update({ status: newStatus })
      .eq('id', params.id)

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message, code: 'UPDATE_ERROR' },
        { status: 500 }
      )
    }

    // Update rental status if approved
    if (action === 'approve') {
      await supabase
        .from('Rental')
        .update({ rental_status: 'PENDING_PAYMENT' })
        .eq('id', document.rental_id)
    }

    // Fetch customer email
    const { data: customerData, error: customerError } = await supabase.auth.admin.getUserById(
      document.Rental?.customer_id
    )

    if (!customerError && customerData?.user?.email) {
      const customerName = customerData.user.user_metadata?.first_name || 'Customer'
      const rentalId = document.rental_id

      if (action === 'approve') {
        const emailHtml = documentApprovedEmail({
          customerName,
          rentalId,
          documentType: document.document_type,
          nextStepLink: `${process.env.NEXT_PUBLIC_APP_URL}/app/rentals/${rentalId}/payment`,
        })

        await sendEmail({
          to: customerData.user.email,
          subject: '✓ Tu documento ha sido aprobado',
          html: emailHtml,
        })
      } else {
        const emailHtml = documentRejectedEmail({
          customerName,
          rentalId,
          documentType: document.document_type,
          reason: reason || 'Tu documento no cumple con los requisitos. Por favor intenta de nuevo.',
          resubmitLink: `${process.env.NEXT_PUBLIC_APP_URL}/app/rentals/${rentalId}/documents`,
        })

        await sendEmail({
          to: customerData.user.email,
          subject: '⚠️ Tu documento necesita revisión',
          html: emailHtml,
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: { status: newStatus },
    })
  } catch (err: any) {
    console.error('Error updating document:', err)
    return NextResponse.json(
      { error: 'Failed to update document', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
