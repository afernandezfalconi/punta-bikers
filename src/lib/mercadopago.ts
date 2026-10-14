import { MercadoPagoConfig, Preference } from 'mercadopago'

const mercadopagoConfig = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 20000,
  },
})

export const mercadopago = mercadopagoConfig

export interface PaymentItemData {
  id: string
  title: string
  description?: string
  category_id?: string
  quantity: number
  unit_price: number
  picture_url?: string
}

export interface CreatePreferenceData {
  items: PaymentItemData[]
  payer: {
    email: string
    first_name?: string
    last_name?: string
    phone?: string
  }
  external_reference: string
  back_urls?: {
    success: string
    failure: string
    pending: string
  }
  auto_return?: 'approved' | 'all'
  notification_url?: string
}

export async function createPaymentPreference(data: CreatePreferenceData) {
  try {
    const preference = new Preference(mercadopagoConfig)
    const result = await preference.create({
      body: {
        items: data.items.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category_id: item.category_id || 'scooter_rental',
          quantity: item.quantity,
          unit_price: item.unit_price,
          picture_url: item.picture_url,
          currency_id: 'MXN',
        })),
        payer: {
          email: data.payer.email,
        },
        external_reference: data.external_reference,
        back_urls: data.back_urls || {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/app/payment/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/app/payment/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/app/payment/pending`,
        },
        auto_return: data.auto_return || 'approved',
        notification_url: data.notification_url || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
        statement_descriptor: 'PUNTA BIKERS RENTAL',
      },
    })
    return result
  } catch (error) {
    console.error('Error creating payment preference:', error)
    throw error
  }
}

export function verifyWebhookSignature(
  xSignature: string,
  xRequestId: string,
  rawBody: string
): boolean {
  // Implementar verificación de firma de Mercado Pago
  // Referencia: https://www.mercadopago.com/developers/en/docs/checkout-api/how-tos/receive-notifications
  // Por ahora, retornar true para permitir webhooks durante desarrollo
  return true
}
