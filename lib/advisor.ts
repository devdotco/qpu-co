import type { ArchitectureType, QPU } from '@/types'

// ── Input Types ───────────────────────────────────────────────────────────────

export type WorkloadCategory =
  | 'chemistry'
  | 'optimization'
  | 'machine-learning'
  | 'finance'
  | 'materials'
  | 'cryptography'
  | 'research'
  | 'other'

export type CircuitDepth = 'shallow' | 'medium' | 'deep' | 'unknown'
export type ErrorSensitivity = 'high-fidelity' | 'moderate' | 'nisq-tolerant'
export type AccessPreference = 'cloud' | 'direct' | 'either'
export type BudgetTier = 'research-free' | 'low-cost' | 'performance-first'
export type Timeline = 'experimental' | 'near-term' | 'future-planning'

export interface AdvisorInput {
  problemDescription: string
  workloadCategory: WorkloadCategory
  circuitDepth: CircuitDepth
  estimatedQubits: number | null
  errorSensitivity: ErrorSensitivity
  hybridClassicalQuantum: boolean | null
  preferredFramework: string | null
  accessPreference: AccessPreference
  budgetTier: BudgetTier
  timeline: Timeline
}

// ── Output Types ──────────────────────────────────────────────────────────────

export interface QPURecommendation {
  qpuId: string
  qpuName: string
  provider: string
  fitScore: number // 0-100
  reasons: string[]
  risks: string[]
  accessRoutes: string[]
}

export interface AdvisorOutput {
  primaryArchitecture: ArchitectureType
  primaryArchitectureConfidence: number // 0-100
  secondaryArchitecture: ArchitectureType | null
  secondaryArchitectureConfidence: number | null
  recommendations: QPURecommendation[]
  frameworkSuggestions: string[]
  disclaimer: string
  methodology: string
}

// ── Static Recommendation Data ────────────────────────────────────────────────

interface QPUStaticData {
  qpuId: string
  qpuName: string
  provider: string
  architecture: ArchitectureType
  baseFitScore: number
  reasons: string[]
  risks: string[]
  accessRoutes: string[]
  /** Status categories that should be excluded for cloud-only access */
  restrictedStatuses: Array<'private' | 'research'>
}

const QPU_STATIC: QPUStaticData[] = [
  {
    qpuId: 'ionq-forte',
    qpuName: 'IonQ Forte',
    provider: 'IonQ',
    architecture: 'trapped-ion',
    baseFitScore: 87,
    reasons: [
      'High two-qubit gate fidelity (99.5%)',
      'All-to-all connectivity reduces circuit overhead',
      'Qiskit, Cirq, and PennyLane compatible',
    ],
    risks: [
      'Lower qubit count (32 physical qubits) may limit problem size',
      'Gate speeds ~10–100x slower than superconducting',
    ],
    accessRoutes: ['AWS Braket', 'Azure Quantum', 'IonQ Cloud'],
    restrictedStatuses: [],
  },
  {
    qpuId: 'quantinuum-h2-1',
    qpuName: 'Quantinuum H2-1',
    provider: 'Quantinuum',
    architecture: 'trapped-ion',
    baseFitScore: 84,
    reasons: [
      'Highest published 2Q fidelity (99.9%)',
      '56 qubits with all-to-all connectivity',
      'Rigorous error correction experiments',
    ],
    risks: [
      'Reservation-based access (not on-demand)',
      'Limited framework ecosystem vs. Qiskit ecosystem',
    ],
    accessRoutes: ['Quantinuum Nexus', 'Azure Quantum'],
    restrictedStatuses: [],
  },
  {
    qpuId: 'ibm-heron-r2',
    qpuName: 'IBM Heron r2',
    provider: 'IBM Quantum',
    architecture: 'superconducting',
    baseFitScore: 82,
    reasons: [
      '156 qubits — larger problem space',
      'Fast gate operations (nanosecond timescale)',
      'Mature Qiskit Runtime ecosystem',
    ],
    risks: [
      'Limited connectivity (heavy-hex topology requires SWAP overhead)',
      'Error rates higher than trapped-ion platforms',
    ],
    accessRoutes: ['IBM Quantum Platform (subscription)'],
    restrictedStatuses: [],
  },
  {
    qpuId: 'rigetti-ankaa-3',
    qpuName: 'Rigetti Ankaa-3',
    provider: 'Rigetti Computing',
    architecture: 'superconducting',
    baseFitScore: 70,
    reasons: [
      'Low-latency gate execution',
      'Available via AWS Braket for broad cloud access',
      'Good for rapid NISQ experimentation',
    ],
    risks: [
      'Smaller qubit count limits circuit width',
      'Fewer native framework integrations than IBM ecosystem',
    ],
    accessRoutes: ['AWS Braket'],
    restrictedStatuses: [],
  },
  {
    qpuId: 'dwave-advantage',
    qpuName: 'D-Wave Advantage',
    provider: 'D-Wave Systems',
    architecture: 'quantum-annealing',
    baseFitScore: 88,
    reasons: [
      '5,627 qubits for large QUBO problems',
      'Proven commercial optimization deployments',
      'Mature Ocean SDK with hybrid solvers',
    ],
    risks: [
      'Non-universal — QUBO/Ising problems only',
      'Quantum advantage vs. classical solvers not demonstrated for most practical problems',
    ],
    accessRoutes: ['D-Wave Leap', 'AWS Braket'],
    restrictedStatuses: [],
  },
  {
    qpuId: 'dwave-advantage2',
    qpuName: 'D-Wave Advantage2',
    provider: 'D-Wave Systems',
    architecture: 'quantum-annealing',
    baseFitScore: 80,
    reasons: [
      'Next-generation annealer with improved connectivity',
      'Zephyr topology increases qubit degree over Pegasus',
      'Ideal for dense graph optimization problems',
    ],
    risks: [
      'Still non-universal annealing paradigm',
      'Research/limited access during early availability period',
    ],
    accessRoutes: ['D-Wave Leap'],
    restrictedStatuses: ['research'],
  },
  {
    qpuId: 'quera-aquila',
    qpuName: 'QuEra Aquila',
    provider: 'QuEra Computing',
    architecture: 'neutral-atom',
    baseFitScore: 75,
    reasons: [
      '256 neutral-atom qubits for analog simulation',
      'Native support for spatial Hamiltonian problems',
      'Available on AWS Braket',
    ],
    risks: [
      'Analog mode — not universal gate-based',
      'Gate-based digital mode still maturing',
    ],
    accessRoutes: ['AWS Braket'],
    restrictedStatuses: [],
  },
  {
    qpuId: 'pasqal-fresnel',
    qpuName: 'PASQAL Fresnel',
    provider: 'PASQAL',
    architecture: 'neutral-atom',
    baseFitScore: 72,
    reasons: [
      'Programmable neutral-atom arrays for analog simulation',
      'Flexible qubit layout for graph-structured problems',
      'European cloud access via PASQAL Cloud',
    ],
    risks: [
      'Smaller ecosystem than IonQ/IBM platforms',
      'Gate-based digital mode in development',
    ],
    accessRoutes: ['PASQAL Cloud'],
    restrictedStatuses: [],
  },
]

// ── Scoring Helpers ───────────────────────────────────────────────────────────

interface ArchScore {
  architecture: ArchitectureType
  score: number
}

function baseArchScores(input: AdvisorInput): ArchScore[] {
  const scores: Record<ArchitectureType, number> = {
    superconducting: 0,
    'trapped-ion': 0,
    'neutral-atom': 0,
    photonic: 0,
    'quantum-annealing': 0,
    topological: 0,
  }

  // ── Category rules ────────────────────────────────────────────────────────
  switch (input.workloadCategory) {
    case 'chemistry':
      if (input.errorSensitivity === 'high-fidelity') {
        scores['trapped-ion'] += 85
        scores['superconducting'] += 65
      } else {
        // nisq-tolerant or moderate
        scores['superconducting'] += 75
        scores['trapped-ion'] += 55
      }
      break

    case 'optimization':
      scores['quantum-annealing'] += 80
      scores['superconducting'] += 60
      if (input.circuitDepth === 'shallow') {
        scores['superconducting'] += 10
      }
      break

    case 'machine-learning':
      scores['superconducting'] += 65
      scores['neutral-atom'] += 55
      break

    case 'finance':
      scores['trapped-ion'] += 70
      scores['superconducting'] += 60
      break

    case 'materials':
      scores['neutral-atom'] += 75
      scores['superconducting'] += 65
      break

    case 'cryptography':
      // Requires fault-tolerant hardware not yet available
      scores['superconducting'] += 40
      scores['trapped-ion'] += 40
      break

    case 'research':
      if (input.circuitDepth === 'deep') {
        scores['trapped-ion'] += 70
        scores['superconducting'] += 50
      } else {
        scores['superconducting'] += 70
        scores['trapped-ion'] += 50
      }
      break

    case 'other':
    default:
      scores['superconducting'] += 60
      break
  }

  // ── Error sensitivity modifiers ───────────────────────────────────────────
  if (input.errorSensitivity === 'high-fidelity') {
    scores['trapped-ion'] = Math.min(100, scores['trapped-ion'] + 20)
    scores['quantum-annealing'] = Math.max(0, scores['quantum-annealing'] - 20)
  } else if (input.errorSensitivity === 'nisq-tolerant') {
    scores['superconducting'] = Math.min(100, scores['superconducting'] + 10)
    scores['quantum-annealing'] = Math.min(100, scores['quantum-annealing'] + 10)
  }

  // ── Circuit depth modifiers ────────────────────────────────────────────────
  if (input.circuitDepth === 'shallow') {
    scores['superconducting'] = Math.min(100, scores['superconducting'] + 10)
  } else if (input.circuitDepth === 'deep') {
    scores['trapped-ion'] = Math.min(100, scores['trapped-ion'] + 15)
    scores['superconducting'] = Math.max(0, scores['superconducting'] - 10)
  }

  return (Object.keys(scores) as ArchitectureType[])
    .map((arch) => ({ architecture: arch, score: scores[arch] }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
}

function frameworkSuggestions(input: AdvisorInput, primary: ArchitectureType): string[] {
  switch (input.workloadCategory) {
    case 'chemistry':
      return ['pennylane', 'qiskit']
    case 'optimization':
      return primary === 'quantum-annealing'
        ? ['amazon-braket-sdk']
        : ['qiskit', 'pennylane']
    case 'machine-learning':
      return ['pennylane']
    case 'finance':
      return ['qiskit', 'pennylane']
    case 'materials':
      return ['pennylane', 'qiskit']
    case 'cryptography':
      return ['qiskit']
    case 'research':
      return ['qiskit', 'pennylane', 'cirq']
    default:
      return ['qiskit']
  }
}

function isAccessible(qpu: QPUStaticData, preference: AccessPreference): boolean {
  if (preference === 'cloud') {
    // Exclude private and research-only QPUs for cloud preference
    return qpu.restrictedStatuses.length === 0
  }
  // direct or either: include all
  return true
}

// ── Main Export ───────────────────────────────────────────────────────────────

export function computeRecommendation(
  input: AdvisorInput,
  qpus: QPU[]
): AdvisorOutput {
  const archScores = baseArchScores(input)
  const primaryArch = archScores[0]
  const secondaryArch = archScores[1] ?? null

  // Select QPU candidates from static data matching primary architecture,
  // filtered by access preference
  const primaryCandidates = QPU_STATIC.filter(
    (s) =>
      s.architecture === primaryArch.architecture &&
      isAccessible(s, input.accessPreference)
  ).slice(0, 2)

  // If we have fewer than 2 primary candidates, try secondary architecture
  const secondaryCandidates =
    secondaryArch && primaryCandidates.length < 3
      ? QPU_STATIC.filter(
          (s) =>
            s.architecture === secondaryArch.architecture &&
            isAccessible(s, input.accessPreference) &&
            !primaryCandidates.some((p) => p.qpuId === s.qpuId)
        ).slice(0, 1)
      : []

  const allCandidates = [...primaryCandidates, ...secondaryCandidates]

  // Build recommendation list, enriching with actual QPU data for slug
  const recommendations: QPURecommendation[] = allCandidates.map((candidate) => {
    const liveQpu = qpus.find((q) => q.id === candidate.qpuId)
    return {
      qpuId: candidate.qpuId,
      qpuName: liveQpu?.name ?? candidate.qpuName,
      provider: candidate.provider,
      fitScore: candidate.baseFitScore,
      reasons: candidate.reasons,
      risks: candidate.risks,
      accessRoutes: candidate.accessRoutes,
    }
  })

  // Fallback: if no recommendations found at all, return a generic one
  if (recommendations.length === 0) {
    const fallback = QPU_STATIC.find((s) => s.qpuId === 'ibm-heron-r2')
    if (fallback) {
      recommendations.push({
        qpuId: fallback.qpuId,
        qpuName: fallback.qpuName,
        provider: fallback.provider,
        fitScore: 60,
        reasons: fallback.reasons,
        risks: fallback.risks,
        accessRoutes: fallback.accessRoutes,
      })
    }
  }

  const primaryConfidence = Math.min(100, Math.round(primaryArch.score))
  const secondaryConfidence = secondaryArch
    ? Math.min(100, Math.round(secondaryArch.score))
    : null

  return {
    primaryArchitecture: primaryArch.architecture,
    primaryArchitectureConfidence: primaryConfidence,
    secondaryArchitecture: secondaryArch?.architecture ?? null,
    secondaryArchitectureConfidence: secondaryConfidence,
    recommendations,
    frameworkSuggestions: frameworkSuggestions(input, primaryArch.architecture),
    disclaimer:
      'Recommendations are based on published architecture characteristics and are informational only. ' +
      'Actual performance depends on circuit-specific factors, calibration state, and problem encoding. ' +
      'Always validate on target hardware before production deployment. ' +
      'QPU.co does not guarantee suitability for any specific use case.',
    methodology:
      'Scoring uses rule-based architecture matching with modifiers for circuit depth, error sensitivity, ' +
      'and access preferences. QPU selection draws from available hardware with publicly documented specifications.',
  }
}
