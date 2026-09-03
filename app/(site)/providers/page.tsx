import type { Metadata } from 'next'
import { getProviders, getQpus } from '@/lib/data'
import ProviderListClient from '@/components/provider/ProviderListClient'

export const metadata: Metadata = {
  title: 'Quantum Hardware Providers',
  description:
    'Discover quantum computing companies building QPU hardware. Compare manufacturers by architecture, qubit count, cloud availability, and commercial status.',
}

export default async function ProvidersPage() {
  const [providers, qpus] = await Promise.all([getProviders(), getQpus()])
  return <ProviderListClient providers={providers} qpus={qpus} />
}
