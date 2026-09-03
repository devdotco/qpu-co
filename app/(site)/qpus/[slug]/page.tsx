import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getQpuBySlug, getQpus, getProviderBySlug } from '@/lib/data'
import QPUDetailPage from '@/components/qpu/QPUDetailPage'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const qpus = await getQpus()
  return qpus.map(q => ({ slug: q.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const qpu = await getQpuBySlug(slug)
  if (!qpu) return { title: 'QPU Not Found' }

  const provider = await getProviderBySlug(qpu.providerId)
  const providerName = provider?.name ?? qpu.providerId

  return {
    title: `${qpu.name} — ${qpu.physicalQubits ? `${qpu.physicalQubits.toLocaleString('en-US')}-Qubit ` : ''}Quantum Processor`,
    description: `Specifications, benchmarks, access options, and availability for the ${qpu.name} from ${providerName}. Architecture: ${qpu.architecture}.`,
    openGraph: {
      title: `${qpu.name} | QPU.co`,
      description: qpu.description ?? `${architectureLabel(qpu.architecture)} quantum processor from ${providerName}. ${qpu.physicalQubits ? `${qpu.physicalQubits} physical qubits.` : ''}`,
      type: 'article',
    },
  }
}

function architectureLabel(arch: string): string {
  const labels: Record<string, string> = {
    superconducting: 'Superconducting',
    'trapped-ion': 'Trapped Ion',
    'neutral-atom': 'Neutral Atom',
    photonic: 'Photonic',
    'quantum-annealing': 'Quantum Annealing',
    topological: 'Topological',
  }
  return labels[arch] ?? arch
}

export default async function QPUPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const qpu = await getQpuBySlug(slug)
  if (!qpu) notFound()

  // Related QPUs: same architecture, excluding this one, limit 4
  const allQpus = await getQpus()
  const relatedQpus = allQpus
    .filter(q => q.architecture === qpu.architecture && q.id !== qpu.id)
    .slice(0, 4)

  return <QPUDetailPage qpu={qpu} relatedQpus={relatedQpus} />
}
