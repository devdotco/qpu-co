import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getUseCaseBySlug, getUseCases, getQpus } from '@/lib/data'
import UseCaseDetail from '@/components/use-case/UseCaseDetail'

export async function generateStaticParams() {
  const useCases = await getUseCases()
  return useCases.map((uc) => ({ slug: uc.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const useCase = await getUseCaseBySlug(slug)
  if (!useCase) return { title: 'Use Case Not Found' }
  return {
    title: `${useCase.name} and Quantum Computing`,
    description: `${useCase.description.slice(0, 160)}`,
  }
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [useCase, qpus] = await Promise.all([
    getUseCaseBySlug(slug),
    getQpus(),
  ])

  if (!useCase) notFound()

  return <UseCaseDetail useCase={useCase} qpus={qpus} />
}
