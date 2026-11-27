import crypto from 'crypto'

/**
 * Verifies a Mercado Pago webhook signature.
 * Manifest per MP docs: `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`
 * Fails closed when the secret or any input is missing.
 */
export function verifyMercadoPagoSignature(input: {
  secret: string | undefined
  signature: string | null
  requestId: string | null
  dataId: string | null
}): boolean {
  const { secret, signature, requestId, dataId } = input
  if (!secret || !signature || !requestId || !dataId) return false

  let ts = ''
  let v1 = ''
  for (const part of signature.split(',')) {
    const [key, value] = part.split('=')
    if (key?.trim() === 'ts') ts = value
    if (key?.trim() === 'v1') v1 = value
  }
  if (!ts || !v1) return false

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`
  const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex')

  const a = Buffer.from(v1)
  const b = Buffer.from(expected)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
