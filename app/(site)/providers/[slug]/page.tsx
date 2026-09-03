import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProviderBySlug, getProviders, getQpus, getRoadmapEvents } from '@/lib/data'
import ProviderDetailPage from '@/components/provider/ProviderDetailPage'

export async function generateStaticParams() {
  const providers = await getProviders()
  return providers.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const provider = await getProviderBySlug(slug)
  if (!provider) return { title: 'Provider Not Found' }
  return {
    title: `${provider.name} — Quantum Hardware Provider`,
    description: `${provider.name} quantum computing hardware. Architecture: ${provider.primaryArchitecture}. QPU specifications, access options, cloud platforms, and hardware roadmap.`,
  }
}

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const provider = await getProviderBySlug(slug)
  if (!provider) notFound()

  const [allQpus, roadmapEvents] = await Promise.all([
    getQpus(),
    getRoadmapEvents(provider.id),
  ])

  const providerQpus = allQpus.filter(q => q.providerId === provider.id)

  return (
    <ProviderDetailPage
      provider={provider}
      qpus={providerQpus}
      roadmapEvents={roadmapEvents}
    />
  )
}
