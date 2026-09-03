import type { WorkloadMatrixCell } from '../types'

// Workloads × Architecture suitability matrix
// Suitability ratings reflect current (NISQ-era) hardware capabilities,
// not theoretical future fault-tolerant potential.

export const workloadMatrix: WorkloadMatrixCell[] = [
  // ── Chemistry Simulation ──────────────────────────────────────────────────
  {
    workload: 'chemistry',
    architecture: 'superconducting',
    suitability: 'strong',
    notes: 'Largest NISQ chemistry experiments run on superconducting hardware (IBM, Google). Gate speed allows deeper VQE/QAOA circuits within coherence window.',
  },
  {
    workload: 'chemistry',
    architecture: 'trapped-ion',
    suitability: 'strong',
    notes: 'All-to-all connectivity and high gate fidelity allow accurate simulation of molecular Hamiltonians with fewer SWAP gates. Quantinuum H2 has demonstrated H2 and LiH ground state calculations.',
  },
  {
    workload: 'chemistry',
    architecture: 'neutral-atom',
    suitability: 'possible',
    notes: 'Neutral-atom arrays can simulate spin Hamiltonians naturally; gate-based quantum chemistry requires gated mode (in development for most platforms).',
  },
  {
    workload: 'chemistry',
    architecture: 'photonic',
    suitability: 'experimental',
    notes: 'Gaussian boson sampling has applications in vibronic spectra calculations; gate-based chemistry on photonics is pre-commercial.',
  },
  {
    workload: 'chemistry',
    architecture: 'quantum-annealing',
    suitability: 'limited',
    notes: 'Quantum annealers cannot directly implement standard chemistry algorithms (VQE, QPE). Some reformulations as QUBO exist but are highly approximate.',
  },
  {
    workload: 'chemistry',
    architecture: 'topological',
    suitability: 'unknown',
    notes: 'No working topological QPU demonstrated. Theoretically compatible with universal gate-based chemistry simulation when fault-tolerant.',
  },

  // ── Materials Simulation ──────────────────────────────────────────────────
  {
    workload: 'materials-science',
    architecture: 'superconducting',
    suitability: 'strong',
    notes: 'Fermi-Hubbard model simulations and quantum phase transition studies run on superconducting hardware. Google and IBM have published milestone results.',
  },
  {
    workload: 'materials-science',
    architecture: 'trapped-ion',
    suitability: 'strong',
    notes: 'High fidelity enables accurate Hamiltonian simulation. IonQ and Quantinuum have run condensed matter simulations including spin chains.',
  },
  {
    workload: 'materials-science',
    architecture: 'neutral-atom',
    suitability: 'strong',
    notes: 'Analog neutral-atom arrays natively simulate spin lattice Hamiltonians. QuEra published quantum spin liquid simulation at 219 atoms — largest to date.',
  },
  {
    workload: 'materials-science',
    architecture: 'photonic',
    suitability: 'experimental',
    notes: 'Photonic systems have simulated small bosonic lattice models; not competitive for electron correlation problems yet.',
  },
  {
    workload: 'materials-science',
    architecture: 'quantum-annealing',
    suitability: 'limited',
    notes: 'Materials problems with Ising-type ground states (e.g., frustrated magnets) can be sampled, but general materials simulation requires universal gates.',
  },
  {
    workload: 'materials-science',
    architecture: 'topological',
    suitability: 'unknown',
    notes: 'Future topological QPUs would be well-suited but are not yet demonstrated.',
  },

  // ── Combinatorial Optimization ─────────────────────────────────────────────
  {
    workload: 'optimization',
    architecture: 'superconducting',
    suitability: 'possible',
    notes: 'QAOA implemented on superconducting hardware for MaxCut and portfolio optimization. Outperforming classical solvers at scale not yet demonstrated.',
  },
  {
    workload: 'optimization',
    architecture: 'trapped-ion',
    suitability: 'possible',
    notes: 'All-to-all connectivity is advantageous for densely connected optimization graphs. IonQ has demonstrated QAOA circuits; classical advantage not yet shown.',
  },
  {
    workload: 'optimization',
    architecture: 'neutral-atom',
    suitability: 'possible',
    notes: 'Maximum Independent Set (MIS) problems map directly to Rydberg blockade graph. QuEra has demonstrated native advantage for unit-disk graph MIS.',
  },
  {
    workload: 'optimization',
    architecture: 'photonic',
    suitability: 'experimental',
    notes: 'Coherent Ising machines (optical parametric oscillators) solve Ising problems but use analog photonic hardware, not digital quantum gates.',
  },
  {
    workload: 'optimization',
    architecture: 'quantum-annealing',
    suitability: 'strong',
    notes: 'D-Wave Advantage systems natively solve QUBO/Ising optimization problems. Hybrid BQM solver handles industry-scale problems. Most commercially mature quantum application.',
  },
  {
    workload: 'optimization',
    architecture: 'topological',
    suitability: 'unknown',
    notes: 'No demonstrated system. Would be compatible with universal gate-based QAOA when fault-tolerant.',
  },

  // ── Financial Modeling ─────────────────────────────────────────────────────
  {
    workload: 'finance',
    architecture: 'superconducting',
    suitability: 'possible',
    notes: 'Quantum amplitude estimation for option pricing demonstrated at small scale on IBM hardware. Deep circuits required for meaningful speedup exceed current NISQ depth.',
  },
  {
    workload: 'finance',
    architecture: 'trapped-ion',
    suitability: 'possible',
    notes: 'Higher fidelity allows deeper amplitude estimation circuits. Quantinuum and IonQ have run financial risk calculation demos.',
  },
  {
    workload: 'finance',
    architecture: 'neutral-atom',
    suitability: 'experimental',
    notes: 'Gate-based mode required; analog neutral atoms are not suited for Monte Carlo-style finance algorithms. Research-stage exploration only.',
  },
  {
    workload: 'finance',
    architecture: 'photonic',
    suitability: 'experimental',
    notes: 'Xanadu has explored financial sampling applications with GBS; Gaussian boson sampling may accelerate specific risk calculations.',
  },
  {
    workload: 'finance',
    architecture: 'quantum-annealing',
    suitability: 'possible',
    notes: 'Portfolio optimization as a QUBO is a well-studied D-Wave application. 1QBit and other quantum software firms have built Leap-based finance tools.',
  },
  {
    workload: 'finance',
    architecture: 'topological',
    suitability: 'unknown',
    notes: 'No demonstrated system.',
  },

  // ── Quantum Machine Learning ───────────────────────────────────────────────
  {
    workload: 'machine-learning',
    architecture: 'superconducting',
    suitability: 'possible',
    notes: 'Variational classifiers and quantum kernel methods demonstrated on IBM and Google hardware. Practical advantage over classical ML unclear; barren plateaus are a concern.',
  },
  {
    workload: 'machine-learning',
    architecture: 'trapped-ion',
    suitability: 'possible',
    notes: 'High gate fidelity reduces noise in gradient estimation; IonQ has explored quantum neural networks. Same fundamental limitations as superconducting for QML.',
  },
  {
    workload: 'machine-learning',
    architecture: 'neutral-atom',
    suitability: 'experimental',
    notes: 'Reservoir computing and recurrent quantum network architectures explored in neutral-atom analog mode. Gate-based QML requires gated mode.',
  },
  {
    workload: 'machine-learning',
    architecture: 'photonic',
    suitability: 'possible',
    notes: 'Photonic hardware is naturally suited to linear-optical neural networks. Xanadu and Lightmatter (neuromorphic photonics) actively developing this direction.',
  },
  {
    workload: 'machine-learning',
    architecture: 'quantum-annealing',
    suitability: 'limited',
    notes: 'Quantum Boltzmann machines and training restricted Boltzmann machines (RBMs) on D-Wave have been explored but do not scale favorably versus GPU-based classical training.',
  },
  {
    workload: 'machine-learning',
    architecture: 'topological',
    suitability: 'unknown',
    notes: 'No demonstrated system.',
  },

  // ── Cryptanalysis ──────────────────────────────────────────────────────────
  {
    workload: 'cryptography',
    architecture: 'superconducting',
    suitability: 'experimental',
    notes: 'Shor\'s algorithm requires millions of fault-tolerant qubits — far beyond current superconducting systems. Small-scale demonstrations only (e.g., factoring 15, 21).',
  },
  {
    workload: 'cryptography',
    architecture: 'trapped-ion',
    suitability: 'experimental',
    notes: 'Same fundamental limitation as superconducting: fault-tolerant scale required. Trapped-ion higher fidelity helps error correction overhead but doesn\'t change the scale gap.',
  },
  {
    workload: 'cryptography',
    architecture: 'neutral-atom',
    suitability: 'experimental',
    notes: 'Not yet demonstrated; requires full gate-based universal computing at fault-tolerant scale.',
  },
  {
    workload: 'cryptography',
    architecture: 'photonic',
    suitability: 'experimental',
    notes: 'PsiQuantum targets fault-tolerant photonic computing which would support Shor\'s algorithm; decades-scale roadmap.',
  },
  {
    workload: 'cryptography',
    architecture: 'quantum-annealing',
    suitability: 'limited',
    notes: 'Quantum annealers cannot implement Shor\'s or Grover\'s algorithms. Some lattice problem heuristics have been explored with limited results.',
  },
  {
    workload: 'cryptography',
    architecture: 'topological',
    suitability: 'experimental',
    notes: 'Topological qubits\' lower error rates could reduce the fault-tolerant qubit overhead for Shor\'s algorithm, but the platform is not yet demonstrated.',
  },

  // ── Drug Discovery ─────────────────────────────────────────────────────────
  {
    workload: 'drug-discovery',
    architecture: 'superconducting',
    suitability: 'strong',
    notes: 'Same as quantum chemistry — superconducting hardware leads in VQE demonstrations for small molecules relevant to pharmaceutical targets.',
  },
  {
    workload: 'drug-discovery',
    architecture: 'trapped-ion',
    suitability: 'strong',
    notes: 'High fidelity enables longer coherent evolution for binding energy calculations. Roche and Merck have run protein-ligand studies on IonQ hardware.',
  },
  {
    workload: 'drug-discovery',
    architecture: 'neutral-atom',
    suitability: 'possible',
    notes: 'Quantum simulation of binding site Hamiltonians is a natural fit for gate-based neutral-atom systems when available at sufficient qubit count.',
  },
  {
    workload: 'drug-discovery',
    architecture: 'photonic',
    suitability: 'experimental',
    notes: 'Vibronic spectra calculations via GBS have pharmaceutical relevance; gate-based drug discovery on photonics is pre-commercial.',
  },
  {
    workload: 'drug-discovery',
    architecture: 'quantum-annealing',
    suitability: 'limited',
    notes: 'Protein docking optimization as a QUBO has been explored, but molecular simulation requires universal gate-based hardware.',
  },
  {
    workload: 'drug-discovery',
    architecture: 'topological',
    suitability: 'unknown',
    notes: 'No demonstrated system.',
  },

  // ── Logistics ─────────────────────────────────────────────────────────────
  {
    workload: 'logistics',
    architecture: 'superconducting',
    suitability: 'possible',
    notes: 'QAOA for VRP and TSP demonstrated on IBM hardware. Problem sizes that fit current NISQ systems are easily solved classically; advantage at scale unproven.',
  },
  {
    workload: 'logistics',
    architecture: 'trapped-ion',
    suitability: 'possible',
    notes: 'All-to-all connectivity helps for dense logistics graphs. IonQ has logistics pilot programs; classical solver comparison data mixed.',
  },
  {
    workload: 'logistics',
    architecture: 'neutral-atom',
    suitability: 'experimental',
    notes: 'MIS problems arising in delivery zone partitioning explored on QuEra Aquila. Broader logistics mapping to neutral-atom hardware requires further research.',
  },
  {
    workload: 'logistics',
    architecture: 'photonic',
    suitability: 'limited',
    notes: 'No established photonic logistics application. Coherent Ising machines can handle small TSP instances but are analog, not digital quantum hardware.',
  },
  {
    workload: 'logistics',
    architecture: 'quantum-annealing',
    suitability: 'strong',
    notes: 'D-Wave\'s Leap Hybrid Solver has active logistics deployments (Volkswagen, DHL, port routing). Most commercially mature quantum logistics application.',
  },
  {
    workload: 'logistics',
    architecture: 'topological',
    suitability: 'unknown',
    notes: 'No demonstrated system.',
  },
]
