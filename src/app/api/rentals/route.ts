import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'
import { createPaymentPreference } from '@/lib/mercadopago'
import { sendEmail, rentalConfirmationEmail } from '@/lib/email'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_ERROR' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('Rental')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message, code: 'RENTALS_FETCH_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      total: data?.length || 0,
    })
  } catch (err: any) {
    console.error('Error fetching rentals:', err)
    return NextResponse.json(
      { error: 'Failed to fetch rentals', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_ERROR' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      scooter_id,
      rental_start_date,
      rental_end_date,
      price_per_day,
      total_days,
      is_mexican,
    } = body

    // Validaciones básicas
    if (!scooter_id || !rental_start_date || !rental_end_date) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Calcular valores financieros
    const subtotal = new Prisma.Decimal(price_per_day).times(total_days)
    const deposit_amount = is_mexican ? new Prisma.Decimal(2000) : new Prisma.Decimal(0)
    const commission_amount = subtotal.greaterThan(500)
      ? subtotal.times(0.1)
      : new Prisma.Decimal(100)

    // Crear rental en base de datos
    const { data: rentalData, error: rentalError } = await supabase
      .from('Rental')
      .insert([
        {
          scooter_id,
          customer_id: user.id,
          rental_start_date,
          rental_end_date,
          price_per_day: price_per_day.toString(),
          total_days,
          subtotal: subtotal.toString(),
          deposit_amount: deposit_amount.toString(),
          commission_amount: commission_amount.toString(),
          rental_status: 'PENDING_DOC',
          is_mexican,
        },
      ])
      .select()

    if (rentalError) {
      return NextResponse.json(
        { error: rentalError.message, code: 'RENTAL_CREATE_ERROR' },
        { status: 500 }
      )
    }

    const rental = rentalData?.[0]

    if (!rental) {
      return NextResponse.json(
        { error: 'Failed to create rental', code: 'RENTAL_CREATE_ERROR' },
        { status: 500 }
      )
    }

    // Crear preference de pago en Mercado Pago
    const totalAmount = subtotal.plus(deposit_amount)

    const preferenceData = {
      items: [
        {
          id: rental.id,
          title: `Scooter Rental - ${total_days} days`,
          description: `Rental from ${rental_start_date} to ${rental_end_date}`,
          quantity: 1,
          unit_price: parseFloat(totalAmount.toString()),
        },
      ],
      payer: {
        email: user.email || '',
        first_name: user.user_metadata?.first_name || 'Customer',
        last_name: user.user_metadata?.last_name || '',
        phone: user.user_metadata?.phone || '',
      },
      external_reference: rental.id,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/app/rentals/${rental.id}?status=success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/app/rentals/${rental.id}?status=failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/app/rentals/${rental.id}?status=pending`,
      },
      auto_return: 'approved' as const,
    }

    const preference = await createPaymentPreference(preferenceData)

    // Send confirmation email
    if (user.email) {
      const emailHtml = rentalConfirmationEmail({
        customerName: user.user_metadata?.first_name || 'Customer',
        rentalId: rental.id,
        scooterModel: `Scooter ${scooter_id}`,
        startDate: rental_start_date,
        endDate: rental_end_date,
        totalAmount: subtotal.plus(deposit_amount).toString(),
        dashboardLink: `${process.env.NEXT_PUBLIC_APP_URL}/app/rentals/${rental.id}`,
      })

      await sendEmail({
        to: user.email,
        subject: '¡Tu reserva de scooter en PUNTA BIKERS está confirmada! 🎉',
        html: emailHtml,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        rental,
        payment_url: preference.init_point,
        payment_id: preference.id,
      },
    })
  } catch (err: any) {
    console.error('Error creating rental:', err)
    return NextResponse.json(
      { error: 'Failed to create rental', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
