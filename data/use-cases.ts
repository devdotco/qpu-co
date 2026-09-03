import type { UseCase } from '../types'

export const useCases: UseCase[] = [
  {
    id: 'chemistry',
    slug: 'chemistry',
    name: 'Quantum Chemistry',
    category: 'Science',
    description:
      'Simulating molecular electronic structure to compute ground-state energies, reaction pathways, and transition states. Quantum computers can efficiently represent fermion wavefunctions using the Jordan-Wigner or Bravyi-Kitaev mappings, offering exponential speedup over classical coupled-cluster methods for strongly correlated systems.',
    architectureSuitability: {
      'superconducting': 'strong',
      'trapped-ion': 'strong',
      'neutral-atom': 'possible',
      'photonic': 'experimental',
      'quantum-annealing': 'limited',
      'topological': 'unknown',
    },
    status: 'research',
    qubitRequirement: '100–1000 logical qubits for commercially relevant molecules; millions for drug-scale targets',
    timelineEstimate: 'Fault-tolerant advantage: ~2030–2035',
    keyChallenge:
      'Error rates on current NISQ hardware limit circuit depth; VQE converges slowly for large active spaces.',
  },
  {
    id: 'materials-science',
    slug: 'materials-science',
    name: 'Materials Science & Discovery',
    category: 'Science',
    description:
      'Simulating solid-state physics phenomena including high-temperature superconductivity, topological insulators, and novel battery materials. Quantum algorithms (Hubbard model simulation, quantum phase estimation) can characterize material properties that are intractable with density functional theory (DFT) alone.',
    architectureSuitability: {
      'superconducting': 'strong',
      'trapped-ion': 'strong',
      'neutral-atom': 'strong',
      'photonic': 'experimental',
      'quantum-annealing': 'limited',
      'topological': 'unknown',
    },
    status: 'research',
    qubitRequirement: '1000–10,000 logical qubits for industrially relevant materials',
    timelineEstimate: 'NISQ demonstrations: now; fault-tolerant advantage: ~2030+',
    keyChallenge:
      'Encoding periodic boundary conditions and electron correlation at scale requires deep circuits beyond current hardware.',
  },
  {
    id: 'optimization',
    slug: 'optimization',
    name: 'Combinatorial Optimization',
    category: 'Industry',
    description:
      'Solving NP-hard combinatorial problems including vehicle routing, supply chain scheduling, portfolio optimization, and network design. Approaches include QAOA (gate-based), quantum annealing (D-Wave), and quantum-inspired algorithms. Currently the most commercially explored application area.',
    architectureSuitability: {
      'superconducting': 'possible',
      'trapped-ion': 'possible',
      'neutral-atom': 'possible',
      'photonic': 'experimental',
      'quantum-annealing': 'strong',
      'topological': 'unknown',
    },
    status: 'experimental',
    qubitRequirement: '100–5000 physical qubits (NISQ); problem-size dependent',
    timelineEstimate: 'Hybrid classical-quantum advantage: possibly achievable in near term for specific subclasses',
    keyChallenge:
      'Demonstrating quantum advantage over state-of-the-art classical solvers (Gurobi, CPLEX) has not been achieved for practical problem sizes.',
  },
  {
    id: 'finance',
    slug: 'finance',
    name: 'Financial Modeling',
    category: 'Industry',
    description:
      'Monte Carlo simulation acceleration via quantum amplitude estimation, derivative pricing, risk analysis (VaR/CVaR), and portfolio optimization. Quantum amplitude estimation offers a quadratic speedup over classical Monte Carlo for integration tasks.',
    architectureSuitability: {
      'superconducting': 'possible',
      'trapped-ion': 'possible',
      'neutral-atom': 'experimental',
      'photonic': 'experimental',
      'quantum-annealing': 'possible',
      'topological': 'unknown',
    },
    status: 'research',
    qubitRequirement: '1000+ logical qubits for meaningful Monte Carlo speedup',
    timelineEstimate: 'Practical quantum advantage: ~2028–2032',
    keyChallenge:
      'Amplitude estimation requires deep circuits (many gates) that exceed current hardware noise thresholds; classical methods are highly optimized.',
  },
  {
    id: 'machine-learning',
    slug: 'machine-learning',
    name: 'Quantum Machine Learning',
    category: 'AI / ML',
    description:
      'Training and inference on quantum neural networks (QNNs), kernel methods using quantum feature maps, and quantum-enhanced generative models. PennyLane and Qiskit Machine Learning support variational classifiers and quantum SVMs. Whether QML provides genuine speedup over classical ML remains an active research question.',
    architectureSuitability: {
      'superconducting': 'possible',
      'trapped-ion': 'possible',
      'neutral-atom': 'experimental',
      'photonic': 'possible',
      'quantum-annealing': 'limited',
      'topological': 'unknown',
    },
    status: 'research',
    qubitRequirement: '10–100 qubits for current NISQ QML; no clear fault-tolerant requirement established',
    timelineEstimate: 'Unclear; theoretical speedups require further characterization',
    keyChallenge:
      'Barren plateau problem hampers training of deep QNNs; quantum data loading (QRAM) is a major unsolved bottleneck.',
  },
  {
    id: 'cryptography',
    slug: 'cryptography',
    name: 'Cryptanalysis & Post-Quantum Cryptography',
    category: 'Security',
    description:
      'Shor\'s algorithm can factor large integers and solve discrete logarithms exponentially faster than classical algorithms, threatening RSA, ECC, and Diffie-Hellman. Grover\'s algorithm provides a quadratic speedup for symmetric key search. NIST finalized post-quantum cryptography standards (ML-KEM, ML-DSA) in 2024 in response.',
    architectureSuitability: {
      'superconducting': 'experimental',
      'trapped-ion': 'experimental',
      'neutral-atom': 'experimental',
      'photonic': 'experimental',
      'quantum-annealing': 'limited',
      'topological': 'experimental',
    },
    status: 'theoretical',
    qubitRequirement: '~4000 logical qubits to break RSA-2048; millions of physical qubits with current error rates',
    timelineEstimate: 'Cryptographically relevant quantum computer: >10 years away',
    keyChallenge:
      'Requires millions of fault-tolerant physical qubits. No current or near-term system threatens production cryptography.',
  },
  {
    id: 'drug-discovery',
    slug: 'drug-discovery',
    name: 'Drug Discovery & Protein Folding',
    category: 'Life Sciences',
    description:
      'Quantum simulation of protein-ligand binding energies, pharmacophore modeling, and ADMET property prediction. Quantum computers could eventually surpass classical free-energy perturbation (FEP) methods for predicting binding affinities of drug candidates against disease targets.',
    architectureSuitability: {
      'superconducting': 'strong',
      'trapped-ion': 'strong',
      'neutral-atom': 'possible',
      'photonic': 'experimental',
      'quantum-annealing': 'limited',
      'topological': 'unknown',
    },
    status: 'research',
    qubitRequirement: '100–10,000 logical qubits depending on target molecule complexity',
    timelineEstimate: 'First meaningful quantum advantage in FEP calculations: ~2030–2035',
    keyChallenge:
      'Biological molecules of interest (enzymes, membrane proteins) require active spaces too large for current NISQ hardware.',
  },
  {
    id: 'logistics',
    slug: 'logistics',
    name: 'Logistics & Supply Chain',
    category: 'Industry',
    description:
      'Quantum optimization applied to last-mile delivery routing (VRP), warehouse slotting, flight crew scheduling, and multi-modal supply chain planning. D-Wave and hybrid quantum-classical solvers are already deployed in proof-of-concept engagements with logistics companies.',
    architectureSuitability: {
      'superconducting': 'possible',
      'trapped-ion': 'possible',
      'neutral-atom': 'experimental',
      'photonic': 'limited',
      'quantum-annealing': 'strong',
      'topological': 'unknown',
    },
    status: 'experimental',
    qubitRequirement: '500–5000 physical qubits; problem-size dependent via QUBO formulation',
    timelineEstimate: 'Hybrid quantum-classical approaches already in pilot; pure quantum advantage unclear',
    keyChallenge:
      'QUBO embedding on sparse annealer graphs adds logical qubit overhead; classical branch-and-bound solvers remain competitive at most practical scales.',
  },
]
