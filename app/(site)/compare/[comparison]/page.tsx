import type { Metadata } from 'next'
import { getQpus } from '@/lib/data'
import CompareClient from '@/components/compare/CompareClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ comparison: string }>
}): Promise<Metadata> {
  const { comparison } = await params
  const slugs = comparison.split('-vs-').map(s => s.trim())
  const formatted = slugs.map(s => s.replace(/-/g, ' ')).join(' vs. ')
  return {
    title: `${formatted} — Quantum Processor Comparison`,
    description: `Compare quantum processors: ${formatted}. Side-by-side specs, fidelity, qubits, cloud access, and framework support.`,
  }
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ comparison: string }>
}) {
  const { comparison } = await params
  const slugs = comparison.split('-vs-').map(s => s.trim())
  const allQpus = await getQpus()
  return <CompareClient qpus={allQpus} initialSlugs={slugs} />
}
