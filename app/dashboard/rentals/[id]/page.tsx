import { Suspense } from 'react'
import { RentalDetail } from './rental-detail'

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <RentalDetail id={id} />
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="p-6 text-slate-300">Cargando…</p>}>
      <Content params={params} />
    </Suspense>
  )
}
