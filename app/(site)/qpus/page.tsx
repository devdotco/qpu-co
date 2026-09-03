import { Suspense } from 'react'
import type { Metadata } from 'next'
import QPUListClient from '@/components/qpu/QPUListClient'
import { getQpus, getProviders } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Quantum Processing Units',
  description:
    'Explore quantum processors across architectures, manufacturers, cloud platforms, and access models. Compare QPUs from IBM, IonQ, Rigetti, Quantinuum, IQM, QuEra, and more.',
}

export default async function QPUsPage() {
  const [qpus, providers] = await Promise.all([getQpus(), getProviders()])
  return (
    <Suspense>
      <QPUListClient qpus={qpus} providers={providers} />
    </Suspense>
  )
}
