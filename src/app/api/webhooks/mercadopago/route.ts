import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'
import { sendEmail, paymentSuccessEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const dataId = searchParams.get('data.id')

    // Handle different webhook types
    if (type === 'payment') {
      // Payment notification
      const rentalId = searchParams.get('external_reference')

      if (!rentalId) {
        return NextResponse.json(
          { error: 'Missing external_reference', code: 'VALIDATION_ERROR' },
          { status: 400 }
        )
      }

      // Fetch rental details
      const { data: rental, error: rentalError } = await supabase
        .from('Rental')
        .select('*')
        .eq('id', rentalId)
        .single()

      if (rentalError || !rental) {
        return NextResponse.json(
          { error: 'Rental not found', code: 'NOT_FOUND' },
          { status: 404 }
        )
      }

      // Update rental status to ACTIVE
      const { error: updateError } = await supabase
        .from('Rental')
        .update({
          rental_status: 'ACTIVE',
        })
        .eq('id', rentalId)

      if (updateError) {
        console.error('Error updating rental:', updateError)
        return NextResponse.json(
          { error: 'Failed to update rental', code: 'UPDATE_ERROR' },
          { status: 500 }
        )
      }

      // Fetch customer to send payment success email
      const { data: customerData, error: customerError } = await supabase.auth.admin.getUserById(
        rental.customer_id
      )

      if (!customerError && customerData?.user?.email) {
        const customerName = customerData.user.user_metadata?.first_name || 'Customer'

        const emailHtml = paymentSuccessEmail({
          customerName,
          rentalId: rental.id,
          scooterModel: `Scooter ${rental.scooter_id}`,
          startDate: rental.rental_start_date,
          pickupLink: `${process.env.NEXT_PUBLIC_APP_URL}/app/rentals/${rental.id}`,
        })

        await sendEmail({
          to: customerData.user.email,
          subject: '💳 Tu pago ha sido procesado - ¡Listo para recoger!',
          html: emailHtml,
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Payment processed and rental activated',
      })
    }

    // Handle other webhook types as needed
    return NextResponse.json({
      success: true,
      message: `Webhook type ${type} received`,
    })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
