import type { Metadata } from 'next'
import { getQpus } from '@/lib/data'
import CompareClient from '@/components/compare/CompareClient'

export const metadata: Metadata = {
  title: 'Compare Quantum Processors',
  description:
    'Compare quantum processing units side by side. Evaluate architecture, qubit count, connectivity, gate fidelity, access options, pricing, and framework support.',
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ qpus?: string }>
}) {
  const { qpus: qpuParam } = await searchParams
  const allQpus = await getQpus()
  const initialSlugs = qpuParam ? qpuParam.split(',').slice(0, 4) : []
  return <CompareClient qpus={allQpus} initialSlugs={initialSlugs} />
}
