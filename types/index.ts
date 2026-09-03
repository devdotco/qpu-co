// ─── Core Enums / Literal Types ──────────────────────────────────────────────

export type ArchitectureType =
  | 'superconducting'
  | 'trapped-ion'
  | 'neutral-atom'
  | 'photonic'
  | 'quantum-annealing'
  | 'topological'

export type QPUStatus =
  | 'public'
  | 'cloud'
  | 'reservation'
  | 'private'
  | 'research'
  | 'announced'
  | 'retired'
  | 'offline'

export type AccessModel =
  | 'pay-per-shot'
  | 'pay-per-task'
  | 'reservation'
  | 'subscription'
  | 'enterprise'
  | 'research'
  | 'open-access'

export type SourceType =
  | 'manufacturer'
  | 'cloud-provider'
  | 'research'
  | 'technical-paper'
  | 'announcement'
  | 'secondary'

export type SuitabilityLevel =
  | 'strong'
  | 'possible'
  | 'experimental'
  | 'limited'
  | 'unknown'

export type BenchmarkMetric =
  | 'quantum-volume'
  | 'clops'
  | 'algorithmic-qubits'
  | 'gate-fidelity'
  | 'readout-fidelity'
  | 'logical-error-rate'
  | 'circuit-depth'
  | 't1'
  | 't2'

// ─── Source ──────────────────────────────────────────────────────────────────

export interface Source {
  title: string
  publisher: string
  url: string
  publishedAt?: string
  accessedAt: string
  sourceType: SourceType
}

// ─── Metric ──────────────────────────────────────────────────────────────────

export interface Metric {
  value: number | null
  unit: string
  source: Source
  measuredAt?: string | null
  notes?: string | null
}

// ─── Coherence / Fidelity sub-structs ────────────────────────────────────────

export interface CoherenceSpec {
  t1?: Metric
  t2?: Metric
  t2star?: Metric
}

export interface FidelitySpec {
  singleQubitGate?: Metric
  twoQubitGate?: Metric
  readout?: Metric
  statePreparation?: Metric
}

export interface ConnectivitySpec {
  topology: string
  avgDegree?: number | null
  allToAll: boolean
  description?: string | null
}

export interface PricingData {
  provider: string
  platform: string
  model: AccessModel
  pricePerShot?: number | null
  pricePerTask?: number | null
  currency: string
  notes: string
  source: Source | null
  isVerified: boolean
}

// ─── QPU ─────────────────────────────────────────────────────────────────────

export interface QPU {
  id: string
  slug: string
  name: string
  providerId: string
  architecture: ArchitectureType
  /** Broad paradigm label, e.g. "gate-based", "annealing", "analog" */
  paradigm: 'gate-based' | 'annealing' | 'analog' | 'hybrid'
  status: QPUStatus
  physicalQubits: number | null
  logicalQubits: number | null
  /** For trapped-ion systems: IonQ's Algorithmic Qubit (#AQ) measure */
  algorithmicQubits?: number | null
  connectivity: ConnectivitySpec | null
  nativeGates: string[] | null
  coherence: CoherenceSpec | null
  fidelity: FidelitySpec | null
  benchmarks: Benchmark[] | null
  frameworks: string[]
  cloudPlatforms: string[]
  regions: string[]
  accessModels: AccessModel[]
  pricing: PricingData | null
  /** Qubit topology / layout name, e.g. "heavy-hex", "pegasus" */
  topology: string | null
  sources: Source[]
  announcedAt: string | null
  releasedAt: string | null
  updatedAt: string
  verifiedAt: string | null
  description?: string
  notes?: string
}

// ─── Provider ────────────────────────────────────────────────────────────────

export interface Provider {
  id: string
  slug: string
  name: string
  shortName: string
  country: string
  founded: number | null
  description: string
  primaryArchitecture: ArchitectureType
  secondaryArchitectures: ArchitectureType[]
  logoText: string
  website: string
  documentation: string | null
  status: 'active' | 'acquired' | 'defunct' | 'stealth'
  employees: string | null
  funding: string | null
}

// ─── Architecture ────────────────────────────────────────────────────────────

export interface Architecture {
  id: string
  slug: string
  name: string
  qubitMedium: string
  controlMechanism: string
  operatingEnvironment: string
  gateSpeed: string
  connectivity: string
  coherenceNotes: string
  scalingChallenges: string
  advantages: string[]
  leadingCompanies: string[]
  description: string
}

// ─── Benchmark ───────────────────────────────────────────────────────────────

export interface Benchmark {
  id: string
  qpuId: string
  metric: BenchmarkMetric
  value: number
  unit: string
  source: Source
  measuredAt: string
  methodology: string | null
  notes: string | null
  isComparable: boolean
}

// ─── Cloud Platform ──────────────────────────────────────────────────────────

export interface CloudPlatform {
  id: string
  slug: string
  name: string
  providers: string[]
  frameworks: string[]
  regions: string[]
  accessModels: AccessModel[]
  pricingModel: string
  status: 'active' | 'beta' | 'deprecated' | 'announced'
  website: string
  description: string
}

// ─── Framework ───────────────────────────────────────────────────────────────

export interface Framework {
  id: string
  slug: string
  name: string
  maintainer: string
  language: string[]
  supportedArchitectures: ArchitectureType[]
  cloudPlatforms: string[]
  description: string
  githubUrl: string
  docsUrl: string
  version: string | null
}

// ─── Use Case ────────────────────────────────────────────────────────────────

export type UseCaseStatus =
  | 'theoretical'
  | 'research'
  | 'experimental'
  | 'demonstrated'
  | 'commercial'

export interface UseCase {
  id: string
  slug: string
  name: string
  category: string
  description: string
  architectureSuitability: Record<ArchitectureType, SuitabilityLevel>
  status: UseCaseStatus
  qubitRequirement: string
  timelineEstimate: string | null
  keyChallenge: string
}

// ─── Article ─────────────────────────────────────────────────────────────────

export type ArticleCategory =
  | 'hardware'
  | 'research'
  | 'business'
  | 'benchmarks'
  | 'software'
  | 'policy'

export interface Article {
  id: string
  slug: string
  title: string
  dek: string
  author: string
  publishedAt: string
  updatedAt: string | null
  readingTime: number
  category: ArticleCategory
  tags: string[]
  content: string | null
  excerpt: string
}

// ─── Company ─────────────────────────────────────────────────────────────────

export interface Company {
  id: string
  slug: string
  name: string
  category:
    | 'hardware'
    | 'software'
    | 'cloud'
    | 'investor'
    | 'research'
    | 'service'
  country: string
  description: string
  website: string
  founded: number | null
  status: 'active' | 'acquired' | 'defunct' | 'stealth' | 'public'
}

// ─── Roadmap Event ───────────────────────────────────────────────────────────

export interface RoadmapEvent {
  id: string
  providerId: string
  title: string
  description: string
  targetDate: string | null
  announcedDate: string
  status: 'released' | 'current' | 'announced' | 'targeted' | 'conceptual'
  source: Source
  qpuSlug: string | null
}

// ─── Advisor / Recommender ───────────────────────────────────────────────────

export interface AdvisorResult {
  recommendedArchitecture: ArchitectureType
  recommendedQPUs: string[]
  fitScore: number
  reasoning: string[]
  tradeoffs: string[]
  accessRoutes: string[]
  frameworkCompatibility: string[]
  disclaimer: string
}

// ─── Workload Matrix ─────────────────────────────────────────────────────────

export interface WorkloadMatrixCell {
  workload: string
  architecture: ArchitectureType
  suitability: SuitabilityLevel
  notes: string
}

// ─── Filter Types ────────────────────────────────────────────────────────────

export interface QPUFilters {
  architecture?: ArchitectureType[]
  provider?: string[]
  status?: QPUStatus[]
  cloudPlatform?: string[]
  framework?: string[]
  minQubits?: number
  paradigm?: string
}

export interface ProviderFilters {
  country?: string[]
  architecture?: ArchitectureType[]
  status?: Provider['status'][]
}
