'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Rental {
  id: string
  status: 'pending_doc' | 'pending_payment' | 'active' | 'completed' | 'cancelled'
  cost: number | string
  created_at: string
  scooters: { model: string; license_plate: string } | null
  documents: { id: string; status: string; rejection_reason: string | null }[]
}

const STEPS = [
  { key: 'pending_doc', label: 'Documentos' },
  { key: 'pending_payment', label: 'Pago' },
  { key: 'active', label: 'Activa' },
  { key: 'completed', label: 'Completada' },
] as const

export function RentalDetail({ id }: { id: string }) {
  const [rental, setRental] = useState<Rental | null>(null)
  const [error, setError] = useState('')
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    fetch(`/api/rentals/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('No se pudo cargar la renta')
        setRental(await res.json())
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Error'))
  }, [id])

  async function pay() {
    setPaying(true)
    setError('')
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rental_id: id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No se pudo iniciar el pago')
      window.location.href = data.checkout_url
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
      setPaying(false)
    }
  }

  const current = rental ? STEPS.findIndex((s) => s.key === rental.status) : -1
  const lastDoc = rental?.documents?.[rental.documents.length - 1]
  const hasPendingDoc = rental?.documents?.some((d) => d.status === 'pending')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/rentals" className="text-orange-400 hover:text-orange-300 text-sm mb-4 inline-block">
          ← Volver a rentas
        </Link>
        <h1 className="text-3xl font-bold mb-6">Detalle de renta</h1>

        {error && <p className="mb-4 rounded-lg bg-red-500/20 text-red-200 px-4 py-3">{error}</p>}
        {!rental && !error && <p className="text-slate-300">Cargando…</p>}

        {rental && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold">{rental.scooters?.model ?? 'Scooter'}</h2>
              <p className="text-slate-300 text-sm mb-6">
                {rental.scooters?.license_plate} · Total ${Number(rental.cost).toFixed(2)} MXN
              </p>

              {rental.status === 'cancelled' ? (
                <p className="text-red-300">Renta cancelada</p>
              ) : (
                <ol className="grid grid-cols-4 gap-2" aria-label="Progreso de la renta">
                  {STEPS.map((s, i) => (
                    <li key={s.key} className="text-center">
                      <div className={`h-2 rounded-full ${i <= current ? 'bg-orange-500' : 'bg-white/20'}`} />
                      <span className={`mt-2 block text-xs ${i <= current ? 'text-white' : 'text-slate-400'}`}>{s.label}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {rental.status === 'pending_doc' && (
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                {hasPendingDoc ? (
                  <p>Tus documentos están en revisión. Te avisaremos por correo cuando sean aprobados.</p>
                ) : (
                  <>
                    {lastDoc?.status === 'rejected' && (
                      <p className="mb-3 rounded-lg bg-yellow-500/20 text-yellow-100 px-4 py-3">
                        Documento rechazado: {lastDoc.rejection_reason}
                      </p>
                    )}
                    <p className="mb-4">Sube tu INE o pasaporte para continuar.</p>
                    <Link
                      href={`/dashboard/rentals/${rental.id}/documents`}
                      className="inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold hover:bg-orange-600"
                    >
                      Subir documentos
                    </Link>
                  </>
                )}
              </div>
            )}

            {rental.status === 'pending_payment' && (
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <p className="mb-4">Documentos aprobados. Ya puedes pagar para activar tu renta.</p>
                <button
                  onClick={pay}
                  disabled={paying}
                  className="rounded-lg bg-orange-500 px-5 py-3 font-semibold hover:bg-orange-600 disabled:opacity-50"
                >
                  {paying ? 'Redirigiendo…' : 'Pagar con Mercado Pago'}
                </button>
              </div>
            )}

            {rental.status === 'active' && (
              <p className="rounded-2xl bg-green-500/20 text-green-100 p-6">Pago recibido. Tu renta está activa.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
