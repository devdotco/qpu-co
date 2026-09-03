import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { GlossaryClient } from '@/components/glossary/GlossaryClient'
import type { GlossaryTerm } from '@/components/glossary/GlossaryClient'

export const metadata: Metadata = {
  title: 'Quantum Computing Glossary',
  description:
    'Definitions of key quantum computing terms: qubit, entanglement, superposition, quantum gate, coherence, quantum volume, error correction, and more.',
  keywords: [
    'quantum computing glossary',
    'quantum terms',
    'qubit definition',
    'quantum gate explained',
    'NISQ definition',
    'quantum volume',
  ],
}

// ─── Glossary term data ───────────────────────────────────────────────────────
// ~38 technically accurate definitions

const GLOSSARY_TERMS: GlossaryTerm[] = [
  // A
  {
    letter: 'A',
    term: 'Algorithm (quantum)',
    definition:
      'A finite sequence of quantum gate operations designed to transform an input quantum state into an output state that encodes the answer to a computational problem with high probability. Quantum algorithms exploit superposition and interference to explore computational paths. Examples: Shor\'s algorithm (factoring), Grover\'s algorithm (unstructured search), VQE (quantum chemistry).',
    seeAlso: ['Quantum circuit', 'Gate (quantum)', 'Superposition'],
  },
  {
    letter: 'A',
    term: 'Amplitude',
    definition:
      'A complex number α associated with a quantum state in superposition. When a qubit is in state α|0⟩ + β|1⟩, |α|² is the probability of measuring 0 and |β|² the probability of measuring 1, with the normalization constraint |α|² + |β|² = 1. Quantum gates operate by rotating these amplitudes. Interference between amplitudes is the mechanism by which quantum algorithms suppress wrong answers.',
    seeAlso: ['Superposition', 'Measurement (quantum)', 'Interference'],
  },
  {
    letter: 'A',
    term: 'Ancilla qubit',
    definition:
      'An auxiliary qubit used to assist a quantum computation without encoding primary information. Ancilla qubits play a critical role in quantum error correction (syndrome measurement), oracle implementations, and arithmetic operations in quantum circuits. After use, ancilla qubits are typically reset to |0⟩ via measurement and reuse.',
    seeAlso: ['Quantum error correction', 'Qubit'],
  },
  {
    letter: 'A',
    term: 'Annealing (quantum)',
    definition:
      'A paradigm of quantum computation distinct from gate-based QPUs. Quantum annealers (e.g., D-Wave) use quantum fluctuations (tunneling) to find the global minimum of an energy landscape encoded as an Ising model or QUBO problem. The system is initialized in a superposition and slowly evolved (annealed) to a low-energy state. Useful for combinatorial optimization but limited in programmability compared to gate-based systems.',
    seeAlso: ['Gate-based QPU', 'NISQ', 'Quantum circuit'],
  },

  // B
  {
    letter: 'B',
    term: 'Bell state',
    definition:
      'One of the four maximally entangled two-qubit states: |Φ⁺⟩ = (|00⟩ + |11⟩)/√2, |Φ⁻⟩ = (|00⟩ − |11⟩)/√2, |Ψ⁺⟩ = (|01⟩ + |10⟩)/√2, |Ψ⁻⟩ = (|01⟩ − |10⟩)/√2. Bell states are the maximally entangled states of two qubits and are the basis for quantum teleportation, superdense coding, and entanglement-based cryptography. Created by applying a Hadamard gate followed by a CNOT gate.',
    seeAlso: ['Entanglement', 'Hadamard gate', 'Qubit'],
  },
  {
    letter: 'B',
    term: 'Bloch sphere',
    definition:
      'A geometric representation of a single qubit state as a point on (or inside) the unit sphere in three-dimensional space. Pure states lie on the surface; mixed states lie inside. The north and south poles represent |0⟩ and |1⟩ respectively. Quantum gates correspond to rotations of the state vector on the Bloch sphere. The Bloch sphere is a useful visualization tool but does not extend naturally to multi-qubit systems.',
    seeAlso: ['Qubit', 'Gate (quantum)', 'Superposition'],
  },
  {
    letter: 'B',
    term: 'Bra-ket notation',
    definition:
      'Dirac notation for quantum states. A ket |ψ⟩ represents a quantum state vector; a bra ⟨ψ| is its conjugate transpose. Inner products ⟨φ|ψ⟩ represent probability amplitudes; outer products |ψ⟩⟨φ| represent operators. The notation is standard in quantum mechanics and quantum computing literature. Example: a qubit in superposition is written α|0⟩ + β|1⟩.',
    seeAlso: ['Amplitude', 'Qubit', 'Superposition'],
  },

  // C
  {
    letter: 'C',
    term: 'CLOPS (Circuit Layer Operations Per Second)',
    definition:
      'A QPU throughput benchmark introduced by IBM in 2021. CLOPS measures how many quantum volume circuits a system can execute per second, capturing both gate speed and classical control overhead (compilation, communication, reset). A higher CLOPS indicates faster practical throughput for variational algorithms. Complementary to Quantum Volume, which measures capability per circuit; CLOPS measures speed of execution.',
    seeAlso: ['Quantum volume', 'Quantum circuit', 'Benchmarks'],
  },
  {
    letter: 'C',
    term: 'Coherence',
    definition:
      'The property of a qubit that allows it to maintain a well-defined quantum state (superposition or entanglement) over time. Coherence is destroyed by interaction with the environment through a process called decoherence. T1 (energy relaxation time) and T2 (dephasing time) quantify how long a qubit maintains coherence in two distinct ways. Longer coherence times allow deeper circuit execution before errors accumulate.',
    seeAlso: ['T1 (relaxation time)', 'T2 (coherence time)', 'Decoherence'],
  },
  {
    letter: 'C',
    term: 'Connectivity (QPU)',
    definition:
      'The qubit coupling graph of a QPU — which pairs of qubits can directly interact via two-qubit gates. Connectivity strongly affects which quantum circuits can be run efficiently. All-to-all connectivity (trapped-ion systems) allows any two qubits to interact without overhead. Limited connectivity (superconducting grid topologies) requires SWAP gates to route operations between non-adjacent qubits, adding circuit depth and error.',
    seeAlso: ['Gate (quantum)', 'Transpilation', 'Topology'],
  },
  {
    letter: 'C',
    term: 'Control system',
    definition:
      'The classical electronics and software responsible for generating, timing, and measuring the signals that implement quantum gates on physical qubits. For superconducting QPUs, this includes microwave pulse generators, arbitrary waveform generators (AWGs), and digitizers. For trapped-ion systems, this includes laser systems and RF electronics. Control system latency and bandwidth are key factors in achievable gate speed and mid-circuit measurement.',
    seeAlso: ['Gate (quantum)', 'Readout', 'Measurement (quantum)'],
  },

  // D
  {
    letter: 'D',
    term: 'Decoherence',
    definition:
      'The process by which a qubit loses its quantum properties (superposition, entanglement) through unintended interaction with its environment. Decoherence converts quantum states into classical statistical mixtures, destroying quantum information. The primary challenge in building quantum computers — reducing decoherence is necessary to execute deep circuits. Characterized by T1 and T2 timescales.',
    seeAlso: ['Coherence', 'T1 (relaxation time)', 'T2 (coherence time)', 'Noise'],
  },
  {
    letter: 'D',
    term: 'Depth (circuit)',
    definition:
      'The number of sequential gate layers in a quantum circuit — a measure of how long the circuit takes to execute. Circuit depth is a critical parameter because errors accumulate with depth. A circuit of depth d on a device with per-layer error rate p has an approximate fidelity of (1−p)^d. Noise limits the maximum useful circuit depth on NISQ hardware; current devices support circuits of depth ~100–1,000 before noise dominates.',
    seeAlso: ['Quantum circuit', 'NISQ', 'Gate (quantum)', 'Fidelity (gate)'],
  },

  // E
  {
    letter: 'E',
    term: 'Entanglement',
    definition:
      'A quantum correlation between two or more qubits such that the state of each qubit cannot be described independently of the others. Measuring one entangled qubit instantaneously determines information about its partner, regardless of physical separation. Entanglement is a uniquely quantum resource with no classical analogue and is a key ingredient in quantum algorithms, error correction, and quantum communication. Created by two-qubit gates such as CNOT.',
    seeAlso: ['Bell state', 'Gate (quantum)', 'Superposition'],
  },
  {
    letter: 'E',
    term: 'Error correction (quantum)',
    definition:
      'A technique for protecting quantum information against decoherence and gate errors by encoding logical qubits redundantly across many physical qubits and performing periodic syndrome measurements to detect and correct errors without disturbing the logical state. Leading codes include the surface code and Steane code. Requires many physical qubits per logical qubit (hundreds to thousands for fault tolerance). Distinct from error mitigation.',
    seeAlso: ['Logical qubit', 'Physical qubit', 'Syndrome measurement', 'Fidelity (gate)'],
  },
  {
    letter: 'E',
    term: 'Error mitigation',
    definition:
      'A family of techniques for reducing the effect of errors on NISQ device outputs without full quantum error correction. Examples include: zero-noise extrapolation (run circuits at multiple noise levels and extrapolate to zero), probabilistic error cancellation (statistical inversion of error channels), and measurement error mitigation (post-processing based on a measured calibration matrix). Error mitigation increases effective circuit quality but has overhead in shot count and does not scale to fault tolerance.',
    seeAlso: ['NISQ', 'Error correction (quantum)', 'Noise'],
  },

  // F
  {
    letter: 'F',
    term: 'Fidelity (gate)',
    definition:
      'A measure of how accurately a quantum gate is implemented, from 0 to 1 (or 0% to 100%). Defined as the overlap between the intended output state and the actual output state, averaged over all input states. Single-qubit gate fidelities on leading hardware typically exceed 99.9%; two-qubit gate fidelities range from ~98% to 99.9% depending on platform and qubit pair. Gate fidelity determines maximum achievable circuit depth.',
    seeAlso: ['Gate (quantum)', 'Fidelity (readout)', 'Depth (circuit)'],
  },
  {
    letter: 'F',
    term: 'Fidelity (readout)',
    definition:
      'The accuracy of measuring a qubit\'s state. Specifically, the probability that measuring a qubit prepared in |0⟩ returns 0 (and similarly for |1⟩). Readout fidelity is distinct from gate fidelity — a qubit may have excellent gate fidelity but poor readout fidelity due to photon scattering, amplifier noise, or short T1 during the measurement window. Readout errors can be partially compensated via calibration matrices.',
    seeAlso: ['Fidelity (gate)', 'Measurement (quantum)', 'Readout'],
  },

  // G
  {
    letter: 'G',
    term: 'Gate (quantum)',
    definition:
      'A basic operation applied to one or more qubits in a quantum circuit. Quantum gates are reversible unitary operations — they rotate the qubit state without destroying quantum information. Common single-qubit gates: X (bit flip), Z (phase flip), H (Hadamard, creates superposition), T (π/8 phase). Common two-qubit gates: CNOT (controlled-NOT), CZ (controlled-phase), ECR (IBM native gate), Mølmer-Sørensen (IonQ native gate). Each hardware platform implements a native gate set; other gates require decomposition.',
    seeAlso: ['Hadamard gate', 'Fidelity (gate)', 'Transpilation', 'Quantum circuit'],
  },
  {
    letter: 'G',
    term: 'Gate-based QPU',
    definition:
      'A quantum processor that performs computation by applying discrete quantum gate operations to qubits, analogous to how classical logic gates process bits. Gate-based QPUs are universal (can implement any quantum algorithm) given sufficient qubits and gate fidelity. Contrasted with quantum annealers (analog, non-gate) and analog quantum simulators. Leading gate-based platforms: IBM (superconducting), IonQ (trapped-ion), Quantinuum (trapped-ion), Rigetti (superconducting).',
    seeAlso: ['Gate (quantum)', 'Annealing (quantum)', 'Quantum circuit'],
  },
  {
    letter: 'G',
    term: 'Grover\'s algorithm',
    definition:
      'A quantum algorithm for searching an unsorted database of N items in O(√N) queries, compared to O(N) classically. This quadratic speedup is provably optimal for quantum unstructured search. Grover\'s algorithm uses amplitude amplification — a general quantum technique that boosts the probability of correct answers. Practically useful for specific computational primitives; does not apply to most structured search problems.',
    seeAlso: ['Algorithm (quantum)', 'Amplitude', 'Superposition'],
  },

  // H
  {
    letter: 'H',
    term: 'Hamiltonian',
    definition:
      'The operator representing the total energy of a quantum system. In quantum computing, Hamiltonians are central to quantum simulation algorithms (VQE, Trotterization) and adiabatic quantum computing. For a molecule, the electronic Hamiltonian encodes how electrons interact — finding its ground state energy is a key quantum chemistry application. Hamiltonians are expressed as sums of Pauli operators in quantum computing contexts.',
    seeAlso: ['VQE (Variational Quantum Eigensolver)', 'Annealing (quantum)'],
  },
  {
    letter: 'H',
    term: 'Hadamard gate',
    definition:
      'A single-qubit quantum gate that creates a balanced superposition from a basis state: H|0⟩ = (|0⟩ + |1⟩)/√2, H|1⟩ = (|0⟩ − |1⟩)/√2. The Hadamard gate is one of the most fundamental and frequently used quantum gates — it is the starting point for most quantum algorithms that exploit superposition. It corresponds to a 90° rotation on the Bloch sphere about the Y axis followed by a 180° rotation about the X axis.',
    seeAlso: ['Gate (quantum)', 'Superposition', 'Bloch sphere'],
  },

  // L
  {
    letter: 'L',
    term: 'Logical qubit',
    definition:
      'An error-corrected qubit formed by encoding quantum information redundantly across many physical qubits using a quantum error correction code. A logical qubit has a far lower error rate than the underlying physical qubits when the physical error rate is below the error correction threshold. Fault-tolerant quantum computers require many logical qubits; each may require hundreds to thousands of physical qubits depending on the code. Achieving useful logical qubit counts is the central challenge of the FTQC era.',
    seeAlso: ['Physical qubit', 'Error correction (quantum)', 'Logical error rate'],
  },

  // M
  {
    letter: 'M',
    term: 'Measurement (quantum)',
    definition:
      'The process of extracting classical information from a qubit. Measuring a qubit in state α|0⟩ + β|1⟩ yields 0 with probability |α|² and 1 with probability |β|², and collapses the qubit to the measured state, destroying superposition. Because measurement is probabilistic, quantum circuits must be executed many times (shots) to gather statistics. Mid-circuit measurement (measuring during a circuit) enables quantum error correction and adaptive algorithms.',
    seeAlso: ['Superposition', 'Shot', 'Readout', 'Fidelity (readout)'],
  },

  // N
  {
    letter: 'N',
    term: 'NISQ (Noisy Intermediate-Scale Quantum)',
    definition:
      'A term coined by John Preskill in 2018 to describe quantum devices with 50–1,000 qubits that operate without error correction, making them noisy and limited in circuit depth. NISQ devices are too large to be classically simulated exactly but too noisy for fault-tolerant algorithms. NISQ-era algorithms (VQE, QAOA, quantum machine learning) are designed to extract useful results despite noise. The NISQ era will end when error correction produces logical qubits that enable fault-tolerant computation.',
    seeAlso: ['Error correction (quantum)', 'VQE (Variational Quantum Eigensolver)', 'QAOA', 'Noise'],
  },
  {
    letter: 'N',
    term: 'Noise',
    definition:
      'Unwanted perturbations that corrupt qubit states and gate operations in a quantum processor. Sources of noise include: thermal fluctuations, electromagnetic interference, control electronics imperfections, and cosmic radiation. Noise manifests as gate errors, decoherence, and readout errors. Characterizing, modeling, and mitigating noise is the central engineering challenge of quantum hardware. Error mitigation techniques reduce noise effects; error correction eliminates them (with overhead).',
    seeAlso: ['Decoherence', 'NISQ', 'Error mitigation', 'Error correction (quantum)'],
  },

  // P
  {
    letter: 'P',
    term: 'Physical qubit',
    definition:
      'The actual physical implementation of a two-level quantum system used as a qubit — a superconducting transmon circuit, a trapped ytterbium ion, a neutral cesium atom in an optical tweezer, etc. Physical qubits are inherently noisy; their error rates determine how many are needed to form a logical qubit. The physical qubit count reported by manufacturers (e.g., "1,121 qubits") refers to physical qubits — the practical computational power depends on error rates, connectivity, and circuit depth.',
    seeAlso: ['Logical qubit', 'Error correction (quantum)', 'Qubit'],
  },

  // Q
  {
    letter: 'Q',
    term: 'QAOA (Quantum Approximate Optimization Algorithm)',
    definition:
      'A hybrid quantum-classical algorithm for combinatorial optimization, proposed by Farhi, Goldstone, and Gutmann in 2014. A parameterized quantum circuit alternates between cost and mixer Hamiltonians; a classical optimizer adjusts the parameters to maximize the expected cost function. QAOA is the most studied NISQ optimization algorithm. Its advantage over classical heuristics on practical problem sizes remains an open research question — current benchmarks are mixed.',
    seeAlso: ['VQE (Variational Quantum Eigensolver)', 'NISQ', 'Hamiltonian'],
  },
  {
    letter: 'Q',
    term: 'QPU',
    definition:
      'Quantum Processing Unit. A specialized processor that performs quantum computation by manipulating qubits according to quantum mechanical principles — superposition, entanglement, and interference. QPUs are not general-purpose processors; they are specialized accelerators for quantum-native algorithms. See the full guide: What Is a QPU?',
    seeAlso: ['Qubit', 'Gate-based QPU', 'NISQ'],
  },
  {
    letter: 'Q',
    term: 'Quantum advantage',
    definition:
      'The demonstration that a quantum computer solves a specific problem faster, more accurately, or more efficiently than any classical computer, accounting for the best known classical algorithms and hardware. "Quantum supremacy" is a related term (used for narrow, sampling-based demonstrations). Achieving quantum advantage for practically important problems — not just synthetic benchmark circuits — is the primary near-term goal of the field.',
    seeAlso: ['NISQ', 'Algorithm (quantum)', 'Quantum supremacy'],
  },
  {
    letter: 'Q',
    term: 'Quantum circuit',
    definition:
      'A model for quantum computation: a sequence of quantum gate operations applied to a set of initialized qubits, followed by measurement. Quantum circuits are the primary abstraction for programming gate-based QPUs. Circuit depth (number of sequential gate layers) and circuit width (number of qubits) determine resource requirements. Circuits are compiled (transpiled) from high-level descriptions into the native gate set of the target hardware.',
    seeAlso: ['Gate (quantum)', 'Transpilation', 'Depth (circuit)'],
  },
  {
    letter: 'Q',
    term: 'Quantum error correction',
    definition:
      'See Error correction (quantum).',
    seeAlso: ['Error correction (quantum)', 'Logical qubit', 'Physical qubit'],
  },
  {
    letter: 'Q',
    term: 'Quantum supremacy',
    definition:
      'The demonstration that a quantum processor performs a specific task faster than any classical computer. Google claimed quantum supremacy in 2019 with its Sycamore processor on random circuit sampling. The claim was disputed on grounds that improved classical algorithms could match or exceed Sycamore\'s performance. "Quantum advantage" is now preferred as the broader, more practically relevant term.',
    seeAlso: ['Quantum advantage', 'NISQ'],
  },
  {
    letter: 'Q',
    term: 'Quantum volume',
    definition:
      'A hardware-agnostic QPU performance benchmark developed by IBM, defined as 2^n where n is the largest square circuit width and depth that the device can implement with at least 2/3 heavy output fidelity. Quantum volume combines qubit count, gate fidelity, connectivity, and crosstalk into a single number. Higher Quantum Volume indicates a more capable device. It is most useful for comparing devices from the same manufacturer over time.',
    seeAlso: ['CLOPS', 'Fidelity (gate)', 'Connectivity (QPU)'],
  },
  {
    letter: 'Q',
    term: 'Qubit',
    definition:
      'The fundamental unit of quantum information. A qubit is a quantum two-level system — physically realized as a superconducting circuit, trapped ion, neutral atom, photon, spin, or other controllable quantum object. Unlike a classical bit (strictly 0 or 1), a qubit can exist in a superposition α|0⟩ + β|1⟩, where α and β are complex amplitudes. Upon measurement, a qubit collapses to 0 or 1 with probabilities |α|² and |β|² respectively.',
    seeAlso: ['Superposition', 'Measurement (quantum)', 'Physical qubit', 'Logical qubit'],
  },

  // R
  {
    letter: 'R',
    term: 'Readout',
    definition:
      'The process of measuring the final state of qubits at the end of a quantum circuit. For superconducting qubits, readout typically involves coupling the qubit to a resonator and measuring microwave transmission. Readout is a significant source of errors — readout fidelity is often lower than gate fidelity. Active reset (measurement followed by conditional flip) can prepare qubits for the next circuit shot without waiting for thermal relaxation.',
    seeAlso: ['Measurement (quantum)', 'Fidelity (readout)', 'Shot'],
  },

  // S
  {
    letter: 'S',
    term: 'Shot',
    definition:
      'One single execution of a quantum circuit, resulting in a measurement outcome bit string. Because quantum measurement is probabilistic, a quantum circuit must be executed many times (typically 100 to 100,000 shots) to build a statistical distribution of outputs. The number of shots required depends on the desired precision and the algorithm. Shot overhead is a significant factor in NISQ algorithm runtime — more shots means more time on a cloud QPU.',
    seeAlso: ['Measurement (quantum)', 'Quantum circuit', 'Readout'],
  },
  {
    letter: 'S',
    term: 'Superposition',
    definition:
      'The quantum mechanical property allowing a qubit to exist in a combination of |0⟩ and |1⟩ simultaneously: α|0⟩ + β|1⟩, where α and β are complex amplitudes. Superposition is not the same as "being both 0 and 1" — upon measurement, the qubit yields a definite classical value. Superposition enables quantum algorithms to process exponentially many computational paths simultaneously via interference. It is created by applying the Hadamard gate or other single-qubit rotations.',
    seeAlso: ['Amplitude', 'Hadamard gate', 'Entanglement', 'Measurement (quantum)'],
  },

  // T
  {
    letter: 'T',
    term: 'T1 (relaxation time)',
    definition:
      'The characteristic time for a qubit to spontaneously decay from its excited state |1⟩ to its ground state |0⟩, releasing energy to the environment. T1 is an exponential decay time constant: after time T1, the qubit has approximately a 63% probability of having relaxed. T1 limits how long computations can run. Superconducting qubit T1 values range from ~100 µs to ~1 ms on leading devices; trapped-ion qubits have T1 of seconds to hours.',
    seeAlso: ['T2 (coherence time)', 'Decoherence', 'Coherence'],
  },
  {
    letter: 'T',
    term: 'T2 (coherence time)',
    definition:
      'The characteristic time for a qubit to lose phase coherence — the ability to maintain a well-defined superposition — due to dephasing processes (random phase kicks from the environment). T2 ≤ 2T1 always holds; in practice T2 is often much shorter than 2T1. T2 directly limits the circuit depth for algorithms that rely on coherent superposition. T2* (T2-star) is a related quantity that includes inhomogeneous dephasing effects.',
    seeAlso: ['T1 (relaxation time)', 'Decoherence', 'Coherence'],
  },
  {
    letter: 'T',
    term: 'Topological qubit',
    definition:
      'A type of qubit encoded in non-Abelian anyons — exotic quasiparticles whose quantum state is stored non-locally in the topology of the system rather than in a local physical degree of freedom. Topological qubits are theorized to be inherently protected from local noise, potentially enabling error correction with much lower overhead. Microsoft is pursuing topological qubits via Majorana fermions in superconductor-semiconductor heterostructures. As of 2026, topological qubits remain in the research phase.',
    seeAlso: ['Logical qubit', 'Error correction (quantum)', 'Physical qubit'],
  },
  {
    letter: 'T',
    term: 'Transpilation',
    definition:
      'The process of converting a quantum circuit written in a high-level gate set into the native gate set and qubit connectivity of a target QPU. Transpilation involves: decomposing abstract gates into native gates, routing qubit operations across the device connectivity (adding SWAP gates where needed), and optimizing the resulting circuit to minimize depth and gate count. Transpilation quality significantly affects circuit performance — poor transpilation can double circuit depth and error rates.',
    seeAlso: ['Quantum circuit', 'Connectivity (QPU)', 'Gate (quantum)'],
  },

  // V
  {
    letter: 'V',
    term: 'VQE (Variational Quantum Eigensolver)',
    definition:
      'A hybrid quantum-classical algorithm for finding the ground state energy of a quantum system (typically a molecule). A parameterized quantum circuit (ansatz) is prepared on the QPU; the expected value of the Hamiltonian is measured. A classical optimizer adjusts the circuit parameters to minimize this energy. VQE is the most studied NISQ algorithm for quantum chemistry. Its practical advantage over classical chemistry methods (CCSD(T), FCI) at useful problem scales remains an active research question.',
    seeAlso: ['QAOA', 'Hamiltonian', 'NISQ'],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      {/* Top bar */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-raised)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb
            items={[
              { label: 'QPU.co', href: '/' },
              { label: 'Learn', href: '/learn' },
              { label: 'Glossary' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-10">
          <p className="eyebrow mb-3">Reference</p>
          <h1 className="text-[var(--color-text-primary)] mb-3">
            Quantum Computing Glossary
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed max-w-none">
            Technical definitions for quantum computing terms — from qubit fundamentals
            to hardware metrics and algorithm names. Accurate definitions, not marketing copy.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">
            {GLOSSARY_TERMS.length} terms · Alphabetical · Search below
          </p>
        </header>

        {/* Client-side search + alpha nav + terms */}
        <GlossaryClient terms={GLOSSARY_TERMS} />

        {/* Footer nav */}
        <div className="mt-12 pt-6 border-t border-[var(--color-border)] flex gap-4 flex-wrap">
          <Link
            href="/learn"
            className="text-sm font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            ← Back to Learn
          </Link>
          <Link
            href="/what-is-a-qpu"
            className="text-sm font-mono text-[var(--color-accent)] hover:opacity-80 transition-opacity"
          >
            What Is a QPU? →
          </Link>
        </div>
      </div>
    </div>
  )
}
