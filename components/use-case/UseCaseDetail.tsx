import Link from 'next/link'
import type { UseCase, QPU, ArchitectureType, UseCaseStatus } from '@/types'
import { architectureLabel, formatQubits } from '@/lib/utils'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import type { BadgeProps } from '@/components/ui/Badge'
import { SuitabilityIndicator } from '@/components/ui/SuitabilityIndicator'
import { ArchitectureBadge } from '@/components/ui/ArchitectureBadge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { WorkflowDiagram } from '@/components/svg/WorkflowDiagram'

// ── Types ─────────────────────────────────────────────────────────────────────

interface AlgorithmCard {
  name: string
  type: string
  description: string
  resourceReqs: string
  status: string
}

interface RefItem {
  title: string
  authors: string
  year: string
  venue: string
  note?: string
}

interface FAQItem {
  q: string
  a: string
}

interface ArchReason {
  reason: string
}

interface HwReqs {
  qubits: string
  circuitDepth: string
  errorTolerance: string
  caveat: string
}

interface UCContent {
  introParas: string[]
  statusAssessment: string
  whyQuantum: string
  algorithms: AlgorithmCard[]
  hwReqs: HwReqs
  archReasons: Record<ArchitectureType, ArchReason>
  frameworks: string[]
  refs: RefItem[]
  faq: FAQItem[]
}

// ── Framework helpers ─────────────────────────────────────────────────────────

const FRAMEWORK_LABELS: Record<string, string> = {
  qiskit: 'Qiskit',
  cirq: 'Cirq',
  'cuda-q': 'CUDA-Q',
  pennylane: 'PennyLane',
  qsharp: 'Q#',
  'amazon-braket-sdk': 'Braket SDK',
}

const FRAMEWORK_URLS: Record<string, string> = {
  qiskit: 'https://qiskit.org',
  cirq: 'https://quantumai.google/cirq',
  'cuda-q': 'https://developer.nvidia.com/cuda-quantum',
  pennylane: 'https://pennylane.ai',
  qsharp: 'https://learn.microsoft.com/azure/quantum/',
  'amazon-braket-sdk': 'https://github.com/amazon-braket/amazon-braket-sdk-python',
}

// ── Status badge config ───────────────────────────────────────────────────────

interface UCStatusConfig {
  label: string
  variant: NonNullable<BadgeProps['variant']>
}

const UC_STATUS_CONFIG: Record<UseCaseStatus, UCStatusConfig> = {
  theoretical: { label: 'Theoretical', variant: 'muted' },
  research: { label: 'Research Stage', variant: 'warning' },
  experimental: { label: 'Experimental', variant: 'accent' },
  demonstrated: { label: 'Demonstrated', variant: 'success' },
  commercial: { label: 'Early Commercial', variant: 'success' },
}

// ── All architectures in order ────────────────────────────────────────────────

const ALL_ARCHITECTURES: ArchitectureType[] = [
  'superconducting',
  'trapped-ion',
  'neutral-atom',
  'photonic',
  'quantum-annealing',
  'topological',
]

// ── Content map ───────────────────────────────────────────────────────────────

const CONTENT_MAP: Record<string, UCContent> = {
  chemistry: {
    introParas: [
      'Quantum chemistry is widely considered the "killer app" most likely to produce near-term quantum advantage. Quantum computers can, in principle, simulate molecular wavefunctions exactly by exploiting quantum parallelism — encoding a superposition of electron configurations directly in qubit states via Jordan-Wigner or Bravyi-Kitaev mappings.',
      'The key algorithm for NISQ-era hardware is VQE (Variational Quantum Eigensolver), which uses a classical optimizer to minimize the energy expectation value of a parameterized quantum circuit (ansatz). For fault-tolerant hardware, Quantum Phase Estimation (QPE) provides exact ground-state energies using deep circuits with error correction. On today\'s NISQ devices, VQE can meaningfully treat small molecules — H₂ (4 qubits), LiH (6 qubits), BeH₂ (6 qubits) — but commercially relevant drug-like molecules require 100s to 1,000s of logical qubits with full error correction.',
      'Classical intractability for quantum chemistry begins around 50–100 strongly correlated electrons in an active space, where methods like CCSD(T) become exponentially expensive. This is the regime where fault-tolerant quantum computers could eventually provide decisive advantage — but current hardware is orders of magnitude too small and error-prone to reach it.',
    ],
    statusAssessment:
      'Active research stage. VQE demonstrations have been performed on 2–20 qubit systems by IBM, IonQ, Quantinuum, and academic groups. The largest demonstrated simulation involved the nitrogen fixation catalyst FeMoco (active space estimated at ~100 qubits for industrially relevant accuracy). Current hardware cannot approach commercially relevant molecular sizes. The honest timeline for useful quantum chemistry is 2030–2035 at earliest, contingent on fault-tolerant hardware with 100s of logical qubits.',
    whyQuantum:
      'Quantum computers naturally represent quantum mechanical systems. A classically described N-electron wavefunction requires exponentially many parameters (2^N), whereas a quantum computer encodes it in N qubits. Quantum algorithms like VQE and QPE can compute ground-state energies of molecular Hamiltonians in polynomial quantum resources — a task exponentially hard classically for strongly correlated systems. This genuine quantum advantage is mathematically proven for quantum phase estimation, making chemistry one of the most theoretically grounded quantum applications.',
    algorithms: [
      {
        name: 'VQE (Variational Quantum Eigensolver)',
        type: 'Variational / NISQ',
        description:
          'Parameterized circuit (ansatz) optimized by a classical computer to minimize molecular energy expectation value. Suitable for NISQ hardware due to shallow circuit depth.',
        resourceReqs: '4–100 qubits for small molecules; circuit depth 10–1000 gates depending on ansatz.',
        status: 'Actively used in research; limited to small active spaces by noise.',
      },
      {
        name: 'QPE (Quantum Phase Estimation)',
        type: 'Fault-Tolerant',
        description:
          'Extracts eigenvalues of the molecular Hamiltonian with exponential precision. Provides exact ground-state energies but requires deep circuits and full error correction.',
        resourceReqs: '100–1000+ logical qubits; millions of T-gates; fault-tolerant hardware required.',
        status: 'Research/theoretical; requires hardware not yet available.',
      },
      {
        name: 'QITE (Quantum Imaginary Time Evolution)',
        type: 'Variational / NISQ',
        description:
          'Projects the quantum state toward the ground state by simulating imaginary-time Schrödinger evolution. More robust to local minima than VQE.',
        resourceReqs: 'Similar to VQE; requires mid-circuit measurements or ancilla qubits.',
        status: 'Research demonstrations on small molecules.',
      },
      {
        name: 'Subspace Expansion Methods',
        type: 'Hybrid Classical-Quantum',
        description:
          'Uses a quantum computer to generate a subspace of relevant states, then diagonalizes classically within that subspace (MCCI-Q, quantum Krylov methods). Extends accuracy beyond raw VQE.',
        resourceReqs: '4–50 qubits; multiple short circuits combined with classical post-processing.',
        status: 'Active research; extends useful regime of NISQ chemistry.',
      },
    ],
    hwReqs: {
      qubits:
        '100–1,000 logical qubits minimum for molecules beyond current classical methods (FeMoco, cytochrome P450). Simple benchmark molecules (H₂, LiH) need only 4–12 physical qubits.',
      circuitDepth:
        'VQE uses shallow circuits (100–10,000 gates) suited to NISQ hardware. QPE requires deep circuits (millions of gates) requiring fault tolerance.',
      errorTolerance:
        'VQE requires two-qubit gate fidelity >99% for accurate energy estimation on 6+ qubit systems. QPE requires logical error rates below 10⁻¹² per gate — unachievable without error correction.',
      caveat:
        'VQE suffers from the barren plateau problem as system size grows: gradient magnitudes decay exponentially with qubit count, making optimization infeasible for large ansatze. This is an unsolved problem for NISQ-scale chemistry.',
    },
    archReasons: {
      superconducting: {
        reason:
          'Fast gate operations (10–100 ns) and growing qubit counts make IBM and Rigetti systems practical for VQE experiments. Heavy-hex topology limits all-to-all connectivity required by some ansatze. Noise levels restrict accuracy to small active spaces.',
      },
      'trapped-ion': {
        reason:
          'Two-qubit gate fidelities >99.5% (IonQ Forte, Quantinuum H2) are the highest available, enabling deeper VQE circuits with less noise. All-to-all connectivity eliminates SWAP overhead. Slower gate speed (ms vs µs) limits circuit repetition rate.',
      },
      'neutral-atom': {
        reason:
          'Reconfigurable arrays can implement problem-specific connectivity. Coherence times are long. Gate-based mode still maturing; current neutral-atom systems best for analog simulation of spin models related to chemistry.',
      },
      photonic: {
        reason:
          'Gaussian boson sampling on photonic chips is relevant to vibronic spectra simulation. Gate-based photonic computing for electronic structure remains experimental; limited qubit counts and mid-circuit measurements complicate VQE.',
      },
      'quantum-annealing': {
        reason:
          'Not suited for quantum chemistry. VQE and QPE require gate-based quantum computation; QUBO/Ising formulations do not efficiently encode molecular Hamiltonians with fermionic antisymmetry.',
      },
      topological: {
        reason:
          'Topological qubits\' ultra-low error rates would be ideal for deep QPE circuits, potentially reducing physical qubit overhead by orders of magnitude. No quantum chemistry demonstrations exist yet on any topological platform.',
      },
    },
    frameworks: ['qiskit', 'pennylane', 'cirq', 'cuda-q'],
    refs: [
      {
        title:
          'A variational eigenvalue solver on a photonic quantum processor',
        authors: 'Peruzzo, A. et al.',
        year: '2014',
        venue: 'Nature Communications',
        note: 'The original VQE paper demonstrating quantum chemistry on a photonic chip.',
      },
      {
        title: 'Simulated Quantum Computation of Molecular Energies',
        authors: 'Aspuru-Guzik, A. et al.',
        year: '2005',
        venue: 'Science',
        note: 'Foundational paper proposing quantum simulation of electronic structure.',
      },
      {
        title:
          'Encoding Electronic Spectra in Quantum Circuits with Linear T Complexity',
        authors: 'Babbush, R. et al.',
        year: '2018',
        venue: 'Physical Review X',
        note: 'Resource estimates for fault-tolerant quantum chemistry using linear combination of unitaries.',
      },
    ],
    faq: [
      {
        q: 'How many qubits are needed to simulate a drug molecule like aspirin?',
        a: 'A full-accuracy quantum simulation of aspirin (C₉H₈O₄, 180 electrons) would require roughly 180 logical qubits for the active space using a minimal basis set, and thousands of logical qubits for chemically accurate results. Given current physical-to-logical qubit ratios (1000s of physical per logical), this implies millions of physical qubits — far beyond any existing or near-term system.',
      },
      {
        q: 'What is the "barren plateau" problem and why does it matter for chemistry?',
        a: 'In variational quantum algorithms like VQE, the gradient of the loss function with respect to circuit parameters decays exponentially as the number of qubits increases. This means that for large molecular systems, the classical optimizer receives essentially zero gradient signal and cannot train the circuit. This is one of the fundamental obstacles to scaling VQE beyond small molecules on NISQ hardware.',
      },
      {
        q: 'When will quantum computers provide useful chemistry results?',
        a: 'Conservative estimates place fault-tolerant quantum advantage in chemistry at 2030–2035, contingent on engineering milestones in error correction that have not yet been demonstrated at scale. NISQ-era demonstrations on 10–50 qubits continue but remain in the research domain, not commercial application. Any timeline shorter than 5–10 years should be viewed skeptically.',
      },
      {
        q: 'How does quantum chemistry differ from classical molecular dynamics?',
        a: 'Classical molecular dynamics (MD) treats atoms as classical particles with approximate force fields. Quantum chemistry solves the electronic Schrödinger equation explicitly, capturing electron correlation effects that determine reaction pathways and binding energies. The quantum computer\'s advantage is specifically in solving strongly correlated electron problems where classical quantum chemistry methods (CCSD, DMRG) become exponentially expensive.',
      },
    ],
  },

  // ── Materials Science ─────────────────────────────────────────────────────────
  'materials-science': {
    introParas: [
      'Materials science is one of the most promising long-term applications of quantum computing. Simulating the electronic structure of solid-state materials — high-temperature superconductors, topological insulators, novel battery cathodes — requires solving quantum many-body problems that are intractable for classical computers at industrially relevant scales.',
      'The Hubbard model, which captures electron correlation in lattice materials, is a canonical target: quantum computers can in principle solve it exactly using quantum phase estimation or variational methods. Neutral-atom arrays are particularly well-suited for analog simulation of lattice spin models (Ising, Heisenberg, XXZ), with QuEra\'s Aquila platform already demonstrating programmable simulations of frustrated magnets and quantum phase transitions.',
      'Industrial applications — designing better battery cathode materials, identifying room-temperature superconductors, engineering novel semiconductors — require active spaces of 1,000–10,000 electrons. This places them firmly in the fault-tolerant era, likely beyond 2030.',
    ],
    statusAssessment:
      'Active research stage with analog demonstrations. QuEra, PASQAL, and neutral-atom academic groups have demonstrated programmable quantum simulations of Ising and Heisenberg models on 100+ atom arrays. Gate-based simulations of the Hubbard model have been demonstrated on 4–16 qubits (IBM, Quantinuum). Industrially relevant materials simulation — high-Tc superconductors, real battery materials — requires fault-tolerant quantum computers with 1,000–10,000 logical qubits, estimated to be 7–12 years away.',
    whyQuantum:
      'Quantum many-body physics exhibits exponentially large Hilbert spaces: an N-electron system requires 2^N classical parameters to describe exactly. Quantum computers store and process this exponential space natively. For materials, this means correctly simulating electron correlation effects responsible for superconductivity, magnetism, and phase transitions — phenomena that density functional theory (DFT) approximates but cannot capture exactly for strongly correlated materials.',
    algorithms: [
      {
        name: 'VQE for Lattice Models',
        type: 'Variational / NISQ',
        description:
          'Applies VQE ansatz to Hubbard or Heisenberg Hamiltonians on lattice geometries. Hardware-efficient ansatze adapted to qubit topology minimize SWAP overhead.',
        resourceReqs: '4–50 qubits; circuit depth 50–500 gates; restricted to small lattices.',
        status: 'Research demonstrations on 4×4 Hubbard model and Heisenberg chains.',
      },
      {
        name: 'Quantum Phase Estimation for Materials',
        type: 'Fault-Tolerant',
        description:
          'Computes exact ground-state energies of material Hamiltonians. Requires deep circuits and full error correction but provides exponentially better scaling than classical DMRG for 2D systems.',
        resourceReqs: '1,000–10,000 logical qubits; requires fault-tolerant hardware.',
        status: 'Theoretical resource estimates; hardware does not yet exist.',
      },
      {
        name: 'Rydberg Analog Simulation',
        type: 'Analog / Near-Term',
        description:
          'Directly implements Ising/XXZ Hamiltonians on neutral-atom arrays via Rydberg blockade. No gate decomposition required; hardware naturally encodes the physics.',
        resourceReqs: '50–1000 atoms; analog control pulses; no gate overhead.',
        status: 'Actively demonstrated on QuEra Aquila and PASQAL Fresnel; scientifically relevant results published.',
      },
      {
        name: 'Thermal State Preparation',
        type: 'Fault-Tolerant',
        description:
          'Prepares finite-temperature quantum states for computing thermodynamic properties of materials (heat capacity, susceptibility). Quantum Gibbs sampling algorithms are fault-tolerant era.',
        resourceReqs: 'Requires logical qubits and error correction; active research area.',
        status: 'Theoretical; algorithms under development.',
      },
    ],
    hwReqs: {
      qubits:
        '50–100 atoms for analog simulation of small lattices. 1,000–10,000 logical qubits for industrially relevant materials (periodic systems with >20 atoms per unit cell).',
      circuitDepth:
        'Analog simulation has no circuit depth limit in principle. Gate-based: VQE needs 100–5,000 gates; QPE for materials requires millions of gates requiring error correction.',
      errorTolerance:
        'Analog neutral-atom: error tolerance is set by Rydberg coherence time and control fidelity. Gate-based: requires >99% two-qubit fidelity for VQE; full error correction for QPE.',
      caveat:
        'Encoding periodic boundary conditions (essential for crystals) and long-range interactions requires high-degree qubit connectivity. Current gate-based hardware topologies are sparse (heavy-hex, grid), creating large SWAP overhead for materials Hamiltonians.',
    },
    archReasons: {
      superconducting: {
        reason:
          'Fast gate operations and nearest-neighbor grids are naturally suited to 2D lattice Hamiltonians. IBM devices have demonstrated Hubbard model simulations. Noise limits accuracy beyond 4×4 lattice patches.',
      },
      'trapped-ion': {
        reason:
          'All-to-all connectivity is ideal for long-range spin interactions in frustrated magnets and periodic systems. High fidelity enables more accurate results on small systems. Slow gate speed limits simulation of real-time dynamics.',
      },
      'neutral-atom': {
        reason:
          'Rydberg blockade directly implements Ising and XXZ spin interactions — the physics of magnetic materials — without gate decomposition. Reconfigurable arrays can implement arbitrary 2D lattice geometries. QuEra Aquila and PASQAL Fresnel are leading platforms for analog materials simulation.',
      },
      photonic: {
        reason:
          'Vibrational spectra of molecules (phonons) can be simulated via Gaussian boson sampling on photonic hardware. Gate-based photonics for electronic structure of solid-state materials remains experimental.',
      },
      'quantum-annealing': {
        reason:
          'D-Wave annealing implements Ising model problems natively, relevant to classical spin models. However, it cannot simulate quantum dynamics or electron correlation required for materials quantum chemistry.',
      },
      topological: {
        reason:
          'Topological qubits could theoretically simulate topological phases of matter with exponential advantages. No materials simulations have been demonstrated; Microsoft\'s topological program is still in characterization phase.',
      },
    },
    frameworks: ['qiskit', 'pennylane', 'amazon-braket-sdk'],
    refs: [
      {
        title: 'Observation of topological phenomena in a programmable lattice of 1800 qubits',
        authors: 'King, A.D. et al.',
        year: '2023',
        venue: 'Nature',
        note: 'Analog simulation of frustrated Ising lattice; demonstrates quantum advantages in materials simulation.',
      },
      {
        title: 'Quantum phases of matter on a 256-atom programmable quantum simulator',
        authors: 'Ebadi, S. et al.',
        year: '2021',
        venue: 'Nature',
        note: 'QuEra/Harvard neutral-atom simulation of quantum phase transitions and frustrated magnets.',
      },
      {
        title: 'Resource Estimates for Quantum Simulation of Materials',
        authors: 'Babbush, R. et al.',
        year: '2019',
        venue: 'npj Quantum Information',
        note: 'Systematic resource estimates for fault-tolerant simulation of solid-state materials.',
      },
    ],
    faq: [
      {
        q: 'Can quantum computers find room-temperature superconductors?',
        a: 'In principle, yes — quantum simulation of strongly correlated electron systems (the mechanism behind superconductivity) could identify new superconducting compounds. In practice, this requires thousands of logical qubits and fault-tolerant hardware. The high-Tc superconductivity mechanism itself is still debated classically, so even the quantum algorithm to solve this isn\'t fully settled.',
      },
      {
        q: 'How does neutral-atom simulation differ from gate-based simulation of materials?',
        a: 'Neutral-atom analog simulation directly implements the target Hamiltonian (e.g., Ising model) using Rydberg interactions between atoms arranged in a programmable geometry. Gate-based simulation decomposes the Hamiltonian into quantum gates and runs circuits. Analog simulation is faster and more noise-tolerant for specific models but less programmable; gate-based is more general but requires more qubits and lower error rates.',
      },
      {
        q: 'When will quantum computers help design better batteries?',
        a: 'Battery cathode materials (LiFePO₄, NMC, solid electrolytes) involve electronic structure calculations with 20–100 correlated electrons per unit cell. Conservative estimates place fault-tolerant quantum advantage for realistic battery material simulations at 2030–2035. Near-term NISQ work on small model systems contributes scientific value but not commercial battery development.',
      },
    ],
  },

  // ── Optimization ──────────────────────────────────────────────────────────────
  optimization: {
    introParas: [
      'Combinatorial optimization — finding optimal solutions from exponentially large search spaces — is the most commercially explored quantum computing application area. The appeal is clear: problems like vehicle routing (VRP), portfolio construction, and network design are NP-hard, and quantum computers have at least two distinct approaches: QAOA (Quantum Approximate Optimization Algorithm) on gate-based QPUs, and quantum annealing (D-Wave) that natively minimizes Quadratic Unconstrained Binary Optimization (QUBO) and Ising model energies.',
      'D-Wave\'s Advantage system is already deployed in production hybrid workflows at a handful of enterprises for logistics and scheduling. However, there is a critical caveat: quantum advantage over state-of-the-art classical optimization solvers (Gurobi, CPLEX, OR-Tools, simulated annealing, branch-and-bound) has not been convincingly demonstrated for practically relevant problem sizes on any quantum platform.',
      'Most current quantum optimization results are on toy problems (< 100 variables) that classical solvers handle trivially. The more honest framing is that quantum optimization is experimental technology with genuine commercial interest and deployment experiments, but no proven speedup over the best classical methods at industrial scale.',
    ],
    statusAssessment:
      'Experimental stage with commercial deployment experiments. D-Wave\'s hybrid solver (combining classical and annealing QPU computation) is deployed at Volkswagen, DHL, and other enterprises for logistics optimization in production or pilot settings. Pure quantum advantage over Gurobi or CPLEX for practical NP-hard instances has not been demonstrated. QAOA on gate-based QPUs achieves approximation ratios that classical heuristics routinely exceed. The "quantum advantage for optimization" question remains genuinely open for near-term hardware.',
    whyQuantum:
      'Quantum superposition allows exploring exponentially many candidate solutions simultaneously. Quantum tunneling (in annealing) lets the system pass through energy barriers that trap classical simulated annealing in local minima. QAOA creates quantum interference between solution states to amplify the probability of optimal or near-optimal outcomes. The theoretical appeal is real — but translating it to practical advantage against heavily optimized classical solvers is an open engineering and algorithmic challenge.',
    algorithms: [
      {
        name: 'QAOA (Quantum Approximate Optimization Algorithm)',
        type: 'Variational / NISQ',
        description:
          'A parameterized quantum circuit with alternating cost and mixer unitaries, optimized by a classical outer loop to maximize the expected quality of solutions for combinatorial problems (MaxCut, VRP, scheduling).',
        resourceReqs: '20–100+ qubits; circuit depth scales with problem size and QAOA layers (p); shallow circuits (p=1,2) achievable on NISQ hardware.',
        status: 'Active research; approximation quality generally not competitive with classical heuristics at scale.',
      },
      {
        name: 'Quantum Annealing (QUBO/Ising)',
        type: 'Annealing',
        description:
          'D-Wave hardware natively minimizes the energy of QUBO and Ising Hamiltonians by slowly evolving from a transverse-field ground state to the problem Hamiltonian. Suitable for binary variable optimization problems with quadratic interactions.',
        resourceReqs: '100–5,627 physical qubits (D-Wave Advantage); QUBO embedding onto Pegasus graph adds logical-to-physical qubit overhead.',
        status: 'Production hybrid deployment at select enterprises; pure quantum advantage undemonstrated.',
      },
      {
        name: 'D-Wave Hybrid Solver',
        type: 'Hybrid Classical-Quantum',
        description:
          'Combines classical heuristics (tabu search, simulated annealing) with quantum annealing QPU calls for subproblem decomposition. Practically the most commercially viable quantum optimization approach today.',
        resourceReqs: 'Problem-size agnostic via API; D-Wave Leap cloud subscription.',
        status: 'Production deployment; competes with but does not clearly outperform best classical solvers.',
      },
      {
        name: 'HHL (Harrow-Hassidim-Lloyd)',
        type: 'Fault-Tolerant',
        description:
          'Quantum algorithm for solving systems of linear equations with exponential speedup over classical methods under specific conditions. Useful for optimization subproblems but has very stringent input conditions (sparse, well-conditioned matrices with quantum-accessible input/output).',
        resourceReqs: 'Fault-tolerant hardware required; input data must be encoded in quantum state (QRAM bottleneck).',
        status: 'Theoretical; practical application extremely limited by input/output assumptions.',
      },
    ],
    hwReqs: {
      qubits:
        'QAOA: 20–1,000 qubits depending on problem size; embedding overhead for dense graphs can require 5–10× qubit multiplication. D-Wave Advantage: 5,627 physical qubits for native QUBO; practical problem size ~1,000–3,000 variables after embedding.',
      circuitDepth:
        'QAOA at shallow depth (p=1–3) fits NISQ hardware. Deeper QAOA (p=10+) requires lower noise. Annealing has no concept of circuit depth; annealing time (1–2,000 µs) replaces it.',
      errorTolerance:
        'QAOA quality degrades rapidly with gate errors above 1%. Annealing systems have different error models (thermal fluctuations at 15 mK); freeze-out dynamics determine effective precision.',
      caveat:
        'Classical solvers like Gurobi use decades of algorithmic engineering. Even provably correct quantum optimization algorithms must overcome the overhead of state preparation, measurement, and classical feedback loops. Quantum advantage is not guaranteed even for exponentially hard instances.',
    },
    archReasons: {
      superconducting: {
        reason:
          'QAOA circuits are shallow enough for NISQ superconducting hardware. IBM devices (Eagle, Heron) support QAOA experiments with Qiskit. Noise limits circuit depth and thus QAOA approximation quality.',
      },
      'trapped-ion': {
        reason:
          'Higher gate fidelity enables more QAOA layers for better approximation quality. All-to-all connectivity suits dense optimization graph instances without SWAP overhead. Slow gate speed limits problem size by restricting iterations per second.',
      },
      'neutral-atom': {
        reason:
          'Maximum Independent Set (MIS) problems map directly to Rydberg blockade physics, demonstrated on QuEra hardware. Reconfigurable arrays implement arbitrary unit-disk graphs. Broader QUBO/VRP optimization is research-stage on neutral atom platforms.',
      },
      photonic: {
        reason:
          'Coherent Ising machines using optical parametric oscillators solve Ising problems and have shown results on MAX-CUT. Gate-based photonics for general combinatorial optimization is still experimental; limited scalability.',
      },
      'quantum-annealing': {
        reason:
          'The natural platform for QUBO and Ising optimization. D-Wave Advantage (5,627 qubits, Pegasus 15-way connectivity) is the most commercially deployed quantum optimization hardware. Hybrid solver service manages problem decomposition.',
      },
      topological: {
        reason:
          'No known advantage for combinatorial optimization on topological platforms. The topological qubit architecture is targeted at fault-tolerant universal computation, not annealing or near-term QAOA.',
      },
    },
    frameworks: ['pennylane', 'qiskit', 'amazon-braket-sdk'],
    refs: [
      {
        title: 'A Quantum Approximate Optimization Algorithm',
        authors: 'Farhi, E., Goldstone, J., Gutmann, S.',
        year: '2014',
        venue: 'arXiv:1411.4028',
        note: 'Original QAOA paper; introduced the variational quantum approach to combinatorial optimization.',
      },
      {
        title: 'Quantum annealing with manufactured spins',
        authors: 'Johnson, M.W. et al.',
        year: '2011',
        venue: 'Nature',
        note: 'First demonstration of D-Wave quantum annealing on an 8-qubit processor.',
      },
      {
        title: 'Classical simulations of noisy variational quantum circuits via linear congruences',
        authors: 'Shao, Y. et al.',
        year: '2023',
        venue: 'Physical Review Applied',
        note: 'Demonstrates classical algorithms matching or exceeding QAOA performance on benchmark instances.',
      },
    ],
    faq: [
      {
        q: 'Has any quantum optimizer beaten Gurobi on a real problem?',
        a: 'No. As of mid-2026, no quantum optimizer (D-Wave, gate-based QAOA, or any hybrid approach) has demonstrated reproducible, statistically significant advantage over state-of-the-art classical solvers (Gurobi, CPLEX, SCIP) on practically relevant problem instances. D-Wave hybrid workflows show competitive performance on some small instances but do not consistently outperform best-in-class classical approaches. Multiple independent benchmarks (Denchev et al. 2016, King et al. 2023, Shaydulin et al. 2024) show mixed or negative results.',
      },
      {
        q: 'What is QUBO and why does it matter for D-Wave?',
        a: 'QUBO (Quadratic Unconstrained Binary Optimization) is an optimization problem format: minimize x^T Q x where x is a binary vector and Q is a matrix of interaction coefficients. D-Wave hardware implements the Ising model, which is equivalent to QUBO. Many real-world problems (scheduling, routing, portfolio selection) can be formulated as QUBO, making D-Wave relevant — but embedding large, dense QUBO problems onto D-Wave\'s sparse Pegasus graph requires many auxiliary qubits, limiting effective problem size.',
      },
      {
        q: 'Is quantum annealing "real" quantum computing?',
        a: 'D-Wave\'s quantum annealing is physically quantum — it operates at 15 mK, exploits quantum tunneling, and processes superposition states. However, it is not universal quantum computation: it cannot run arbitrary quantum circuits (like Shor\'s algorithm or VQE) and is restricted to Ising/QUBO optimization. The debate about whether D-Wave demonstrates genuine quantum speedup over classical simulated annealing is settled in the research literature: for most tested instances, classical algorithms match or exceed D-Wave on equivalent hardware.',
      },
    ],
  },

  // ── Finance ───────────────────────────────────────────────────────────────────
  finance: {
    introParas: [
      'Finance is one of the most actively researched near-term quantum use cases because many financial computations are mathematically well-suited to quantum algorithms. Monte Carlo simulation — used for derivative pricing, Value-at-Risk (VaR), Credit Valuation Adjustment (CVA), and scenario analysis — admits a quadratic quantum speedup via Quantum Amplitude Estimation (QAE).',
      'Major financial institutions (Goldman Sachs, JPMorgan Chase, BBVA, Barclays) have published quantum computing research papers and maintain quantum computing teams. IBM, IonQ, and cloud platforms actively market to the financial sector. However, the honest assessment is that all current financial quantum computing work is research-stage — no bank or financial firm has moved a quantum algorithm to production for a commercially meaningful finance task.',
      'The core obstacle is circuit depth: Quantum Amplitude Estimation requires fault-tolerant circuits to achieve meaningful speedup over highly optimized classical Monte Carlo. NISQ hardware is too noisy for the required circuit depth, and classical financial computation is exceptionally well-optimized (GPUs, FPGA accelerators, variance-reduction techniques).',
    ],
    statusAssessment:
      'Research stage. Goldman Sachs, JPMorgan Chase, and academic groups have published proof-of-concept demonstrations of quantum Monte Carlo for option pricing on 5–10 qubit systems. The theoretical quadratic speedup (O(1/ε) vs. O(1/ε²) for Monte Carlo error ε) is correct in principle but requires fault-tolerant hardware to realize in practice. Conservative timeline for quantum advantage in finance: 2028–2033, contingent on fault-tolerant hardware.',
    whyQuantum:
      'Classical Monte Carlo simulation samples paths randomly and converges at rate O(1/√N) — to halve the error, quadruple the samples. Quantum Amplitude Estimation computes integral expectations directly using quantum superposition and phase kickback, achieving O(1/N) convergence — a genuine quadratic speedup. For high-precision financial calculations (tight error bounds on derivative prices or portfolio VaR), this speedup is commercially meaningful if the overhead of fault-tolerant computation is manageable.',
    algorithms: [
      {
        name: 'Quantum Amplitude Estimation (QAE)',
        type: 'Fault-Tolerant',
        description:
          'Estimates the expectation value of an observable (e.g., discounted option payoff) encoded as a quantum amplitude, with quadratic speedup over classical Monte Carlo sampling.',
        resourceReqs: '1,000+ logical qubits for meaningful speedup; deep circuits requiring error correction.',
        status: 'Research demonstrations on 5–12 qubits; fault-tolerant scale not achieved.',
      },
      {
        name: 'Quantum Monte Carlo (hybrid)',
        type: 'Variational / NISQ',
        description:
          'NISQ-era approximations to QAE using variational circuits or iterative phase estimation. Reduces circuit depth at the cost of approximation quality.',
        resourceReqs: '10–100 qubits; shallow circuits; multiple measurement rounds.',
        status: 'Research demonstrations; does not achieve quantum speedup at current hardware fidelity.',
      },
      {
        name: 'QAOA for Portfolio Optimization',
        type: 'Variational / NISQ',
        description:
          'Formulates mean-variance portfolio optimization as a QUBO problem and solves with QAOA or quantum annealing. D-Wave has published portfolio optimization case studies.',
        resourceReqs: 'N qubits for N assets with binary allocation; 50–1000 qubits for realistic portfolios.',
        status: 'Experimental; classical quadratic programming solvers remain faster and more accurate.',
      },
    ],
    hwReqs: {
      qubits:
        '1,000+ logical qubits for meaningful Monte Carlo speedup on practical derivative pricing. Portfolio optimization (QUBO form): 50–1,000 physical qubits depending on portfolio size and cardinality constraints.',
      circuitDepth:
        'QAE for option pricing on realistic contracts requires 10,000–100,000 quantum gates — far beyond NISQ tolerance. QAOA for portfolio optimization is shallower and NISQ-compatible but delivers no proven advantage.',
      errorTolerance:
        'QAE requires logical error rates below 10⁻⁸ per gate — only achievable with error-corrected logical qubits. QAOA is more tolerant but classical financial algorithms are better at noise-tolerant computation.',
      caveat:
        'Classical finance computation is among the most heavily optimized in industry (GPUs, ASICs, variance reduction, quasi-Monte Carlo). The threshold for quantum to provide advantage is set by extremely fast classical algorithms, not slow ones.',
    },
    archReasons: {
      superconducting: {
        reason:
          'Fast gates (10–100 ns) and improving qubit counts make IBM/Rigetti viable for research-scale QAE experiments. Current noise levels prevent circuit depths required for financial QAE advantage.',
      },
      'trapped-ion': {
        reason:
          'High fidelity enables longer QAE circuits on small-scale demonstrations. All-to-all connectivity is useful for portfolio correlations. Slow gate speed limits shot throughput needed for Monte Carlo convergence.',
      },
      'neutral-atom': {
        reason:
          'Research-stage for financial applications; no financial quantum computing demonstrations on neutral atom hardware. Gate mode maturity required before financial use cases are relevant.',
      },
      photonic: {
        reason:
          'Theoretical overlap between Gaussian boson sampling and probability distribution sampling; speculative for financial use cases. No demonstrated financial application on photonic hardware.',
      },
      'quantum-annealing': {
        reason:
          'Portfolio optimization mapped to QUBO is natural for D-Wave. Published case studies from D-Wave and financial firms show competitive results on small portfolios (<100 assets). Classical quadratic programming remains faster for larger instances.',
      },
      topological: {
        reason:
          'No financial demonstrations; long-term fault-tolerant hardware could eventually run full QAE. Topological qubits targeted at fault-tolerant universal computation relevant to QAE in the far term.',
      },
    },
    frameworks: ['qiskit', 'pennylane'],
    refs: [
      {
        title: 'Quantum risk analysis',
        authors: 'Woerner, S., Egger, D.J.',
        year: '2019',
        venue: 'npj Quantum Information',
        note: 'Demonstrates quantum amplitude estimation for VaR and CVaR on a 5-qubit system.',
      },
      {
        title: 'Option Pricing using Quantum Computers',
        authors: 'Stamatopoulos, N. et al.',
        year: '2020',
        venue: 'Quantum',
        note: 'Goldman Sachs / IBM paper demonstrating quantum Monte Carlo for European and Asian option pricing.',
      },
      {
        title: 'Quantum machine learning in finance: Time series forecasting',
        authors: 'Rebentrost, P. et al.',
        year: '2018',
        venue: 'Physical Review Letters',
        note: 'Theoretical analysis of quantum advantage for financial machine learning tasks.',
      },
    ],
    faq: [
      {
        q: 'When will banks use quantum computers for trading?',
        a: 'No meaningful timeline exists for production quantum use in trading. Research demonstrates quantum Monte Carlo on toy derivatives with 5–12 qubits, but practical financial quantum advantage requires 1,000+ logical qubits — hardware estimated to be available in 2030–2035. Classical computing in finance is also evolving rapidly (GPU Monte Carlo, machine learning), raising the classical baseline. 2028–2033 is a reasonable minimum optimistic estimate.',
      },
      {
        q: 'What is quantum amplitude estimation and why is it useful for finance?',
        a: 'Quantum Amplitude Estimation (QAE) computes E[f(X)] — the expected payoff of a financial instrument under a probability distribution — using quantum interference. Where classical Monte Carlo needs N samples to achieve error ε = 1/√N, QAE achieves the same error with √N quantum circuits. For financial calculations requiring high precision (tight confidence intervals), this quadratic speedup is commercially meaningful — if the quantum hardware overhead is overcome.',
      },
      {
        q: 'Can quantum computers predict stock prices?',
        a: 'No. Quantum computers are not prediction machines — they are specialized calculators for specific mathematical problems. Quantum algorithms provide speedups for integration tasks (Monte Carlo) and optimization, not for forecasting or pattern recognition in the way financial analysts might hope. Quantum machine learning for financial time series has theoretical appeal but no demonstrated advantage over classical ML.',
      },
    ],
  },

  // ── Machine Learning ──────────────────────────────────────────────────────────
  'machine-learning': {
    introParas: [
      'Quantum Machine Learning (QML) explores whether quantum algorithms can accelerate machine learning training, inference, or data representation. The field sits at the intersection of two fast-moving areas, generating substantial excitement and substantial skepticism in equal measure. Theoretical papers propose quantum speedups for kernel methods, classification, dimensionality reduction, and generative modeling — but practical demonstration of quantum advantage over classical ML has not been achieved.',
      'The most developed QML approaches use parameterized quantum circuits (PQCs) as trainable models — quantum neural networks (QNNs) or variational classifiers — combined with quantum kernel methods where classical algorithms compute kernel functions defined by quantum feature maps. PennyLane, Qiskit Machine Learning, and CUDA-Q support QML experimentation.',
      'Two fundamental obstacles limit QML today: the barren plateau problem (gradient magnitudes decay exponentially with qubit count, making large QNNs untrainable) and the quantum data loading problem (encoding classical data into quantum states is generically as expensive as the computation itself, erasing theoretical speedups). Whether QML provides genuine practical advantage over classical ML — especially deep learning — remains an open and actively debated research question.',
    ],
    statusAssessment:
      'Research stage. QNNs have been trained on toy classification tasks (2D binary classification, MNIST subset) with 4–20 qubits. Quantum kernel methods achieve competitive accuracy on small datasets but have not shown advantages over classical kernels for large datasets. The theoretical basis for quantum advantage in ML is contested: several papers show that classical ML can efficiently simulate quantum kernel methods for datasets accessible classically. The honest assessment is that QML advantage, if it exists, requires quantum data (data generated by quantum systems) or specific mathematical structure not present in typical ML benchmarks.',
    whyQuantum:
      'Quantum feature maps can compute inner products in high-dimensional Hilbert spaces that may be classically intractable to compute directly. Quantum kernels can represent non-classical correlations in data. For specific input distributions with quantum structure, QML could provide exponential speedups in classification or density estimation. However, "quantum advantage" for QML requires carefully constructed problem instances, not general real-world datasets.',
    algorithms: [
      {
        name: 'Variational Quantum Classifier (VQC)',
        type: 'Variational / NISQ',
        description:
          'Encodes classical data into a quantum state using a data-embedding circuit, applies a parameterized unitary, and measures qubit expectation values for classification. Trained via classical gradient descent.',
        resourceReqs: '4–20 qubits; circuit depth 10–100 layers; limited by barren plateau for >15 qubits.',
        status: 'Research demonstrations; not competitive with classical neural networks at scale.',
      },
      {
        name: 'Quantum Kernel Estimation (QKE)',
        type: 'Hybrid Classical-Quantum',
        description:
          'Uses a quantum circuit to estimate the kernel function K(x,y) = |⟨φ(x)|φ(y)⟩|² and feeds it to a classical SVM. Quantum advantage requires the kernel to be classically hard to compute.',
        resourceReqs: '8–50 qubits; O(N²) circuit evaluations for N training points; classical SVM training.',
        status: 'Research demonstrations; classical kernel approximation often matches performance.',
      },
      {
        name: 'Quantum Boltzmann Machine (QBM)',
        type: 'Annealing / Hybrid',
        description:
          'Uses D-Wave annealing to sample from the Boltzmann distribution of an Ising Hamiltonian as a generative model. D-Wave hardware provides the thermal samples; classical code handles training updates.',
        resourceReqs: '100–2000 D-Wave qubits; restricted to binary/quadratic model structure.',
        status: 'Experimental; competitive with Restricted Boltzmann Machines on some tasks.',
      },
      {
        name: 'Quantum Generative Adversarial Network (QGAN)',
        type: 'Variational / NISQ',
        description:
          'Quantum version of GANs where the generator is a parameterized quantum circuit producing quantum states as samples. Barren plateau limits training depth.',
        resourceReqs: '4–15 qubits for generator; classical discriminator; limited by noise and trainability.',
        status: 'Early research; no demonstrated advantage over classical GANs.',
      },
    ],
    hwReqs: {
      qubits:
        '4–50 qubits for current NISQ QML research. No clear fault-tolerant qubit requirement has been established for QML — theoretical advantage may require quantum data, not classical data encoded in qubits.',
      circuitDepth:
        'Practical constraint: barren plateau limits trainable QNNs to shallow circuits (5–20 layers). Quantum kernel methods use depth-10 to depth-50 feature maps.',
      errorTolerance:
        'QML is inherently noise-sensitive: training gradients corrupted by noise are indistinguishable from barren plateau vanishing gradients. Two-qubit fidelity >99% desirable for 15+ qubit QML experiments.',
      caveat:
        'QRAM (Quantum Random Access Memory) is a frequently cited prerequisite for exponential QML speedups but does not physically exist at meaningful scale. Without QRAM, loading N classical data points into a quantum state requires O(N) time, eliminating speedups.',
    },
    archReasons: {
      superconducting: {
        reason:
          'IBM (Qiskit Machine Learning), Rigetti, and others support QML experiments. Fast gates enable many training iterations. Barren plateau still applies; hardware noise adds to optimization difficulty.',
      },
      'trapped-ion': {
        reason:
          'High fidelity allows more accurate gradient estimation. All-to-all connectivity supports quantum kernel circuits with arbitrary qubit pairing. Slow gates limit number of training iterations per time unit.',
      },
      'neutral-atom': {
        reason:
          'Rydberg quantum feature maps have been proposed theoretically; few neutral-atom QML demonstrations exist. Gate mode maturity needed for practical QML workflows.',
      },
      photonic: {
        reason:
          'Xanadu\'s PennyLane originated as a photonic QML framework. Gaussian boson sampling (GBS) provides non-classical features relevant to graph-structured data. Strawberry Fields SDK targets photonic QML. Hardware-native approach for photonic quantum kernels.',
      },
      'quantum-annealing': {
        reason:
          'Restricted Boltzmann Machines and QBMs on D-Wave have been explored for generative modeling. Limited to binary/quadratic model structure; not suited for gradient-based QNN training.',
      },
      topological: {
        reason:
          'No QML demonstrations; error-protected qubits could potentially train deeper quantum circuits beyond the barren plateau — a speculative long-term benefit.',
      },
    },
    frameworks: ['pennylane', 'qiskit', 'cuda-q'],
    refs: [
      {
        title: 'Quantum machine learning',
        authors: 'Biamonte, J. et al.',
        year: '2017',
        venue: 'Nature',
        note: 'Comprehensive review of QML algorithms; foundational reference for the field.',
      },
      {
        title: 'Variational quantum algorithms',
        authors: 'Cerezo, M. et al.',
        year: '2021',
        venue: 'Nature Reviews Physics',
        note: 'Reviews VQE, QAOA, QNNs, and the barren plateau problem.',
      },
      {
        title: 'Quantum kernel methods provably outperform classical kernels on certain datasets',
        authors: 'Huang, H.-Y. et al.',
        year: '2022',
        venue: 'Science',
        note: 'Demonstrates quantum kernel advantage on specially constructed datasets with quantum structure.',
      },
    ],
    faq: [
      {
        q: 'Will quantum machine learning beat deep learning?',
        a: 'Almost certainly not in the near term, and the long-term picture is deeply uncertain. Classical deep learning is supported by decades of algorithmic development, hardware acceleration (NVIDIA GPUs, TPUs), and massive datasets. Theoretical QML speedups require specific mathematical conditions (quantum data, particular kernel structures) absent in standard ML benchmarks. The barren plateau and QRAM limitations are serious obstacles. Researchers who claim near-term QML advantage over classical ML should be regarded skeptically.',
      },
      {
        q: 'What is the barren plateau problem?',
        a: 'Barren plateaus occur in variational quantum circuits when the gradient of the cost function with respect to circuit parameters becomes exponentially small as the number of qubits increases. In practice, for random or generic parameterized circuits with N qubits, the gradient is 2^(-N) — meaning it is numerically zero for any circuit larger than ~20 qubits. This makes training QNNs infeasible above small system sizes unless the circuit has special structure that prevents barren plateaus.',
      },
      {
        q: 'Can quantum computers replace GPUs for AI training?',
        a: 'No. GPUs are massively parallel floating-point processors optimized for matrix multiplication — the backbone of neural network training. Quantum computers operate on quantum amplitudes and are designed for fundamentally different algorithmic tasks. Current quantum computers have 10s to 100s of effective qubits and run for milliseconds; GPU clusters process petaflops for days. Even in the fault-tolerant era, quantum computers are unlikely to replace GPUs for standard deep learning training on classical data.',
      },
    ],
  },

  // ── Cryptography ─────────────────────────────────────────────────────────────
  cryptography: {
    introParas: [
      'Cryptanalysis is the quantum use case with the most mathematically certain outcome: Shor\'s algorithm, published in 1994, provides an exponential speedup for integer factoring and discrete logarithm computation. This directly threatens RSA, elliptic curve cryptography (ECC), and Diffie-Hellman key exchange — the mathematical foundations of nearly all public-key cryptography in current use.',
      'Grover\'s algorithm provides a quadratic speedup for searching unsorted databases, which halves the effective security of symmetric encryption (AES-128 → equivalent to 64-bit classical) and hash functions. This is a more modest threat — AES-256 remains secure against Grover\'s attack.',
      'Critically: no quantum computer today can break any production cryptographic system. Breaking RSA-2048 requires approximately 4,000 logical qubits — which implies millions of physical qubits with current error rates. The most optimistic credible estimates place a cryptographically relevant quantum computer (CRQC) at 10+ years away. NIST finalized post-quantum cryptography standards (ML-KEM, ML-DSA, SLH-DSA) in 2024, and migration to these algorithms should be prioritized now.',
    ],
    statusAssessment:
      'Theoretical threat with research-stage demonstrations. Shor\'s algorithm has been demonstrated on small instances: 15 = 3×5 (Vandersypen 2001, 7 qubits), 21 = 3×7 (Martín-López 2012), and up to 4-bit Shor circuits (Quantinuum H2). No quantum computer can factor numbers of even 20 bits with Shor\'s algorithm against current hardware limitations. Breaking RSA-2048 remains >10 years away under any credible technical roadmap. The threat is real but not imminent.',
    whyQuantum:
      'Shor\'s algorithm uses the Quantum Fourier Transform (QFT) to find the period of a modular exponentiation function, which reveals the prime factors of large integers in polynomial time. Classical algorithms require sub-exponential but superpolynomial time (general number field sieve). This is a mathematically proven exponential quantum speedup — not an approximation. The algorithm is exact and deterministic once sufficient logical qubits and fault tolerance are available.',
    algorithms: [
      {
        name: "Shor's Algorithm",
        type: 'Fault-Tolerant',
        description:
          'Factors N-bit integers in O(N³) quantum gates using quantum Fourier transform for period finding. Breaks RSA and integer-based cryptography. Solves discrete log for ECC.',
        resourceReqs: '~4,000 logical qubits for RSA-2048; millions of physical qubits at current error rates; requires fault tolerance.',
        status: 'Theoretical; demonstrated on 2–8 qubit toy instances; RSA-scale far beyond any existing hardware.',
      },
      {
        name: "Grover's Algorithm",
        type: 'Fault-Tolerant',
        description:
          'Searches an unstructured database of N items in O(√N) quantum oracle calls, providing quadratic speedup. Reduces effective symmetric key security by half (AES-256 → 128-bit classical security).',
        resourceReqs: '1,000+ logical qubits for AES key search; circuit depth proportional to hash function evaluation.',
        status: 'Theoretical; demonstrated on small oracle circuits; does not threaten AES-256 practically.',
      },
      {
        name: 'Quantum Fourier Transform (QFT)',
        type: 'Fault-Tolerant',
        description:
          'Subroutine within Shor\'s algorithm and other number-theoretic algorithms. Computes the discrete Fourier transform exponentially faster than classical FFT for quantum input.',
        resourceReqs: 'N qubits for N-point QFT; O(N log N) gates; demonstrable on current NISQ hardware for small N.',
        status: 'Research demonstrations on 10–20 qubit circuits; component of Shor\'s algorithm.',
      },
      {
        name: 'Quantum Key Distribution (QKD)',
        type: 'Hardware Protocol',
        description:
          'Uses quantum properties (BB84, E91) to distribute cryptographic keys with information-theoretic security. Not a quantum computing algorithm — uses photon transmission. Distinct from the Shor/Grover threat model.',
        resourceReqs: 'Photon source, detector, and quantum channel; no qubit computation required.',
        status: 'Commercially deployed by ID Quantique, Toshiba, and others. Limited to point-to-point links; not internet-scalable.',
      },
    ],
    hwReqs: {
      qubits:
        '~4,000 logical qubits to break RSA-2048 (Beauregard circuit). At current physical-to-logical qubit ratios (~1,000:1 for surface codes), this implies ~4 million physical qubits with excellent error rates.',
      circuitDepth:
        'Shor\'s algorithm for RSA-2048 requires ~1.5 billion Toffoli gates (Webber et al. 2022 resource estimate). At 1 MHz logical clock rate, this is ~25 minutes per factoring instance.',
      errorTolerance:
        'Requires logical error rates of 10⁻¹⁰ per gate or lower for Shor\'s circuit length. Surface code with 1,000 physical qubits per logical qubit achieves this if physical error rates are below 10⁻³.',
      caveat:
        'Every qubit improvement in physical error rate reduces the physical qubit overhead dramatically. Hardware progress is the critical variable — if physical error rates reach 10⁻⁴, the physical qubit requirement drops from millions to hundreds of thousands.',
    },
    archReasons: {
      superconducting: {
        reason:
          'Largest available qubit counts; IBM has demonstrated QFT and Bernstein-Vazirani subroutines. Decades from Shor-relevant scale. Fast gates reduce logical clock cycle time once fault-tolerant.',
      },
      'trapped-ion': {
        reason:
          'Highest two-qubit gate fidelity of any commercial platform; Quantinuum has demonstrated small Shor circuits. All-to-all connectivity reduces SWAP overhead for Shor modular arithmetic. Slow gates (millisecond) increase Shor runtime per factoring instance.',
      },
      'neutral-atom': {
        reason:
          'Promising long-term platform for fault-tolerant computation; long coherence times. No Shor demonstrations; gate error rates still maturing. Reconfigurable arrays may suit lattice surgery for surface codes.',
      },
      photonic: {
        reason:
          'Photonic platforms can in principle execute Shor\'s algorithm but require measurement-based quantum computation with huge resource overheads. Photonic computing operates at room temperature and high clock rates but faces extreme photon loss challenges.',
      },
      'quantum-annealing': {
        reason:
          'Cannot run Shor\'s or Grover\'s algorithms — these require gate-based universal quantum computation. D-Wave quantum annealing is not a threat to cryptography.',
      },
      topological: {
        reason:
          'Microsoft\'s topological qubit approach targets logical error rates 10× lower than superconducting platforms, which could reduce the physical qubit count for Shor by an order of magnitude. The most plausible path to a compact CRQC, if topological qubits achieve the predicted error rates.',
      },
    },
    frameworks: ['qiskit', 'cirq'],
    refs: [
      {
        title: 'Algorithms for Quantum Computation: Discrete Logarithms and Factoring',
        authors: "Shor, P.W.",
        year: '1994',
        venue: 'FOCS 1994',
        note: "Original Shor's algorithm paper; exponential speedup for integer factoring proven.",
      },
      {
        title: 'Post-Quantum Cryptography Standards',
        authors: 'NIST',
        year: '2024',
        venue: 'NIST FIPS 203, 204, 205',
        note: 'ML-KEM (CRYSTALS-Kyber), ML-DSA (CRYSTALS-Dilithium), SLH-DSA (SPHINCS+) finalized as PQC standards.',
      },
      {
        title: 'The impact of hardware specifications on reaching quantum advantage in the fault tolerant regime',
        authors: 'Webber, M. et al.',
        year: '2022',
        venue: 'AVS Quantum Science',
        note: 'Resource estimates for breaking RSA-2048: ~4,000 logical qubits, ~4 million physical qubits needed.',
      },
    ],
    faq: [
      {
        q: 'Is my encrypted data safe from quantum computers right now?',
        a: 'Yes — no quantum computer today can break any production encryption. RSA-2048, AES-256, and ECC remain completely secure against any quantum hardware currently in existence or planned for the next several years. The threat is "harvest now, decrypt later": adversaries could be collecting encrypted data now, hoping to decrypt it when CRQCs exist in 10–15 years. Organizations with long-term data sensitivity (national security, healthcare records) should begin migrating to NIST-standardized post-quantum algorithms (ML-KEM, ML-DSA) now.',
      },
      {
        q: 'What is post-quantum cryptography and why does it matter?',
        a: 'Post-quantum cryptography (PQC) refers to classical cryptographic algorithms designed to resist attack by quantum computers. They run on ordinary classical hardware but are based on mathematical problems believed to be hard for quantum algorithms (lattice problems, hash functions, code-based cryptography). NIST finalized PQC standards in 2024 (FIPS 203/204/205), and all organizations should plan PQC migration timelines — especially for systems with long operational lifetimes.',
      },
      {
        q: "Why does Shor's algorithm need ~4,000 logical qubits for RSA-2048?",
        a: "Shor's algorithm for an N-bit RSA modulus requires approximately 2N logical qubits for the modular exponentiation circuit, plus ancilla qubits. For RSA-2048 (N=2048), this is roughly 4,096 logical qubits. Each logical qubit in a surface code error-correction scheme requires ~1,000 physical qubits at realistic error rates, totaling ~4 million physical qubits — far beyond any existing or near-term system.",
      },
      {
        q: "Does Grover's algorithm break AES encryption?",
        a: "Grover's algorithm halves the effective key search space, reducing AES-128 to 2^64 effective security (which is vulnerable to classical pre-computation attacks) and AES-256 to 2^128 (which remains secure). Practically, Grover's attack on AES-256 requires ~10^24 quantum operations — computationally infeasible even on theoretical large-scale quantum computers. The recommendation is to use AES-256 for quantum-resistant symmetric security.",
      },
    ],
  },

  // ── Drug Discovery ────────────────────────────────────────────────────────────
  'drug-discovery': {
    introParas: [
      'Drug discovery is an application of quantum chemistry to life sciences: simulating the quantum mechanical interactions between drug candidate molecules and biological targets (proteins, enzymes, receptors) to predict binding affinity, selectivity, and ADMET properties (Absorption, Distribution, Metabolism, Excretion, Toxicity).',
      'The key challenge is that existing computational methods — molecular dynamics (MD), quantum mechanics/molecular mechanics (QM/MM), and Free Energy Perturbation (FEP) — provide valuable predictions but are limited by the accuracy of their force field approximations and computational expense for large systems. Quantum computers could in principle simulate active sites of drug targets (30–200 correlated electrons) more accurately than classical methods, improving hit rate in early-stage drug discovery.',
      'Major pharmaceutical companies (AstraZeneca, Roche, Merck, Pfizer, Amgen) maintain quantum computing research programs and have published quantum chemistry papers targeting drug-relevant molecules. However, current quantum hardware is insufficient for any commercially relevant drug target. The honest timeline is 2030–2035 at earliest.',
    ],
    statusAssessment:
      'Research stage. VQE simulations of small active sites (FeMoco nitrogen fixation enzyme active site: ~12 qubits for minimal model; full: ~200 qubits estimated) have been demonstrated on research hardware. No quantum algorithm has provided drug-relevant accuracy on a biologically significant target molecule. AstraZeneca and Quantinuum have published early demonstrations. Classical FEP methods (Schrödinger FEP+, OpenFE) provide practical drug binding predictions today without quantum hardware.',
    whyQuantum:
      'Drug-target interactions depend critically on electron correlation — quantum mechanical effects in the active site that determine whether a drug binds with the right shape and strength. Classical DFT approximates electron correlation but fails for strongly correlated electrons in metalloenzyme active sites (cytochrome P450, nitrogenase, ribonucleotide reductase). Quantum computers can represent and compute these strongly correlated electron states exactly, potentially improving binding affinity predictions for drug candidates that interact with metalloenzyme targets.',
    algorithms: [
      {
        name: 'VQE for Active Site Simulation',
        type: 'Variational / NISQ',
        description:
          'Applies VQE to a drug target\'s active site Hamiltonian (e.g., the iron-sulfur cluster of FeMoco, the heme group of cytochrome P450) to compute ground-state energy and electronic structure.',
        resourceReqs: '10–100 qubits for minimal active space models; 100–1,000 logical qubits for chemically accurate drug-relevant simulations.',
        status: 'Research demonstrations on 4–20 qubit models; drug-relevant scale not achieved.',
      },
      {
        name: 'QPE for High-Accuracy FEP',
        type: 'Fault-Tolerant',
        description:
          'Quantum Phase Estimation applied to binding free energy calculations: computes the energy difference between drug-bound and drug-free protein states with chemical accuracy (~1 kcal/mol).',
        resourceReqs: '100–10,000 logical qubits depending on active space size; fault-tolerant hardware required.',
        status: 'Theoretical resource estimates; hardware far below required scale.',
      },
      {
        name: 'QITE for Finite-Temperature Properties',
        type: 'Variational / NISQ',
        description:
          'Quantum Imaginary Time Evolution computes finite-temperature properties (partition functions, thermal averages) relevant to biological systems at 310 K (body temperature).',
        resourceReqs: 'Similar to VQE; requires mid-circuit measurements. Research demonstrations on <20 qubits.',
        status: 'Early research stage for drug discovery applications.',
      },
    ],
    hwReqs: {
      qubits:
        'Minimal active space models: 10–50 logical qubits (demonstrable on today\'s best hardware). Drug-relevant accuracy for cytochrome P450 substrate binding: ~200 logical qubits. Full protein active site: 1,000–10,000 logical qubits.',
      circuitDepth:
        'VQE: shallow enough for NISQ (10–1,000 gates). QPE for drug-accurate calculations: millions of gates requiring full fault tolerance.',
      errorTolerance:
        'Chemical accuracy in binding energies (1 kcal/mol error) requires two-qubit gate fidelity >99.9% for VQE on drug-relevant system sizes. Quantinuum H2 (>99.5% 2Q fidelity) is closest to threshold.',
      caveat:
        'Classical FEP methods (Schrödinger FEP+, Amber, GROMACS) are extensively validated on drug-relevant systems and continue to improve. The quantum advantage threshold is set by already-capable classical physics — not simple calculations.',
    },
    archReasons: {
      superconducting: {
        reason:
          'IBM Quantum and Rigetti support VQE experiments for drug-relevant active site models. Growing qubit counts approach minimal active space sizes. Two-qubit fidelity is improving but still limits accuracy for 20+ qubit drug target simulations.',
      },
      'trapped-ion': {
        reason:
          'Best two-qubit fidelity (Quantinuum H2: >99.5%) and all-to-all connectivity make trapped-ion the current leading platform for quantum chemistry relevant to drug discovery. Quantinuum has published drug chemistry collaborations with AstraZeneca.',
      },
      'neutral-atom': {
        reason:
          'Long coherence and reconfigurable geometry useful for analog simulation of spin models related to biological signaling. Gate-based drug chemistry simulations are a natural target as neutral-atom gate fidelity matures.',
      },
      photonic: {
        reason:
          'Vibrational modes of drug-receptor interactions have theoretical photonic simulation approaches. Gate-based photonic quantum chemistry for drug discovery is experimental.',
      },
      'quantum-annealing': {
        reason:
          'Not suited for quantum chemistry. VQE and QPE for drug simulation require gate-based quantum computation; QUBO/Ising formulations cannot efficiently represent electronic structure problems.',
      },
      topological: {
        reason:
          'Ultra-low logical error rates from topological protection would dramatically reduce physical qubit overhead for QPE-based drug discovery calculations. Highly speculative but represents the most plausible path to commercially relevant drug quantum simulation.',
      },
    },
    frameworks: ['qiskit', 'pennylane', 'cuda-q'],
    refs: [
      {
        title: 'Quantum computational advantage using photons',
        authors: 'Babbush, R. et al.',
        year: '2021',
        venue: 'PRX Quantum',
        note: 'Resource estimates for fault-tolerant quantum chemistry of pharmaceutical relevance.',
      },
      {
        title: 'Quantum chemistry in the age of quantum computing',
        authors: 'Cao, Y. et al.',
        year: '2019',
        venue: 'Chemical Reviews',
        note: 'Comprehensive review of quantum algorithms for drug discovery and quantum chemistry.',
      },
      {
        title: 'Towards a quantum advantage in the simulation of fermionic systems',
        authors: 'Babbush, R. et al.',
        year: '2018',
        venue: 'Physical Review X Quantum',
        note: 'Analysis of resource requirements for drug-relevant molecular simulations.',
      },
    ],
    faq: [
      {
        q: 'Will quantum computers replace molecular dynamics simulations?',
        a: 'Unlikely in the near term; more likely to complement them. Molecular dynamics simulates atomic motion using classical force fields — fast and practical for large systems (millions of atoms, microsecond timescales). Quantum simulation addresses electron correlation in active sites where force fields are inaccurate. The most likely use case is QM/QC/MM hybrid methods: quantum computation for the active site, classical MD for the protein environment.',
      },
      {
        q: 'What is Free Energy Perturbation (FEP) and why does quantum matter?',
        a: 'FEP is a classical computational method that predicts the binding affinity change when a drug molecule is modified — critical for lead optimization in drug discovery. Current FEP methods use classical force fields and are accurate to ~1–2 kcal/mol. For drug candidates that interact with metalloenzyme active sites (where electron correlation is critical), classical FEP fails. Quantum FEP, using quantum simulation of the active site, could improve accuracy for this class of targets.',
      },
      {
        q: 'When will quantum computers help find new medicines?',
        a: 'The honest answer is 2030–2035 at the earliest for any quantum simulation result that influences a drug discovery pipeline, contingent on fault-tolerant quantum computers with 100–1,000 logical qubits. Near-term demonstrations on 10–20 qubit systems contribute scientific understanding but are too small for drug-relevant accuracy. Classical computational chemistry will continue advancing in parallel, raising the bar for quantum advantage.',
      },
    ],
  },

  // ── Logistics ─────────────────────────────────────────────────────────────────
  logistics: {
    introParas: [
      'Logistics optimization — vehicle routing, fleet scheduling, warehouse slotting, cargo loading, and multi-modal supply chain planning — represents the most commercially explored class of quantum optimization. The core mathematical problems (Vehicle Routing Problem, Traveling Salesman Problem, Job Shop Scheduling) are NP-hard combinatorial optimization problems that naturally map to QUBO and Ising formulations compatible with quantum annealing and QAOA.',
      'D-Wave has the most concrete commercial traction: proof-of-concept deployments with Volkswagen (traffic flow optimization), DHL (route planning), Lockheed Martin (scheduling), and others have been published. The D-Wave hybrid solver — combining classical optimization with quantum annealing subproblem calls — is the primary commercial interface. Quantum annealing runs in production at a handful of enterprises as hybrid solver deployments.',
      'However, the same caveat as all quantum optimization applies: quantum advantage over state-of-the-art classical logistics solvers (Google OR-Tools, Gurobi with route-specific heuristics, Concorde for TSP) has not been demonstrated at commercially relevant problem scales. Classical operations research has decades of algorithmic engineering for logistics specifically.',
    ],
    statusAssessment:
      'Experimental stage with commercial pilot deployments. D-Wave hybrid solver is deployed in production at select logistics enterprises. QAOA on gate-based QPUs has been demonstrated on small VRP instances (<20 vehicles, <50 stops). No quantum system has demonstrated advantage over best-in-class classical logistics solvers on real-world problem sizes (1,000+ vehicles, 10,000+ delivery stops). Hybrid quantum-classical approaches offer practical integration but not quantum speedup.',
    whyQuantum:
      'Logistics problems combinatorially explode with problem size: N! routes for N delivery stops, exponential constraint combinations for multi-modal scheduling. QUBO formulations map VRP/TSP to the native language of quantum annealing hardware. Quantum tunneling in annealing can in theory escape local optima where simulated annealing gets stuck. QAOA creates quantum interference between solution states to amplify high-quality routes.',
    algorithms: [
      {
        name: 'QAOA for Vehicle Routing (VRP)',
        type: 'Variational / NISQ',
        description:
          'Encodes VRP as a cost Hamiltonian and applies QAOA layers. Route assignments and vehicle-stop assignments are binary variables. Classical optimizer tunes QAOA parameters.',
        resourceReqs: 'N qubits per route assignment; 50–500 qubits for small VRP instances; circuit depth scales with routes and constraints.',
        status: 'Research demonstrations on <50-vehicle instances; classical heuristics competitive at these scales.',
      },
      {
        name: 'Quantum Annealing (QUBO/Ising)',
        type: 'Annealing',
        description:
          'D-Wave hardware minimizes QUBO energy representing VRP constraints and objective. QUBO embedding onto Pegasus graph adds logical-to-physical qubit overhead based on constraint graph density.',
        resourceReqs: 'D-Wave Advantage: 5,627 physical qubits; effective logical problem size ~500–1,500 variables after embedding; commercial Leap cloud access.',
        status: 'Commercial hybrid deployment at Volkswagen, DHL; pure quantum advantage not demonstrated.',
      },
      {
        name: 'D-Wave Hybrid Solver Service',
        type: 'Hybrid Classical-Quantum',
        description:
          'Decomposes large logistics problems into subproblems, solves key subproblems on D-Wave QPU, and combines results with classical optimization. Practically the most useful commercial quantum optimization interface.',
        resourceReqs: 'Problem-size agnostic via Leap API; works on problems with 10,000+ variables.',
        status: 'Production deployment; competitive with but does not consistently outperform best classical solvers.',
      },
      {
        name: 'QUBO Formulation Methods',
        type: 'Classical Preprocessing',
        description:
          'Converting VRP constraints (capacity, time windows, multi-depot) into QUBO penalty terms. Quality of QUBO formulation critically determines solution quality on annealing hardware.',
        resourceReqs: 'Classical preprocessing; penalty coefficient tuning; constraint satisfaction overhead.',
        status: 'Active research area; constraint mapping introduces large qubit overhead.',
      },
    ],
    hwReqs: {
      qubits:
        'Small VRP (20 vehicles, 50 stops): 200–500 physical qubits via QUBO. Medium VRP (100 vehicles, 500 stops): 2,000–5,000+ physical qubits with embedding overhead on Pegasus. D-Wave Advantage (5,627 qubits) is practical for medium problems with hybrid decomposition.',
      circuitDepth:
        'QAOA at p=1–3 depth is NISQ-compatible. Annealing has annealing time (1–2,000 µs) replacing circuit depth; optimal schedules are problem-specific.',
      errorTolerance:
        'D-Wave annealing error tolerance is set by thermal fluctuations at 15 mK. QAOA on gate-based hardware: >99% two-qubit fidelity desirable for p≥3 quality solutions.',
      caveat:
        'QUBO embedding of dense VRP constraint graphs onto sparse Pegasus topology requires chain qubits that can break, introducing embedding-specific errors. Classical Gurobi with VRP-specific branch-and-price algorithms routinely solves 1,000-stop VRPs to optimality; quantum approaches are far from this scale.',
    },
    archReasons: {
      superconducting: {
        reason:
          'QAOA circuits on IBM/Rigetti hardware have been demonstrated for small VRP instances. Noise limits QAOA approximation quality. Classical optimizers easily outperform NISQ QAOA for logistics at any scale tested.',
      },
      'trapped-ion': {
        reason:
          'Higher-fidelity QAOA circuits on small VRP instances; all-to-all connectivity helps dense constraint graphs. Slow gate rates limit problem scale achievable per time budget.',
      },
      'neutral-atom': {
        reason:
          'Maximum Independent Set and unit-disk graph problems (logistics network subproblems) map to Rydberg blockade; early demonstrations on QuEra hardware. Broader logistics optimization is research-stage.',
      },
      photonic: {
        reason:
          'Coherent Ising machines using optical oscillators have been demonstrated for MAX-CUT and some logistics subproblems. Not gate-based; limited to quadratic unconstrained problems; scalability limited by photon loss.',
      },
      'quantum-annealing': {
        reason:
          'The natural platform for logistics QUBO. D-Wave Advantage has the most commercial logistics deployments. Hybrid solver service manages large problem decomposition. Sparse Pegasus topology limits dense constraint graph embedding.',
      },
      topological: {
        reason:
          'No logistics demonstrations; architecture targeted at fault-tolerant universal computation, not near-term optimization. Irrelevant for current logistics quantum computing applications.',
      },
    },
    frameworks: ['pennylane', 'qiskit', 'amazon-braket-sdk'],
    refs: [
      {
        title: 'Quantum computing for traffic flow optimization',
        authors: 'Neukart, F. et al. (Volkswagen, D-Wave)',
        year: '2017',
        venue: 'Frontiers in ICT',
        note: 'Early demonstration of D-Wave quantum annealing for vehicle routing in urban traffic.',
      },
      {
        title: 'Ising formulations of many NP problems',
        authors: 'Lucas, A.',
        year: '2014',
        venue: 'Frontiers in Physics',
        note: 'Reference compendium of QUBO/Ising formulations for 21 NP-hard problems including VRP, TSP, scheduling.',
      },
      {
        title: 'Quantum computing for supply chain optimization: A comparative study',
        authors: 'Orus, R., Mugel, S., Lizaso, E.',
        year: '2019',
        venue: 'Nature Reviews Physics (commentary)',
        note: 'Assessment of quantum computing readiness for logistics and supply chain applications.',
      },
    ],
    faq: [
      {
        q: 'Can quantum computers route 1,000 delivery trucks today?',
        a: 'No. Current quantum hardware can handle toy VRP instances with 10–50 vehicles. D-Wave hybrid solver can interface with problems of 1,000+ variables via classical decomposition, but the "quantum" portion handles only a subproblem. For 1,000 trucks with realistic constraints (time windows, capacity, multi-depot), classical OR-Tools or Gurobi with VRP-specific algorithms are definitively superior to any quantum approach available today.',
      },
      {
        q: 'Is D-Wave\'s annealing hardware useful for real logistics?',
        a: 'Yes, in a limited sense. D-Wave hybrid solver is deployed in production at a handful of logistics enterprises and provides competitive optimization quality on mid-sized problems. The business value comes from: (1) ability to formulate logistics problems as QUBO, (2) D-Wave\'s classical-quantum hybrid infrastructure, and (3) reasonable solution quality within annealing time budgets. It does not outperform best classical solvers — it provides a different optimization approach with competitive trade-offs.',
      },
      {
        q: 'What problem scales would quantum logistics actually beat classical?',
        a: 'This is an open research question. The expectation, if quantum advantage ever materializes for logistics, is in specific problem classes: very dense, highly constrained routing problems with complex time-window interactions that frustrate classical branch-and-bound. No such demonstration exists. A realistic estimate for quantum logistics advantage at commercially relevant scale (1,000+ stops) is 5–10+ years away, contingent on hardware and algorithmic improvements.',
      },
    ],
  },
}

// ── Section heading style ─────────────────────────────────────────────────────

const sectionTitle: React.CSSProperties = {
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  margin: '0 0 4px',
  letterSpacing: '-0.01em',
}

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-panel)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: '20px',
  marginBottom: 24,
}

// ── Mini QPU Card ─────────────────────────────────────────────────────────────

function MiniQPUCard({ qpu }: { qpu: QPU }) {
  const twoQFidelity = qpu.fidelity?.twoQubitGate?.value

  return (
    <Link
      href={`/qpus/${qpu.slug}`}
      className="block group"
      aria-label={`View ${qpu.name} details`}
    >
      <div
        style={{
          ...cardStyle,
          marginBottom: 0,
          transition: 'border-color 0.12s, background 0.12s',
        }}
        className="group-hover:border-[var(--color-border-strong)] group-hover:bg-[var(--color-bg-overlay)]"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
            {qpu.name}
          </p>
          <StatusBadge status={qpu.status} size="sm" />
        </div>
        <div style={{ marginBottom: 8 }}>
          <ArchitectureBadge architecture={qpu.architecture} size="sm" />
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: '12px', color: 'var(--color-text-muted)' }}>
          <span>{formatQubits(qpu.physicalQubits)} qubits</span>
          {twoQFidelity !== null && twoQFidelity !== undefined && (
            <span>{twoQFidelity.toFixed(2)}% 2Q</span>
          )}
          {qpu.algorithmicQubits && (
            <span>#AQ {qpu.algorithmicQubits}</span>
          )}
        </div>
        <div style={{ marginTop: 8, textAlign: 'right' }}>
          <span className="text-xs text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
            View specs →
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface UseCaseDetailProps {
  useCase: UseCase
  qpus: QPU[]
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function UseCaseDetail({ useCase, qpus }: UseCaseDetailProps) {
  const content = CONTENT_MAP[useCase.slug]
  const statusCfg = UC_STATUS_CONFIG[useCase.status]

  // Filter QPUs by architecture suitability: strong or possible
  const applicableQPUs = qpus.filter((q) => {
    const suit = useCase.architectureSuitability[q.architecture]
    return suit === 'strong' || suit === 'possible'
  })

  return (
    <div style={{ background: 'var(--color-bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* ── Breadcrumb ── */}
        <div style={{ paddingTop: 24 }}>
          <Breadcrumb
            items={[
              { label: 'QPU.co', href: '/' },
              { label: 'Use Cases', href: '/use-cases' },
              { label: useCase.name },
            ]}
          />
        </div>

        {/* Two-column layout */}
        <div
          className="use-case-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 300px',
            gap: '40px',
            padding: '24px 0 80px',
            alignItems: 'start',
          }}
        >
          {/* ── Main Content ── */}
          <div style={{ minWidth: 0 }}>

            {/* ── Hero ── */}
            <div style={{ ...cardStyle, background: 'var(--color-bg-raised)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: 1.2 }}>
                  {useCase.name} and Quantum Computing
                </h1>
                <Badge variant={statusCfg.variant} size="md">
                  {statusCfg.label}
                </Badge>
              </div>

              {content ? (
                <>
                  {content.introParas.map((para, i) => (
                    <p
                      key={i}
                      style={{
                        margin: i < content.introParas.length - 1 ? '0 0 12px' : 0,
                        fontSize: '14px',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.7,
                        maxWidth: '72ch',
                      }}
                    >
                      {para}
                    </p>
                  ))}
                </>
              ) : (
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {useCase.description}
                </p>
              )}
            </div>

            {/* ── Current Status Panel ── */}
            <div
              style={{
                ...cardStyle,
                background: 'rgba(245,158,11,0.04)',
                border: '1.5px solid rgba(245,158,11,0.2)',
              }}
            >
              <h2 style={{ ...sectionTitle, marginBottom: 12, color: 'var(--color-warning)' }}>
                Current Status — Honest Assessment
              </h2>
              {content ? (
                <p style={{ margin: '0 0 16px', fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {content.statusAssessment}
                </p>
              ) : (
                <p style={{ margin: '0 0 16px', fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {useCase.keyChallenge}
                </p>
              )}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: '12px' }}>
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-bg-raised)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <p className="mono-label" style={{ marginBottom: 2 }}>Qubit Requirement</p>
                  <p style={{ margin: 0, color: 'var(--color-text-primary)', fontWeight: 500 }}>
                    {useCase.qubitRequirement}
                  </p>
                </div>
                {useCase.timelineEstimate && (
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg-raised)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <p className="mono-label" style={{ marginBottom: 2 }}>Timeline Estimate</p>
                    <p style={{ margin: 0, color: 'var(--color-text-primary)', fontWeight: 500 }}>
                      {useCase.timelineEstimate}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Why Quantum Computing May Help ── */}
            {content && (
              <div style={cardStyle}>
                <h2 style={{ ...sectionTitle, marginBottom: 12 }}>Why Quantum Computing May Help</h2>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: '72ch' }}>
                  {content.whyQuantum}
                </p>
              </div>
            )}

            {/* ── Relevant Algorithms ── */}
            {content && content.algorithms.length > 0 && (
              <div style={cardStyle}>
                <h2 style={{ ...sectionTitle, marginBottom: 16 }}>Relevant Algorithms</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {content.algorithms.map((alg, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-bg-raised)',
                        border: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {alg.name}
                        </p>
                        <Badge variant="muted" size="sm">{alg.type}</Badge>
                      </div>
                      <p style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                        {alg.description}
                      </p>
                      <div style={{ display: 'flex', gap: 16, fontSize: '12px' }}>
                        <div>
                          <span className="mono-label">Resources: </span>
                          <span style={{ color: 'var(--color-text-secondary)' }}>{alg.resourceReqs}</span>
                        </div>
                      </div>
                      <div style={{ marginTop: 4, fontSize: '12px' }}>
                        <span className="mono-label">Status: </span>
                        <span style={{ color: 'var(--color-text-muted)' }}>{alg.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Hardware Requirements ── */}
            {content && (
              <div style={cardStyle}>
                <h2 style={{ ...sectionTitle, marginBottom: 16 }}>Hardware Requirements</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Qubit Count', value: content.hwReqs.qubits },
                    { label: 'Circuit Depth', value: content.hwReqs.circuitDepth },
                    { label: 'Error Tolerance', value: content.hwReqs.errorTolerance },
                    { label: 'Key Limitation', value: content.hwReqs.caveat },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-bg-raised)',
                        border: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      <p className="mono-label" style={{ marginBottom: 4 }}>{item.label}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Architecture Suitability Matrix ── */}
            <div style={cardStyle}>
              <h2 style={{ ...sectionTitle, marginBottom: 16 }}>Architecture Suitability</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {ALL_ARCHITECTURES.map((arch, idx) => {
                  const suit = useCase.architectureSuitability[arch]
                  const archReason = content?.archReasons[arch]?.reason
                  const isLast = idx === ALL_ARCHITECTURES.length - 1

                  return (
                    <div
                      key={arch}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '160px 100px 1fr',
                        gap: 12,
                        padding: '12px 0',
                        borderBottom: isLast ? 'none' : '1px solid var(--color-border-subtle)',
                        alignItems: 'start',
                      }}
                    >
                      <ArchitectureBadge architecture={arch} size="sm" />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <SuitabilityIndicator level={suit} showLabel size="sm" />
                      </div>
                      {archReason && (
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.55 }}>
                          {archReason}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Applicable QPUs ── */}
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ ...sectionTitle, marginBottom: 4 }}>Applicable Quantum Processors</h2>
              <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                QPUs with &apos;strong&apos; or &apos;possible&apos; architecture suitability for this workload.
              </p>
              {applicableQPUs.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                  {applicableQPUs.map((qpu) => (
                    <MiniQPUCard key={qpu.id} qpu={qpu} />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-panel)',
                    fontSize: '13px',
                    color: 'var(--color-text-muted)',
                    textAlign: 'center',
                  }}
                >
                  No QPUs are currently rated strong or possible suitability for this workload.
                  Hardware requirements exceed currently available systems.
                </div>
              )}
            </section>

            {/* ── Quantum Computation Workflow ── */}
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ ...sectionTitle, marginBottom: 4 }}>Quantum Computation Workflow</h2>
              <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                How a quantum computation flows from problem formulation to result — classical and QPU steps.
              </p>
              <WorkflowDiagram />
            </section>

            {/* ── Relevant Frameworks ── */}
            {content && content.frameworks.length > 0 && (
              <div style={cardStyle}>
                <h2 style={{ ...sectionTitle, marginBottom: 4 }}>Relevant Frameworks</h2>
                <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Quantum software frameworks applicable to this use case.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {content.frameworks.map((fw) => (
                    <a
                      key={fw}
                      href={FRAMEWORK_URLS[fw] ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-bg-raised)',
                        border: '1px solid var(--color-border)',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        transition: 'border-color 0.12s, color 0.12s',
                      }}
                    >
                      {FRAMEWORK_LABELS[fw] ?? fw}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ── Research & References ── */}
            {content && content.refs.length > 0 && (
              <div style={cardStyle}>
                <h2 style={{ ...sectionTitle, marginBottom: 4 }}>Research & References</h2>
                <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Key papers and demonstrations. References are provided for context — QPU.co makes no claim about completeness or current accuracy.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {content.refs.map((ref, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-bg-raised)',
                        border: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
                        {ref.title}
                      </p>
                      <p style={{ margin: '0 0 4px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {ref.authors} · {ref.year} · {ref.venue}
                      </p>
                      {ref.note && (
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                          {ref.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── FAQ ── */}
            {content && content.faq.length > 0 && (
              <div style={cardStyle}>
                <h2 style={{ ...sectionTitle, marginBottom: 16 }}>Frequently Asked Questions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {content.faq.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        borderBottom: i < content.faq.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                        paddingBottom: i < content.faq.length - 1 ? 16 : 0,
                      }}
                    >
                      <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
                        {item.q}
                      </p>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Sidebar ── */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80 }}>
            {/* Quick Facts */}
            <div style={{ ...cardStyle, marginBottom: 0 }}>
              <h3 style={{ ...sectionTitle, fontSize: '0.875rem', marginBottom: 12 }}>Quick Facts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <p className="mono-label" style={{ marginBottom: 2 }}>Status</p>
                  <Badge variant={statusCfg.variant} size="md">{statusCfg.label}</Badge>
                </div>
                <div>
                  <p className="mono-label" style={{ marginBottom: 2 }}>Category</p>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-primary)' }}>{useCase.category}</p>
                </div>
                <div>
                  <p className="mono-label" style={{ marginBottom: 2 }}>Qubit Requirement</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {useCase.qubitRequirement}
                  </p>
                </div>
                {useCase.timelineEstimate && (
                  <div>
                    <p className="mono-label" style={{ marginBottom: 2 }}>Timeline Estimate</p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                      {useCase.timelineEstimate}
                    </p>
                  </div>
                )}
                <div>
                  <p className="mono-label" style={{ marginBottom: 2 }}>Key Challenge</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {useCase.keyChallenge}
                  </p>
                </div>
              </div>
            </div>

            {/* Architecture Fit Summary */}
            <div style={{ ...cardStyle, marginBottom: 0 }}>
              <h3 style={{ ...sectionTitle, fontSize: '0.875rem', marginBottom: 12 }}>Architecture Fit</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ALL_ARCHITECTURES.map((arch) => {
                  const suit = useCase.architectureSuitability[arch]
                  return (
                    <div
                      key={arch}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                      }}
                    >
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        {architectureLabel(arch)}
                      </span>
                      <SuitabilityIndicator level={suit} size="sm" showLabel />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Applicable QPUs Count */}
            <div style={{ ...cardStyle, marginBottom: 0 }}>
              <h3 style={{ ...sectionTitle, fontSize: '0.875rem', marginBottom: 8 }}>Applicable QPUs</h3>
              <p style={{ margin: '0 0 12px', fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {applicableQPUs.length}
              </p>
              <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {applicableQPUs.length === 0
                  ? 'No current QPUs are rated strong or possible for this workload. Requirements exceed existing hardware.'
                  : `QPU${applicableQPUs.length !== 1 ? 's' : ''} with strong or possible architecture suitability for this workload.`}
              </p>
              <Link
                href="/use-cases"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-accent-dim)',
                  border: '1px solid rgba(34,211,238,0.25)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-accent)',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                ← All Use Cases
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .use-case-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .hw-reqs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
