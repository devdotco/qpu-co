import type { Metadata } from 'next'
import { getQpus, getBenchmarks } from '@/lib/data'
import BenchmarksClient from '@/components/benchmarks/BenchmarksClient'

export const metadata: Metadata = {
  title: 'QPU Benchmarks | QPU.co',
  description:
    'Quantum processor performance metrics including Quantum Volume, CLOPS, gate fidelity, readout fidelity, and algorithmic qubit benchmarks.',
}

export default async function BenchmarksPage() {
  const [qpus, benchmarks] = await Promise.all([getQpus(), getBenchmarks()])
  return <BenchmarksClient qpus={qpus} benchmarks={benchmarks} />
}
