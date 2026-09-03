/**
 * QPU.co Data Service Layer
 *
 * All functions are async and return typed data from local seed files.
 * Signatures are CMS-swappable: replace the body of any function with a
 * fetch/GraphQL call and the rest of the app continues to work unchanged.
 */

import type {
  QPU,
  Provider,
  Architecture,
  Benchmark,
  CloudPlatform,
  Framework,
  UseCase,
  Article,
  RoadmapEvent,
  QPUFilters,
  ProviderFilters,
  ArchitectureType,
  QPUStatus,
} from '../../types'

import { qpus } from '../../data/qpus'
import { providers } from '../../data/providers'
import { architectures } from '../../data/architectures'
import { frameworks } from '../../data/frameworks'
import { cloudPlatforms } from '../../data/cloud-platforms'
import { useCases } from '../../data/use-cases'
import { articles } from '../../data/articles'
import { workloadMatrix } from '../../data/workload-matrix'

// ── QPUs ──────────────────────────────────────────────────────────────────────

export async function getQpus(filters?: QPUFilters): Promise<QPU[]> {
  let results = [...qpus]

  if (filters?.architecture?.length) {
    results = results.filter((q) =>
      filters.architecture!.includes(q.architecture as ArchitectureType)
    )
  }

  if (filters?.provider?.length) {
    results = results.filter((q) => filters.provider!.includes(q.providerId))
  }

  if (filters?.status?.length) {
    results = results.filter((q) =>
      filters.status!.includes(q.status as QPUStatus)
    )
  }

  if (filters?.cloudPlatform?.length) {
    results = results.filter((q) =>
      q.cloudPlatforms.some((p) => filters.cloudPlatform!.includes(p))
    )
  }

  if (filters?.framework?.length) {
    results = results.filter((q) =>
      q.frameworks.some((f) => filters.framework!.includes(f))
    )
  }

  if (filters?.minQubits !== undefined) {
    results = results.filter(
      (q) => q.physicalQubits !== null && q.physicalQubits >= filters.minQubits!
    )
  }

  if (filters?.paradigm) {
    results = results.filter((q) => q.paradigm === filters.paradigm)
  }

  return results
}

export async function getQpuBySlug(slug: string): Promise<QPU | null> {
  return qpus.find((q) => q.slug === slug) ?? null
}

// ── Providers ─────────────────────────────────────────────────────────────────

export async function getProviders(filters?: ProviderFilters): Promise<Provider[]> {
  let results = [...providers]

  if (filters?.country?.length) {
    results = results.filter((p) => filters.country!.includes(p.country))
  }

  if (filters?.architecture?.length) {
    results = results.filter((p) =>
      filters.architecture!.includes(p.primaryArchitecture) ||
      p.secondaryArchitectures.some((a) => filters.architecture!.includes(a))
    )
  }

  if (filters?.status?.length) {
    results = results.filter((p) => filters.status!.includes(p.status))
  }

  return results
}

export async function getProviderBySlug(slug: string): Promise<Provider | null> {
  return providers.find((p) => p.slug === slug) ?? null
}

// ── Architectures ─────────────────────────────────────────────────────────────

export async function getArchitectures(): Promise<Architecture[]> {
  return [...architectures]
}

export async function getArchitectureBySlug(slug: string): Promise<Architecture | null> {
  return architectures.find((a) => a.slug === slug) ?? null
}

// ── Benchmarks ────────────────────────────────────────────────────────────────

export async function getBenchmarks(qpuId?: string): Promise<Benchmark[]> {
  const all: Benchmark[] = qpus.flatMap((q) => q.benchmarks ?? [])
  if (qpuId) {
    return all.filter((b) => b.qpuId === qpuId)
  }
  return all
}

// ── Cloud Platforms ───────────────────────────────────────────────────────────

export async function getCloudPlatforms(): Promise<CloudPlatform[]> {
  return [...cloudPlatforms]
}

export async function getCloudPlatformBySlug(slug: string): Promise<CloudPlatform | null> {
  return cloudPlatforms.find((cp) => cp.slug === slug) ?? null
}

// ── Frameworks ────────────────────────────────────────────────────────────────

export async function getFrameworks(): Promise<Framework[]> {
  return [...frameworks]
}

export async function getFrameworkBySlug(slug: string): Promise<Framework | null> {
  return frameworks.find((f) => f.slug === slug) ?? null
}

// ── Use Cases ─────────────────────────────────────────────────────────────────

export async function getUseCases(): Promise<UseCase[]> {
  return [...useCases]
}

export async function getUseCaseBySlug(slug: string): Promise<UseCase | null> {
  return useCases.find((u) => u.slug === slug) ?? null
}

// ── Articles ──────────────────────────────────────────────────────────────────

export async function getArticles(
  category?: string,
  limit?: number
): Promise<Article[]> {
  let results = [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  if (category) {
    results = results.filter((a) => a.category === category)
  }

  if (limit !== undefined) {
    results = results.slice(0, limit)
  }

  return results
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return articles.find((a) => a.slug === slug) ?? null
}

// ── Roadmap Events ────────────────────────────────────────────────────────────

/**
 * Roadmap events — placeholder returning empty array until seed data is added.
 * Replace with CMS call or add /data/roadmap.ts as needed.
 */
export async function getRoadmapEvents(providerId?: string): Promise<RoadmapEvent[]> {
  void providerId
  return []
}

// ── Workload Matrix ───────────────────────────────────────────────────────────

export { workloadMatrix } from '../../data/workload-matrix'

// ── Comparison / Search ───────────────────────────────────────────────────────

export async function compareQPUs(slugs: string[]): Promise<QPU[]> {
  return slugs
    .map((slug) => qpus.find((q) => q.slug === slug) ?? null)
    .filter((q): q is QPU => q !== null)
}

export async function searchQPUs(query: string): Promise<QPU[]> {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return qpus.filter(
    (qpu) =>
      qpu.name.toLowerCase().includes(q) ||
      qpu.slug.toLowerCase().includes(q) ||
      qpu.providerId.toLowerCase().includes(q) ||
      qpu.architecture.toLowerCase().includes(q) ||
      (qpu.description?.toLowerCase().includes(q) ?? false)
  )
}

// ── Convenience Aggregations ──────────────────────────────────────────────────

/** Return QPUs belonging to a specific provider. */
export async function getQpusByProvider(providerId: string): Promise<QPU[]> {
  return qpus.filter((q) => q.providerId === providerId)
}

/** Return QPUs available on a specific cloud platform. */
export async function getQpusByCloudPlatform(platformSlug: string): Promise<QPU[]> {
  return qpus.filter((q) => q.cloudPlatforms.includes(platformSlug))
}

/** Return all QPUs for a given architecture. */
export async function getQpusByArchitecture(arch: ArchitectureType): Promise<QPU[]> {
  return qpus.filter((q) => q.architecture === arch)
}

/** Return articles tagged with a specific tag. */
export async function getArticlesByTag(tag: string): Promise<Article[]> {
  return articles
    .filter((a) => a.tags.includes(tag))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
}

export type { QPUFilters, ProviderFilters }
