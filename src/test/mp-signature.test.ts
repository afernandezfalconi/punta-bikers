import { describe, it, expect } from 'vitest'
import crypto from 'crypto'
import { verifyMercadoPagoSignature } from '@/lib/mp-signature'

const secret = 'test-secret'
const sign = (dataId: string, requestId: string, ts: string) =>
  crypto.createHmac('sha256', secret).update(`id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`).digest('hex')

describe('verifyMercadoPagoSignature', () => {
  const base = { secret, requestId: 'req-1', dataId: 'ABC123' }

  it('accepts a correctly signed request', () => {
    const v1 = sign('ABC123', 'req-1', '1700000000')
    expect(verifyMercadoPagoSignature({ ...base, signature: `ts=1700000000,v1=${v1}` })).toBe(true)
  })

  it('rejects a tampered payment id', () => {
    const v1 = sign('ABC123', 'req-1', '1700000000')
    expect(verifyMercadoPagoSignature({ ...base, dataId: 'OTHER', signature: `ts=1700000000,v1=${v1}` })).toBe(false)
  })

  it('rejects a wrong hash', () => {
    expect(verifyMercadoPagoSignature({ ...base, signature: 'ts=1700000000,v1=deadbeef' })).toBe(false)
  })

  it('fails closed when the secret is not configured', () => {
    const v1 = sign('ABC123', 'req-1', '1700000000')
    expect(verifyMercadoPagoSignature({ ...base, secret: undefined, signature: `ts=1700000000,v1=${v1}` })).toBe(false)
    expect(verifyMercadoPagoSignature({ ...base, secret: '', signature: `ts=1700000000,v1=${v1}` })).toBe(false)
  })

  it('rejects missing headers or malformed signatures', () => {
    expect(verifyMercadoPagoSignature({ ...base, signature: null })).toBe(false)
    expect(verifyMercadoPagoSignature({ ...base, requestId: null, signature: 'ts=1,v1=aa' })).toBe(false)
    expect(verifyMercadoPagoSignature({ ...base, dataId: null, signature: 'ts=1,v1=aa' })).toBe(false)
    expect(verifyMercadoPagoSignature({ ...base, signature: 'garbage' })).toBe(false)
  })
})
