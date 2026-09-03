import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFrameworkBySlug, getFrameworks, getQpus } from '@/lib/data'
import { FrameworkDetail } from '@/components/framework/FrameworkDetail'

export async function generateStaticParams() {
  const frameworks = await getFrameworks()
  return frameworks.map(f => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const framework = await getFrameworkBySlug(slug)
  if (!framework) return {}
  return {
    title: `${framework.name} — Quantum Framework`,
    description: framework.description.slice(0, 160),
  }
}

export default async function FrameworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [framework, allQpus] = await Promise.all([
    getFrameworkBySlug(slug),
    getQpus(),
  ])
  if (!framework) notFound()
  const compatibleQpus = allQpus.filter(q => q.frameworks.includes(framework.id))
  return <FrameworkDetail framework={framework} compatibleQpus={compatibleQpus} />
}
