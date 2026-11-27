'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Doc {
  id: string
  rental_id: string
  document_type: string
  created_at: string
  front_url: string | null
  back_url: string | null
}

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<Doc[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch('/api/documents?status=pending')
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 403 ? 'Solo administradores' : 'No se pudo cargar')
        const data: Doc[] = await res.json()
        if (!cancelled) setDocs(data)
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error')
      })
    return () => {
      cancelled = true
    }
  }, [tick])

  async function review(doc: Doc, action: 'approve' | 'reject') {
    let reason = ''
    if (action === 'reject') {
      reason = window.prompt('Motivo del rechazo (se envía al cliente):')?.trim() ?? ''
      if (reason.length < 3) return
    }
    setBusy(doc.id)
    setError('')
    try {
      const res = await fetch(`/api/documents/${doc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action === 'approve' ? { action } : { action, reason }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'No se pudo guardar')
      setTick((t) => t + 1)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin" className="text-orange-400 text-sm">← Admin</Link>
        <h1 className="text-3xl font-bold my-4">Documentos por revisar</h1>
        {error && <p className="mb-4 rounded-lg bg-red-500/20 text-red-200 px-4 py-3">{error}</p>}
        {docs?.length === 0 && <p className="text-slate-300">No hay documentos pendientes.</p>}
        <div className="space-y-4">
          {docs?.map((d) => (
            <div key={d.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5">
              <p className="font-semibold">{d.document_type} · renta {d.rental_id.slice(0, 8)}</p>
              <div className="my-3 flex flex-wrap gap-4 text-sm">
                {d.front_url && <a href={d.front_url} target="_blank" rel="noreferrer" className="text-orange-300 underline">Ver frente</a>}
                {d.back_url && <a href={d.back_url} target="_blank" rel="noreferrer" className="text-orange-300 underline">Ver reverso</a>}
              </div>
              <div className="flex gap-3">
                <button disabled={busy === d.id} onClick={() => review(d, 'approve')}
                  className="rounded-lg bg-green-600 px-4 py-2 font-semibold hover:bg-green-700 disabled:opacity-50">Aprobar</button>
                <button disabled={busy === d.id} onClick={() => review(d, 'reject')}
                  className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-700 disabled:opacity-50">Rechazar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
