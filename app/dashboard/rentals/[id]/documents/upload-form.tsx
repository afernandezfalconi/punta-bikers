'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const MAX = 5 * 1024 * 1024

export function UploadForm({ id }: { id: string }) {
  const router = useRouter()
  const [documentType, setDocumentType] = useState<'INE' | 'PASSPORT'>('INE')
  const [front, setFront] = useState<File | null>(null)
  const [back, setBack] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!front || !back) return setError('Sube el frente y el reverso')
    if (front.size > MAX || back.size > MAX) return setError('Cada archivo debe pesar máximo 5MB')

    setLoading(true)
    try {
      const body = new FormData()
      body.set('rentalId', id)
      body.set('documentType', documentType)
      body.set('front', front)
      body.set('back', back)
      const res = await fetch('/api/documents', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No se pudieron subir los documentos')
      router.push(`/dashboard/rentals/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-6">
      <form onSubmit={submit} className="max-w-xl mx-auto space-y-5">
        <Link href={`/dashboard/rentals/${id}`} className="text-orange-400 text-sm inline-block">← Volver</Link>
        <h1 className="text-3xl font-bold">Verifica tu identidad</h1>

        {error && <p className="rounded-lg bg-red-500/20 text-red-200 px-4 py-3">{error}</p>}

        <label className="block">
          <span className="mb-1 block text-sm text-slate-300">Tipo de documento</span>
          <select
            id="documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as 'INE' | 'PASSPORT')}
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3"
          >
            <option value="INE" className="text-black">INE</option>
            <option value="PASSPORT" className="text-black">Pasaporte</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-300">Frente (JPG, PNG o PDF, máx. 5MB)</span>
          <input id="front" type="file" accept="image/jpeg,image/png,application/pdf" capture="environment"
            onChange={(e) => setFront(e.target.files?.[0] ?? null)} className="w-full text-sm" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-300">Reverso (JPG, PNG o PDF, máx. 5MB)</span>
          <input id="back" type="file" accept="image/jpeg,image/png,application/pdf" capture="environment"
            onChange={(e) => setBack(e.target.files?.[0] ?? null)} className="w-full text-sm" />
        </label>

        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-orange-500 px-5 py-3 font-semibold hover:bg-orange-600 disabled:opacity-50">
          {loading ? 'Subiendo…' : 'Enviar a revisión'}
        </button>
        <p className="text-xs text-slate-400">Tus documentos se guardan en un espacio privado y solo los revisa nuestro equipo.</p>
      </form>
    </div>
  )
}
