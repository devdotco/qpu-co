import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getArchitectures, getArchitectureBySlug, getQpus, getUseCases, getProviders } from '@/lib/data'
import { ArchitectureDetail } from '@/components/architecture/ArchitectureDetail'
import { architectureContent } from '@/data/architecture-content'

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const archs = await getArchitectures()
  return archs.map(a => ({ slug: a.slug }))
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const arch = await getArchitectureBySlug(slug)
  if (!arch) return { title: 'Architecture Not Found | QPU.co' }
  return {
    title: `${arch.name} Quantum Computers | QPU.co`,
    description: `How ${arch.name} quantum processors work — physical mechanism, leading manufacturers, advantages, limitations, connectivity, and workload suitability.`,
    openGraph: {
      title: `${arch.name} Quantum Computing Architecture`,
      description: arch.description,
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ArchitecturePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [arch, allQpus, allUseCases, allProviders] = await Promise.all([
    getArchitectureBySlug(slug),
    getQpus(),
    getUseCases(),
    getProviders(),
  ])

  if (!arch) notFound()

  const qpus = allQpus.filter(q => q.architecture === slug)
  const content = architectureContent[slug]

  // If content is missing, fall back to empty (shouldn't happen for the 6 known slugs)
  if (!content) notFound()

  const providers = allProviders.map(p => ({ slug: p.slug, name: p.name }))

  return (
    <ArchitectureDetail
      architecture={arch}
      qpus={qpus}
      content={content}
      useCases={allUseCases}
      providers={providers}
    />
  )
}
