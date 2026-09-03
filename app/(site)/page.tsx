import type { Metadata } from 'next'
import { getQpus, getProviders, getArchitectures, getArticles } from '@/lib/data'

import Hero from '@/components/home/Hero'
import MarketMetrics from '@/components/home/MarketMetrics'
import QPUExplorerSection from '@/components/home/QPUExplorerSection'
import ArchitectureExplorer from '@/components/home/ArchitectureExplorer'
import ComparePreview from '@/components/home/ComparePreview'
import AdvisorSection from '@/components/home/AdvisorSection'
import CloudAccess from '@/components/home/CloudAccess'
import WorkloadMatrix from '@/components/home/WorkloadMatrix'
import BenchmarksPreview from '@/components/home/BenchmarksPreview'
import IntelligencePreview from '@/components/home/IntelligencePreview'
import EnterpriseCTA from '@/components/home/EnterpriseCTA'
import Newsletter from '@/components/home/Newsletter'

export const metadata: Metadata = {
  title: "QPU.co — The World's Quantum Computers. One Platform.",
  description:
    'Compare quantum processors, architectures, providers, access options, benchmarks, and availability. Find the QPU best suited to your workload.',
  openGraph: {
    title: "QPU.co — The World's Quantum Computers. One Platform.",
    description:
      'Independent quantum-computing hardware intelligence. Compare QPUs, architectures, providers, benchmarks, and access options.',
    type: 'website',
    url: 'https://qpu.co',
  },
}

export default async function HomePage() {
  const [qpus, providers, architectures, articles] = await Promise.all([
    getQpus(),
    getProviders(),
    getArchitectures(),
    getArticles(undefined, 6),
  ])

  return (
    <>
      <Hero />
      <MarketMetrics qpus={qpus} providers={providers} />
      <QPUExplorerSection qpus={qpus} />
      <ArchitectureExplorer architectures={architectures} />
      <ComparePreview qpus={qpus} />
      <AdvisorSection />
      <CloudAccess />
      <WorkloadMatrix />
      <BenchmarksPreview />
      <IntelligencePreview articles={articles.slice(0, 3)} allArticles={articles} />
      <EnterpriseCTA />
      <Newsletter />
    </>
  )
}
