import type { Architecture } from '../types'

export const architectures: Architecture[] = [
  {
    id: 'superconducting',
    slug: 'superconducting',
    name: 'Superconducting',
    qubitMedium: 'Josephson junction-based superconducting circuits (transmon qubits)',
    controlMechanism: 'Microwave pulses applied via coaxial lines and resonators',
    operatingEnvironment: '~15 millikelvin — dilution refrigerator required',
    gateSpeed: 'Single-qubit gates: ~10–100 ns; two-qubit gates: ~40–500 ns',
    connectivity: 'Fixed, nearest-neighbor topology (e.g., heavy-hex, square lattice); all-to-all requires SWAP overhead',
    coherenceNotes:
      'T1 (relaxation): typically 50–500 µs; T2 (dephasing): 10–300 µs. Short coherence times compared to trapped-ion but compensated by fast gates.',
    scalingChallenges:
      'Crosstalk between qubits, frequency crowding as chip size grows, dilution refrigerator cooling capacity, wiring density, fabrication yield.',
    advantages: [
      'Fast gate operations (nanosecond timescales)',
      'Mature semiconductor-compatible fabrication',
      'Strong industry ecosystem (IBM, Google, Rigetti)',
      'Mid-circuit measurement capability',
      'Integration with classical electronics feasible',
    ],
    leadingCompanies: ['IBM', 'Google', 'Rigetti', 'IQM', 'Oxford Quantum Circuits'],
    description:
      'Superconducting qubits are the most widely deployed quantum computing platform. Artificial atoms are constructed from superconducting circuits cooled to millikelvin temperatures, where quantum effects dominate. The transmon qubit—a charge-insensitive variant—is the dominant design. IBM, Google, and Rigetti lead commercial deployment; IBM Quantum offers cloud access to dozens of processors.',
  },
  {
    id: 'trapped-ion',
    slug: 'trapped-ion',
    name: 'Trapped Ion',
    qubitMedium: 'Individual atomic ions (Ytterbium-171, Barium-137) suspended in electromagnetic traps',
    controlMechanism: 'Laser beams or microwave fields to manipulate hyperfine or optical qubit transitions',
    operatingEnvironment: 'Ultra-high vacuum (~10⁻¹¹ torr); room-temperature or cryogenic trap housing',
    gateSpeed: 'Single-qubit gates: ~1–10 µs; two-qubit gates: ~100 µs–1 ms (significantly slower than superconducting)',
    connectivity:
      'Natively all-to-all within a trap chain; modular architectures use photonic links between chains',
    coherenceNotes:
      'T1 and T2 coherence times measured in seconds to minutes — orders of magnitude longer than superconducting qubits. Error rates are consistently the lowest across all commercial platforms.',
    scalingChallenges:
      'Slow gate speeds limit circuit depth per unit time; heating as ion chains grow longer; photonic interconnects between modules still in development; no demonstrated path to millions of physical qubits.',
    advantages: [
      'Highest two-qubit gate fidelities (~99.9%+)',
      'All-to-all connectivity eliminates SWAP overhead',
      'Long coherence times (seconds to minutes)',
      'Identical qubits — no frequency crowding',
      'Demonstrated error correction primitives',
    ],
    leadingCompanies: ['IonQ', 'Quantinuum', 'Oxford Ionics', 'Universal Quantum'],
    description:
      'Trapped-ion quantum computers confine individual charged atoms in electromagnetic fields and use laser or microwave pulses to perform quantum operations. Ions serve as near-perfect qubits: they are identical by nature, have extremely long coherence times, and offer native all-to-all connectivity within a trap. IonQ and Quantinuum lead commercial deployment. The primary limitation is gate speed — trapped-ion gates are 10–100× slower than superconducting gates.',
  },
  {
    id: 'neutral-atom',
    slug: 'neutral-atom',
    name: 'Neutral Atom',
    qubitMedium: 'Arrays of neutral atoms (Rubidium-87, Caesium-133) trapped by optical tweezers',
    controlMechanism: 'Laser pulses driving transitions to highly excited Rydberg states; optical tweezer reconfiguration',
    operatingEnvironment: 'Vacuum chamber; atoms cooled to ~µK temperatures via laser cooling (no dilution refrigerator needed)',
    gateSpeed: 'Single-qubit gates: ~100 ns–1 µs; two-qubit (Rydberg) gates: ~1–10 µs',
    connectivity:
      'Reconfigurable — atoms can be physically moved by tweezers to create arbitrary connectivity; all-to-all possible within interaction range',
    coherenceNotes:
      'Coherence times in hyperfine states: seconds. Rydberg state lifetimes limit gate fidelity; T2* for qubit register: typically milliseconds.',
    scalingChallenges:
      'Atom loss during computation (stochastic), limited optical access at very large scales, Rydberg blockade range constrains two-qubit gate radius, loading efficiency.',
    advantages: [
      'Reconfigurable qubit connectivity via tweezer repositioning',
      'Large arrays demonstrated (100–1000+ atoms)',
      'Relatively low infrastructure cost (no dilution fridge)',
      'Analog quantum simulation naturally suited to 2D/3D geometries',
      'Mid-circuit operations and erasure error detection demonstrated',
    ],
    leadingCompanies: ['QuEra Computing', 'PASQAL', 'Atom Computing', 'Infleqtion'],
    description:
      'Neutral-atom quantum computers trap thousands of individual atoms using focused laser beams (optical tweezers) and perform gates by exciting atoms to high-energy Rydberg states. When two atoms both enter the Rydberg state, the strong dipole-dipole interaction creates a controlled phase gate — the "Rydberg blockade." The tweezer array is software-reconfigurable, allowing arbitrary connectivity patterns. QuEra\'s Aquila (256 atoms) and PASQAL\'s Fresnel (100 atoms) are currently accessible via cloud.',
  },
  {
    id: 'photonic',
    slug: 'photonic',
    name: 'Photonic',
    qubitMedium: 'Photons (single photons or squeezed light) in optical waveguides or free-space paths',
    controlMechanism: 'Beam splitters, phase shifters, optical delays, photon-number-resolving detectors',
    operatingEnvironment: 'Room temperature (for many linear optic schemes); superconducting detectors require cryogenic cooling',
    gateSpeed: 'Photons travel at ~c; operations limited by optical path length and detector timing (~ns)',
    connectivity:
      'Reconfigurable via integrated photonic switching networks; non-deterministic two-qubit gates are a fundamental challenge',
    coherenceNotes:
      'Photons do not naturally decohere (no thermal noise), but photon loss and detector inefficiency are the dominant error sources.',
    scalingChallenges:
      'Probabilistic two-qubit gates require resource overhead; photon loss in waveguides; high-efficiency single-photon sources needed; integration of millions of components on chip.',
    advantages: [
      'Room-temperature operation for many schemes',
      'Natural compatibility with optical fiber networks (quantum communication)',
      'No decoherence from thermal environment',
      'Potential for chip-scale integration via silicon photonics',
      'Networked architectures and quantum repeaters',
    ],
    leadingCompanies: ['PsiQuantum', 'Xanadu', 'QuiX Quantum', 'Nu Quantum'],
    description:
      'Photonic quantum computers use individual photons as qubits, encoding quantum information in polarization, time-bin, or other degrees of freedom. Linear optical quantum computing (LOQC) uses beam splitters and single-photon detectors; measurement-based schemes use cluster states of entangled photons. Gaussian boson sampling machines from Xanadu demonstrated quantum advantage claims. PsiQuantum targets fault-tolerant photonic computing using silicon photonics manufacturing. No large-scale photonic gate-based system is yet commercially available.',
  },
  {
    id: 'quantum-annealing',
    slug: 'quantum-annealing',
    name: 'Quantum Annealing',
    qubitMedium: 'Superconducting flux qubits coupled via programmable Josephson junction couplers',
    controlMechanism: 'Slowly varying magnetic flux to implement transverse field Ising Hamiltonian; non-universal',
    operatingEnvironment: '~15 millikelvin — dilution refrigerator required',
    gateSpeed: 'Annealing schedule: typically 1–2000 µs; not gate-based',
    connectivity:
      'Sparse, fixed graph topology: Pegasus graph (~15-way connectivity) for Advantage, Zephyr (~20-way) for Advantage2',
    coherenceNotes:
      'Annealers operate in a mixed quantum-classical regime. Coherence during the anneal is milliseconds but the approach relies on quantum tunneling rather than maintaining superposition throughout.',
    scalingChallenges:
      'Non-universal computation limits problem types to quadratic unconstrained binary optimization (QUBO/Ising); problem embedding on sparse graphs reduces effective qubit count; unclear quantum speedup for practical problems.',
    advantages: [
      'Largest physical qubit counts of any commercial system (5000–7000+)',
      'Proven commercial applications in optimization',
      'Simple programming model for QUBO/Ising problems',
      'Mature cloud platform with real enterprise customers',
      'Hybrid classical-quantum solvers well-developed',
    ],
    leadingCompanies: ['D-Wave Systems'],
    description:
      'Quantum annealers solve optimization problems by mapping them onto a physical Ising Hamiltonian and slowly evolving the system from a quantum superposition ground state toward the problem solution. D-Wave Systems is the dominant commercial player, with systems deployed at Los Alamos National Laboratory, Volkswagen, and hundreds of enterprise customers. While not universal quantum computers, annealers excel at combinatorial optimization and sampling tasks through Ocean SDK\'s hybrid classical-quantum solvers.',
  },
  {
    id: 'topological',
    slug: 'topological',
    name: 'Topological',
    qubitMedium: 'Non-Abelian anyons — specifically Majorana zero modes at semiconductor-superconductor interfaces',
    controlMechanism: 'Braiding of Majorana modes; topological charge manipulation',
    operatingEnvironment: '~100 millikelvin — dilution refrigerator required',
    gateSpeed: 'Gate speeds not yet characterized at scale; braiding operations are theoretically slow',
    connectivity: 'Architecture-dependent; not yet demonstrated at scale',
    coherenceNotes:
      'Topological qubits are theoretically immune to local perturbations due to non-local encoding of quantum information. This intrinsic error protection is the primary motivation; experimental coherence times not yet published.',
    scalingChallenges:
      'Majorana zero modes have proven extremely difficult to reliably create and verify. No scalable topological qubit has been demonstrated. Microsoft announced initial Majorana 1 chip progress in 2025 but gate-based computing remains years away.',
    advantages: [
      'Theoretical intrinsic fault tolerance from topological protection',
      'Potentially lower overhead for error correction',
      'Could dramatically reduce the physical-to-logical qubit ratio',
      'Long-term scalability advantage if demonstrated',
    ],
    leadingCompanies: ['Microsoft Azure Quantum'],
    description:
      'Topological quantum computing aims to encode qubits in non-local degrees of freedom of exotic quasiparticles called non-Abelian anyons (specifically Majorana fermions). Because the quantum information is stored non-locally, local noise sources cannot easily corrupt it — making topological qubits intrinsically more robust than physical qubits in other architectures. Microsoft has pursued this approach for over a decade. As of 2025, they reported early experimental signatures of Majorana-based qubits in their Majorana 1 chip, but a working topological quantum computer remains in the research phase.',
  },
]
