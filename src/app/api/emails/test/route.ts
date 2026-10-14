import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, rentalConfirmationEmail, documentApprovedEmail, paymentSuccessEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, type } = body

    if (!email || !type) {
      return NextResponse.json(
        { error: 'Missing email or type', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    let emailHtml = ''
    let subject = ''

    switch (type) {
      case 'rental-confirmation':
        emailHtml = rentalConfirmationEmail({
          customerName: 'Juan García',
          rentalId: 'test-rental-123',
          scooterModel: 'Xiaomi Mi 3 Pro',
          startDate: '2026-10-15',
          endDate: '2026-10-17',
          totalAmount: '500.00',
          dashboardLink: 'http://localhost:3000/app/rentals/test-123',
        })
        subject = '¡Tu reserva de scooter en PUNTA BIKERS está confirmada! 🎉'
        break

      case 'document-approved':
        emailHtml = documentApprovedEmail({
          customerName: 'Juan García',
          rentalId: 'test-rental-123',
          documentType: 'INE',
          nextStepLink: 'http://localhost:3000/app/rentals/test-123/payment',
        })
        subject = '✓ Tu documento ha sido aprobado'
        break

      case 'payment-success':
        emailHtml = paymentSuccessEmail({
          customerName: 'Juan García',
          rentalId: 'test-rental-123',
          scooterModel: 'Xiaomi Mi 3 Pro',
          startDate: '2026-10-15',
          pickupLink: 'http://localhost:3000/app/rentals/test-123',
        })
        subject = '💳 Tu pago ha sido procesado - ¡Listo para recoger!'
        break

      default:
        return NextResponse.json(
          { error: 'Invalid email type', code: 'VALIDATION_ERROR' },
          { status: 400 }
        )
    }

    const result = await sendEmail({
      to: email,
      subject,
      html: emailHtml,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send email', code: 'EMAIL_ERROR', details: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${email}`,
      data: result.data,
    })
  } catch (err: any) {
    console.error('Error sending test email:', err)
    return NextResponse.json(
      { error: 'Failed to send email', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
