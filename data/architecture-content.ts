/**
 * Extended editorial content for each architecture detail page.
 * Technical claims are written at a level of abstraction commensurate with
 * published research and manufacturer documentation as of early 2026.
 */

export interface ArchitectureFAQ {
  question: string
  answer: string
}

export interface ArchitectureSource {
  title: string
  publisher: string
  url: string
  year: number
}

export interface ArchitectureContent {
  slug: string
  paradigmLabel: string
  /** 2–3 paragraphs explaining the physical mechanism */
  howItWorks: string[]
  /** Structured implementation detail */
  physicalImplementation: {
    qubitMedium: string
    controlMechanism: string
    operatingEnvironment: string
    readoutMechanism: string
  }
  /** Connectivity inline description */
  connectivityDetail: string
  /** Native gate set description */
  nativeGates: string
  /** Accurate advantage bullets */
  advantages: string[]
  /** Accurate limitation bullets */
  limitations: string[]
  /** 1 paragraph on scaling path */
  scalingNotes: string
  /** Workload suitability notes */
  workloadNotes: {
    suited: string[]
    lesssuited: string[]
  }
  faqs: ArchitectureFAQ[]
  sources: ArchitectureSource[]
}

export const architectureContent: Record<string, ArchitectureContent> = {
  superconducting: {
    slug: 'superconducting',
    paradigmLabel: 'GATE-BASED · DIGITAL',
    howItWorks: [
      'Superconducting qubits are artificial atoms built from electrical circuits. At the heart of each qubit is a Josephson junction — a thin insulating barrier sandwiched between two superconducting electrodes. When cooled to millikelvin temperatures, quantum mechanical tunneling through the junction creates a nonlinear inductance that discretizes the circuit\'s energy levels. The lowest two levels are used as the qubit\'s |0⟩ and |1⟩ states. The transmon variant, which suppresses charge noise by operating at high Josephson-to-charging energy ratios, is now the dominant design across IBM, Google, and Rigetti systems.',
      'Quantum gates are implemented by applying precisely shaped microwave pulses through coaxial lines connected to each qubit\'s control port. Single-qubit gates rotate the qubit\'s state vector on the Bloch sphere; two-qubit gates like the CNOT or CZ gate are implemented by temporarily coupling neighboring qubits through a tunable coupler or cross-resonance interaction. Readout is accomplished by coupling each qubit to a dedicated readout resonator: the qubit\'s state shifts the resonator\'s frequency, which is detected by a heterodyne measurement chain at room temperature.',
      'Fabrication uses standard semiconductor techniques — electron beam lithography and shadow evaporation — to deposit aluminum or niobium thin films on silicon or sapphire substrates. This compatibility with existing semiconductor manufacturing infrastructure is a significant advantage for scaling, though it also means qubit frequencies must be carefully engineered to avoid spectator modes and crosstalk.',
    ],
    physicalImplementation: {
      qubitMedium: 'Josephson junction-based superconducting circuits; primarily transmon qubits (Al or Nb on Si/sapphire substrate)',
      controlMechanism: 'Shaped microwave pulses delivered via coaxial lines; two-qubit gates via tunable couplers or cross-resonance drives',
      operatingEnvironment: '~10–20 millikelvin in a dilution refrigerator; room-temperature control electronics coupled through attenuated coaxial chains and circulators',
      readoutMechanism: 'Dispersive readout via coupled microwave resonator; frequency-shift measured by heterodyne detection; multiplexed readout of multiple qubits on shared feedline',
    },
    connectivityDetail: 'Fixed, nearest-neighbor topology defined at fabrication time. IBM uses the heavy-hex lattice (each qubit connected to 2–3 neighbors); Google uses a square lattice. Long-range connectivity requires SWAP networks with significant gate overhead. No reconfiguration is possible during runtime.',
    nativeGates: 'Single-qubit: arbitrary SU(2) rotation via Euler decomposition (Rx, Ry, Rz, X, Y, Z, H). Two-qubit: CX (CNOT), CZ, ECR (echoed cross-resonance), or iSWAP depending on architecture. Virtual Z gates are implemented as phase offsets at zero cost.',
    advantages: [
      'Fast gate operations — single-qubit gates in 10–50 ns, two-qubit gates in 40–500 ns — enabling high circuit throughput',
      'Mature, semiconductor-compatible fabrication allows rapid iteration and scaling via established industry processes',
      'Mid-circuit measurement and reset enable dynamic circuits and quantum error correction protocols',
      'Largest commercial ecosystem: IBM Quantum, Google Quantum AI, Rigetti, IQM offer cloud access to dozens of processors',
      'Microwave control at GHz frequencies is directly compatible with high-speed classical electronics',
      'Demonstrated quantum error correction with distance-5 and distance-7 surface codes (Google "Willow" 2024)',
    ],
    limitations: [
      'Short coherence times (T1/T2 typically 50–500 µs) limit the number of gates executable before decoherence',
      'Fixed nearest-neighbor connectivity requires SWAP overhead for algorithms expecting all-to-all access',
      'Dilution refrigerators are expensive (~$1–2M), require weeks to cool, and limit qubit count by cooling power and wiring density',
      'Frequency crowding: as qubit count grows, manufacturing identical-frequency qubits becomes increasingly difficult without crosstalk',
      'Two-qubit gate fidelity of 99.0–99.9% still requires significant error correction overhead for fault-tolerant operation',
      'Qubit uniformity varies across chips; not all qubits on a processor perform equally well',
    ],
    scalingNotes: 'IBM\'s roadmap targets modular quantum systems interconnected via high-bandwidth classical links and eventually quantum links. Google pursues increasing chip size with heavy-hex and similar layouts. The primary scaling challenge is maintaining coherence and fidelity as qubit count grows — crosstalk, frequency crowding, and wiring density all worsen. Error correction via surface codes is the most studied path to logical qubits; current estimates suggest ~1,000 physical qubits per logical qubit at surface code distance 25, though this ratio may improve with better fabrication. Google\'s Willow chip (2024) demonstrated below-threshold error correction where adding more qubits improved logical qubit performance — a critical milestone.',
    workloadNotes: {
      suited: [
        'Quantum chemistry (VQE, QSCI) with moderate circuit depth',
        'Variational quantum algorithms (QAOA, VQE) on near-term hardware',
        'Quantum error correction research and demonstration',
        'Machine learning circuits (QNNs, kernel methods)',
        'Randomized benchmarking and hardware characterization',
      ],
      lesssuited: [
        'Algorithms requiring deep circuits or many serial two-qubit gates (decoherence limits)',
        'Problems requiring all-to-all connectivity without SWAP overhead budget',
        'Workloads benefiting from long coherence times between measurements',
      ],
    },
    faqs: [
      {
        question: 'Why must superconducting qubits operate at such extreme cold temperatures?',
        answer: 'Quantum behavior in Josephson junctions requires the thermal energy (k_B × T) to be much smaller than the qubit energy spacing. At millikelvin temperatures, thermal fluctuations cannot excite the qubit from |0⟩ to |1⟩, preserving the quantum state. At room temperature, thermal noise would overwhelm the weak quantum signal in milliseconds.',
      },
      {
        question: 'What is a transmon qubit and why is it dominant?',
        answer: 'A transmon is a type of superconducting qubit that operates in the regime where Josephson energy greatly exceeds charging energy (E_J >> E_C). This makes the qubit\'s transition frequency insensitive to offset charge noise — the dominant decoherence source in earlier Cooper pair box designs. Transmons sacrifice some anharmonicity (making the energy levels more evenly spaced) but gain dramatically improved coherence times.',
      },
      {
        question: 'What is the heavy-hex topology and why does IBM use it?',
        answer: 'The heavy-hex lattice places qubits at the vertices and edge midpoints of a hexagonal grid. Each qubit connects to at most 3 neighbors. This sparse connectivity reduces crosstalk between neighboring qubits (lower ZZ coupling) and makes the layout practical for fabricating long, high-fidelity connections. The reduced connectivity vs. a square lattice is compensated by improved per-gate fidelity.',
      },
      {
        question: 'How close is superconducting quantum computing to fault tolerance?',
        answer: 'Google\'s 2024 Willow experiment (105 physical qubits) demonstrated below-threshold error correction: logical qubit performance improved as code distance increased. This is a critical threshold result. However, running a useful fault-tolerant algorithm likely requires millions of physical qubits and years of engineering work. Current systems remain in the noisy intermediate-scale quantum (NISQ) regime.',
      },
      {
        question: 'Can superconducting qubits be accessed over the cloud?',
        answer: 'Yes — IBM Quantum, Amazon Braket (Rigetti systems), Google (research partners), and IQM all offer cloud access. IBM provides free tier access to smaller systems and paid access to larger processors via IBM Quantum Network partnerships.',
      },
    ],
    sources: [
      { title: 'Quantum supremacy using a programmable superconducting processor', publisher: 'Nature / Google', url: 'https://www.nature.com/articles/s41586-019-1666-5', year: 2019 },
      { title: 'Quantum error correction below the surface code threshold', publisher: 'Nature / Google', url: 'https://www.nature.com/articles/s41586-024-08449-y', year: 2024 },
      { title: 'Circuit quantum electrodynamics', publisher: 'Reviews of Modern Physics', url: 'https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.93.025005', year: 2021 },
      { title: 'IBM Quantum System Two', publisher: 'IBM', url: 'https://www.ibm.com/quantum/systems', year: 2023 },
    ],
  },

  'trapped-ion': {
    slug: 'trapped-ion',
    paradigmLabel: 'GATE-BASED · DIGITAL',
    howItWorks: [
      'Trapped-ion quantum computers use individual atomic ions as qubits. Ions are electrically charged atoms and are confined in electromagnetic traps — most commonly a linear Paul trap, which uses oscillating radiofrequency electric fields to create a pseudopotential well. The ions form a linear crystal held in place by the balance between the trapping potential and their mutual Coulomb repulsion. IonQ uses Ytterbium-171 ions; Quantinuum uses Barium-133 or Ytterbium-171.',
      'Quantum information is encoded in two internal electronic states of each ion, typically hyperfine clock states that are extremely stable against magnetic field fluctuations. These states serve as |0⟩ and |1⟩ with coherence times often exceeding one second — orders of magnitude longer than superconducting qubits. Single-qubit gates are implemented by addressing individual ions with focused laser beams or microwave fields tuned to the qubit transition frequency.',
      'Two-qubit gates exploit the shared motional modes of the ion crystal. When a laser is applied to ion A in a way that imparts momentum, the resulting phonon (vibration) propagates through the crystal and creates a correlated interaction with ion B. The Mølmer–Sørensen gate and related protocols use this phonon bus to generate maximally entangling two-qubit gates between any pair of ions in the chain — providing native all-to-all connectivity within the trap. This is a fundamental advantage over nearest-neighbor architectures.',
    ],
    physicalImplementation: {
      qubitMedium: 'Individual atomic ions (Yb-171 or Ba-137) suspended in linear Paul traps at ultra-high vacuum; hyperfine ground states as qubit states',
      controlMechanism: 'Individually addressed laser pulses or microwave fields for single-qubit gates; Mølmer–Sørensen or similar phonon-mediated interactions for two-qubit gates',
      operatingEnvironment: 'Ultra-high vacuum (~10⁻¹¹ torr); trap housing at room temperature or mild cryogenic temperature (4K for some designs); no dilution refrigerator required',
      readoutMechanism: 'State-dependent fluorescence: a readout laser causes |1⟩-state ions to scatter many photons (bright); |0⟩-state ions remain dark. Detected by CCD cameras or photomultiplier tubes. Readout fidelity exceeds 99.9% in leading systems.',
    },
    connectivityDetail: 'Native all-to-all connectivity within a single ion chain. Any two ions in the trap can be entangled directly via the shared phonon bus without SWAP overhead. This eliminates a major source of gate overhead common in nearest-neighbor architectures. Modular scaling via photonic interconnects between separate chains is in development.',
    nativeGates: 'Single-qubit: arbitrary SU(2) rotation (Rx, Ry, Rz). Two-qubit: Mølmer–Sørensen (XX or MS gate), which is equivalent to an all-to-all maximally entangling operation. Circuit compilers decompose standard gate sets to these native operations. CNOT and CZ are derived from the MS gate.',
    advantages: [
      'Highest published two-qubit gate fidelities of any commercial platform (~99.9%+ for Quantinuum H2)',
      'Native all-to-all connectivity eliminates SWAP overhead; any two qubits can be directly entangled',
      'Long coherence times (T1/T2 of seconds to minutes) enable very deep circuits',
      'Ions are physically identical — no frequency crowding, manufacturing variation, or drift between units',
      'Demonstrated algorithmic qubit (AQ) metrics: IonQ Forte reported 35 AQ, Quantinuum H2 up to 56 AQ',
      'Photon-based quantum networking naturally compatible with ion-photon entanglement protocols',
    ],
    limitations: [
      'Gate speeds are significantly slower than superconducting: two-qubit gates take 100 µs–1 ms vs. ~100 ns for superconducting',
      'Chain length is limited by heating from background electric field noise and mode crowding; current practical limit ~20–50 ions per chain',
      'Scaling to hundreds of chains requires photonic interconnects between modules — a technically challenging unsolved problem',
      'Optical and laser control systems are complex, large, and expensive; miniaturization is an active engineering challenge',
      'Circuit throughput (circuits per second) is substantially lower than superconducting due to slow gates and ion cooling overhead',
      'No commercially demonstrated path to the millions of physical qubits needed for large fault-tolerant computations',
    ],
    scalingNotes: 'The dominant scaling path is modular: multiple short ion chains (10–50 ions each) are connected via photon-mediated quantum links, building up a quantum network of traps. IonQ\'s "Barium" roadmap and Quantinuum\'s multi-zone architectures use this approach. Some designs use integrated photonics to route light to individual ions in a chip-scale trap. The key challenge is generating high-rate, high-fidelity entanglement between distant modules via photonic links. Quantum error correction on trapped-ion platforms has been demonstrated with high-fidelity gates; the challenge is throughput — QEC requires many fast sequential operations.',
    workloadNotes: {
      suited: [
        'Deep quantum chemistry circuits requiring high gate fidelity',
        'Quantum error correction code demonstrations (high fidelity gates reduce overhead)',
        'Algorithms requiring all-to-all connectivity (quantum simulation, portfolio optimization)',
        'Precision metrology and sensing applications',
        'Quantum network node applications leveraging ion-photon entanglement',
      ],
      lesssuited: [
        'High-throughput sampling requiring many circuit executions per second (slow gate speed bottleneck)',
        'Algorithms requiring millions of physical qubits in the near term',
        'Applications where classical simulation speed is the constraint rather than qubit count',
      ],
    },
    faqs: [
      {
        question: 'How do laser beams entangle ions that are micrometers apart?',
        answer: 'Ions in a trap share collective vibrational modes (phonons). A laser tuned slightly off resonance from the qubit transition drives "sideband" interactions that couple the qubit state to these vibrations. By carefully designing the laser pulse, the phonon bus mediates a two-qubit phase operation that entangles any two ions in the chain — regardless of their distance from each other.',
      },
      {
        question: 'What does "algorithmic qubit" or #AQ mean?',
        answer: 'The Algorithmic Qubit (#AQ) metric, developed by IonQ, measures the number of qubits that can run a fully connected random circuit at above-threshold fidelity. It captures both qubit count and gate fidelity in a single number. #AQ 35 means 35 qubits executing a fully entangled circuit with meaningful output fidelity — more useful than raw qubit count alone.',
      },
      {
        question: 'Why can\'t trapped-ion systems just add more ions to scale up?',
        answer: 'As the ion chain grows longer, the number of vibrational modes grows with it, and their frequencies crowd together. This makes it increasingly difficult to address a single motional mode without off-resonantly exciting neighboring modes. Background electric field noise also heats the ions proportionally. Beyond roughly 50–100 ions, the two-qubit gate fidelity degrades significantly, making longer single chains impractical.',
      },
      {
        question: 'Are trapped-ion computers available in the cloud?',
        answer: 'Yes. IonQ systems are accessible via Amazon Braket, Microsoft Azure Quantum, and IonQ Cloud. Quantinuum H-Series systems are available via Microsoft Azure Quantum and Quantinuum\'s own Nexus portal.',
      },
      {
        question: 'How do trapped-ion systems compare to superconducting for fault-tolerant computing?',
        answer: 'Trapped-ion gates have much higher fidelity, which reduces the physical qubit overhead for error correction. However, trapped-ion gates are 1000× slower, limiting the number of error correction rounds per second. Both architectures are pursuing fault-tolerant operation; the trade-off between fidelity and speed will determine which achieves useful fault tolerance first.',
      },
    ],
    sources: [
      { title: 'Realization of real-time fault-tolerant quantum error correction', publisher: 'Physical Review X / Quantinuum', url: 'https://journals.aps.org/prx/abstract/10.1103/PhysRevX.11.041058', year: 2021 },
      { title: 'Demonstration of the trapped-ion quantum CCD computer architecture', publisher: 'Nature / Honeywell', url: 'https://www.nature.com/articles/s41586-021-03928-y', year: 2021 },
      { title: 'High-fidelity trapped-ion qubit operations with scalable photonic modularity', publisher: 'Physical Review Letters', url: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.130.050803', year: 2023 },
    ],
  },

  'neutral-atom': {
    slug: 'neutral-atom',
    paradigmLabel: 'GATE-BASED · ANALOG · HYBRID',
    howItWorks: [
      'Neutral-atom quantum computers use individual electrically neutral atoms — typically Rubidium-87 or Caesium-133 — trapped by tightly focused laser beams called optical tweezers. Unlike trapped ions, neutral atoms do not interact with each other via long-range Coulomb forces. Instead, entanglement is achieved by temporarily exciting atoms to extremely high-energy electronic states called Rydberg states.',
      'A Rydberg atom has an electron in a shell far from the nucleus, giving it an enormous electric dipole moment. When two nearby atoms are both excited toward the Rydberg state, their dipole-dipole interaction is so strong that the excitation of one atom prevents the other from being excited — the Rydberg blockade. This blockade mechanism is the engine of two-qubit entangling gates in neutral-atom systems. By carefully timing the Rydberg excitation laser pulses, a controlled-Z or controlled-X gate is implemented between pairs of atoms within the blockade radius (typically 5–15 micrometers).',
      'The key architectural advantage is reconfigurability: optical tweezers are controlled by acousto-optic deflectors or spatial light modulators, so the atom array can be rearranged between gate operations. Atoms can be moved to create arbitrary connectivity patterns, or to sort a randomly loaded array into a defect-free configuration. This enables both digital gate-based computation and analog quantum simulation of spin models, Hubbard models, and other many-body Hamiltonians.',
    ],
    physicalImplementation: {
      qubitMedium: 'Individual neutral atoms (Rb-87, Cs-133, or Sr-88) trapped in optical tweezer arrays; qubit states encoded in hyperfine ground state levels',
      controlMechanism: 'Global and locally addressed laser pulses; two-qubit entangling gates via Rydberg blockade mechanism; tweezer repositioning for atom rearrangement',
      operatingEnvironment: 'Ultra-high vacuum chamber; atoms laser-cooled and trapped from a magneto-optical trap (MOT); atom temperature ~1–10 µK; no dilution refrigerator needed',
      readoutMechanism: 'Fluorescence imaging: state-selective laser drives |1⟩ atoms to fluoresce while |0⟩ atoms remain dark; high-resolution camera captures individual atom images; readout fidelity >99.5% demonstrated',
    },
    connectivityDetail: 'Reconfigurable connectivity — atoms can be physically moved between gate operations to create arbitrary qubit coupling geometries. Within a single gate zone, all atoms within the Rydberg blockade radius (~10 µm) can be entangled. Global Rydberg pulses can address the full array simultaneously. This enables both local nearest-neighbor interactions and longer-range gates via atomic transport.',
    nativeGates: 'Single-qubit: arbitrary rotations via global or locally addressed microwave and optical pulses. Two-qubit: CZ gate (Rydberg blockade), CCZ gate (multi-control). Analog mode: programmable Ising Hamiltonian evolution. Mid-circuit measurement and erasure detection demonstrated; qubit reinsertion from reservoir demonstrated by Atom Computing.',
    advantages: [
      'Reconfigurable qubit array — atoms can be repositioned to create any desired connectivity graph without SWAP overhead',
      'Demonstrated arrays of 1000+ atoms (Atom Computing, 2023); scaling by adding more tweezers is straightforward in principle',
      'No dilution refrigerator required — significantly lower infrastructure cost and operational complexity than superconducting',
      'Natural analog quantum simulation for spin models and lattice gauge theories in 2D and 3D geometries',
      'Mid-circuit measurements and erasure error detection have been demonstrated, improving error correction efficiency',
      'Stochastic atom loss is detectable as erasure errors (much easier to correct than depolarizing errors)',
    ],
    limitations: [
      'Atom loading is stochastic — each experimental cycle has random atom loss requiring active reloading from a reservoir',
      'Rydberg state lifetimes limit gate fidelity; two-qubit gate fidelities (~99–99.5%) currently lag trapped-ion by ~0.5–1%',
      'Rydberg blockade radius of ~10 µm limits which atoms can directly interact; long-range gates require atom transport',
      'Atom transport adds latency; moving atoms adds heat and risks atom loss',
      'Gate clock rates are currently slower than superconducting (µs scale gates vs. ns scale)',
      'Large-scale integration of independent-site laser addressing is technically challenging',
    ],
    scalingNotes: 'Neutral-atom arrays scale naturally by expanding the tweezer array — demonstrated from small (10-atom) systems to 1,180-atom arrays (Atom Computing, 2023). The challenge is maintaining high-fidelity, site-resolved addressing as arrays grow. Proposed three-dimensional tweezer arrays would dramatically increase qubit count. For error correction, the built-in erasure detection from atom loss substantially reduces the qubit overhead compared to depolarizing noise models — a compelling advantage for reaching fault tolerance. QuEra and Harvard demonstrated 48-logical-qubit error-corrected circuits using neutral atoms in 2023, a significant milestone for error-corrected computation.',
    workloadNotes: {
      suited: [
        'Analog quantum simulation of condensed matter and AMO physics problems',
        'Combinatorial optimization with Rydberg blockade encoding (MaxCut, graph problems)',
        'Quantum chemistry simulation with reconfigurable connectivity',
        'Machine learning circuits with variable connectivity per layer',
        'Error correction research leveraging erasure detection advantage',
      ],
      lesssuited: [
        'High-throughput applications requiring microsecond cycle times',
        'Algorithms requiring extremely deep gate sequences without mid-circuit reloading',
        'Problems with strict requirements on deterministic, loss-free qubit behavior',
      ],
    },
    faqs: [
      {
        question: 'What is the Rydberg blockade and why does it enable two-qubit gates?',
        answer: 'A Rydberg atom has its outermost electron excited to a very high quantum number (n~50–100). These atoms have a huge electric dipole moment, and two nearby Rydberg atoms repel each other strongly. This "blockade" means that if atom A is already in the Rydberg state, atom B cannot be excited to it. By exploiting this conditional excitation, a laser sequence implements a controlled phase gate between the two atoms without any physical contact — just through their shared electric field.',
      },
      {
        question: 'Why are neutral atoms better than ions for large-scale arrays?',
        answer: 'Neutral atoms don\'t repel each other at rest, so they can be packed far more densely than ions (which maintain fixed distances due to Coulomb repulsion). Tweezer arrays can place atoms on a lattice with few-micrometer spacing, enabling hundreds to thousands of qubits in a table-top apparatus without a dilution refrigerator.',
      },
      {
        question: 'What happened to atoms that are "lost" during computation?',
        answer: 'Atom loss (when an atom escapes its tweezer) is detectable by fluorescence imaging at the start and end of each circuit — or mid-circuit if needed. Lost atoms register as erasure errors, which are much more efficiently correctable than random Pauli errors. This means neutral-atom error correction can require fewer physical qubits per logical qubit than other architectures at the same physical error rate.',
      },
      {
        question: 'Which neutral-atom computers are available today?',
        answer: 'QuEra\'s Aquila (256 atoms, analog mode) is accessible via Amazon Braket. PASQAL\'s Fresnel system (100 atoms) is available via their cloud. Both companies offer digital gate-based systems in development or early access.',
      },
    ],
    sources: [
      { title: 'Logical quantum processor based on reconfigurable atom arrays', publisher: 'Nature / Harvard & QuEra', url: 'https://www.nature.com/articles/s41586-023-06927-3', year: 2023 },
      { title: 'High-fidelity parallel entangling gates on a neutral-atom quantum computer', publisher: 'Nature / Lukin Group', url: 'https://www.nature.com/articles/s41586-022-04916-w', year: 2022 },
      { title: 'Observation of thermalization and information scrambling in a superconducting quantum processor', publisher: 'QuEra Computing', url: 'https://www.quera.com/research', year: 2023 },
    ],
  },

  photonic: {
    slug: 'photonic',
    paradigmLabel: 'GATE-BASED · ANALOG · BOSON SAMPLING',
    howItWorks: [
      'Photonic quantum computers use individual photons as the physical carriers of quantum information. A photon\'s quantum state can be encoded in several degrees of freedom — polarization (horizontal/vertical), time-bin (early/late arrival), path (which waveguide carries it), or the continuous variables of the optical mode (quadrature amplitudes of the electromagnetic field). The choice of encoding determines the computational model and the optical components needed.',
      'Linear optical quantum computing (LOQC), formalized by Knill, Laflamme, and Milburn in 2001, showed that universal quantum computation is achievable using only passive optical elements (beam splitters, phase shifters) plus photon-number-resolving detectors and single-photon sources. The catch: two-photon entangling gates (like CNOT) implemented with linear optics are inherently probabilistic, succeeding only a fraction of the time. This requires large resource overhead: many single photons are consumed to herald one successful gate. Measurement-based (cluster state) approaches and fusion-based quantum computing (FBQC) are alternative architectures that avoid the need for deterministic two-photon gates.',
      'Silicon photonics offers a promising manufacturing platform: waveguides, beam splitters, ring resonators, and phase modulators can all be fabricated on a silicon chip using CMOS-compatible processes, enabling integration at chip scale. PsiQuantum is pursuing this route to large-scale fault-tolerant photonic quantum computing. Xanadu\'s Gaussian boson sampling (GBS) machines use squeezed light states rather than single photons, and have claimed quantum computational advantage for certain sampling problems.',
    ],
    physicalImplementation: {
      qubitMedium: 'Single photons (for qubit-based approaches) or squeezed light states (for GBS/CV approaches) in optical waveguides or free-space paths',
      controlMechanism: 'Beam splitters (directional couplers in integrated photonics), phase shifters (electro-optic or thermo-optic modulators), optical switches, fiber delay lines',
      operatingEnvironment: 'Optical chip and waveguides operate at room temperature; superconducting nanowire single-photon detectors (SNSPDs) require cooling to ~1 K (not millikelvin — no dilution fridge needed); single-photon sources may require cryogenic cooling',
      readoutMechanism: 'Photon-number-resolving (PNR) detection via superconducting nanowire single-photon detectors (SNSPDs) at ~1 K; threshold detectors sufficient for some protocols; high efficiency (>90%) required for low-loss computation',
    },
    connectivityDetail: 'Photonic circuits implement arbitrary unitary transformations on multiple modes via networks of beam splitters and phase shifters — an N-mode optical circuit implements any N×N unitary. Integrated photonic switches allow reconfigurable routing. However, two-photon interactions (needed for universal quantum gates) are probabilistic in linear optics, requiring post-selection or feed-forward from detectors.',
    nativeGates: 'Linear optical networks: arbitrary single-qubit rotations (via beam splitters and phase shifts). Probabilistic two-qubit gates: type-I and type-II fusion gates used in FBQC. For continuous-variable (CV) computing: squeezing operations, displacement, homodyne/heterodyne measurement. Optical switches for feed-forward.',
    advantages: [
      'Many optical components operate at room temperature — no dilution refrigerator for the photonic circuit itself',
      'Photons do not suffer from thermal decoherence — the dominant noise source is photon loss, not thermalization',
      'Natural compatibility with optical fiber for quantum networking, quantum key distribution, and distributed quantum computing',
      'Silicon photonics manufacturing is compatible with existing semiconductor fabs, enabling chip-scale integration at wafer scale',
      'High-speed operation — photons travel at c, and optical operations can be performed at GHz rates in principle',
      'Gaussian boson sampling demonstrated claims of quantum computational advantage (Xanadu, 2020–2022)',
    ],
    limitations: [
      'Two-photon entangling gates are inherently probabilistic in linear optics — resource overhead scales badly with circuit depth',
      'High-efficiency single-photon sources (>99%) remain an unsolved materials challenge; current best demonstrated ~99% in limited setups',
      'Photon loss in waveguides (typically 0.1–1 dB/cm in Si) is the dominant error source and accumulates with circuit depth',
      'No large-scale gate-based photonic quantum computer exists today; current systems are proof-of-concept or analog',
      'Photon-number-resolving detectors still require cryogenic cooling (~1 K), partially eliminating the "room temperature" advantage',
      'Classical feed-forward (measuring an output photon and conditioning subsequent gates on the result) requires ultrafast electronics within photon transit time',
    ],
    scalingNotes: 'PsiQuantum\'s FBQC (Fusion-Based Quantum Computing) architecture is the most detailed published scalability roadmap for photonic quantum computing. It uses resource states of a few entangled photons, fused together by two-photon gates ("fusion gates"), to build a large fault-tolerant cluster state. The key advantage is that resource state generation can be parallelized across many chips, and a small fraction of photon loss is tolerable with appropriate codes (e.g., foliated surface codes). The critical thresholds are: single-photon source efficiency ~99%, photon loss ~0.1 dB per component, and detector efficiency ~99%. Reaching these simultaneously is a major engineering challenge.',
    workloadNotes: {
      suited: [
        'Quantum communication and quantum key distribution (QKD) protocols',
        'Quantum network nodes and quantum repeater stations',
        'Boson sampling and molecular vibronic spectra simulation (GBS)',
        'Continuous-variable quantum machine learning',
        'Quantum-enhanced sensing using squeezed light',
      ],
      lesssuited: [
        'General-purpose digital quantum computing at scale (not yet available)',
        'Applications requiring deterministic two-qubit gates without resource overhead',
        'Problems that benefit from the long coherence times of matter-based qubits',
      ],
    },
    faqs: [
      {
        question: 'Why are photonic two-qubit gates probabilistic in linear optics?',
        answer: 'Quantum gates require nonlinear interactions between photons. Linear optics (beam splitters, phase shifts) implements only linear transformations on optical modes. The KLM theorem (2001) proved that effective nonlinearity can be simulated using measurement and feed-forward, but this approach is inherently probabilistic — the gate succeeds only when detectors click in the right pattern. Achieving high success probability requires exponentially many ancilla photons.',
      },
      {
        question: 'What is Gaussian boson sampling and did it achieve quantum advantage?',
        answer: 'GBS sends squeezed coherent states of light through a random optical network and samples the output photon distribution. Xanadu\'s Borealis (2022) and Jiuzhang (2020, USTC) both reported sampling tasks that would take classical supercomputers estimated millions of years. However, these claims remain contested — improved classical algorithms have reduced the estimated classical simulation time, and the computational value of the sampled output is unclear.',
      },
      {
        question: 'What is fusion-based quantum computing (FBQC)?',
        answer: 'FBQC, developed by PsiQuantum, avoids the need for large cluster states generated all at once. Instead, small "resource states" of a few entangled photons are generated by photon sources, then fused together via probabilistic two-photon "fusion gates" to build up a fault-tolerant computation. The probabilistic nature of fusion is tolerable if the failure rate stays below a threshold (~35% for type-II fusion). This allows a modular, parallel architecture suited to silicon photonics manufacturing.',
      },
      {
        question: 'Is there a photonic quantum computer available today?',
        answer: 'Xanadu\'s Borealis (GBS mode) has been accessible via cloud (PennyLane/Strawberry Fields). No gate-based photonic universal quantum computer is commercially available at this time. PsiQuantum, the most capitalized photonic quantum computing company, is still in the hardware development phase as of 2026.',
      },
    ],
    sources: [
      { title: 'A scheme for efficient quantum computation with linear optics', publisher: 'Nature / Knill, Laflamme, Milburn', url: 'https://www.nature.com/articles/35051009', year: 2001 },
      { title: 'Fusion-based quantum computation', publisher: 'Nature Communications / PsiQuantum', url: 'https://www.nature.com/articles/s41467-023-36493-1', year: 2023 },
      { title: 'Quantum computational advantage with a programmable photonic processor', publisher: 'Nature / Xanadu', url: 'https://www.nature.com/articles/s41586-022-04725-3', year: 2022 },
    ],
  },

  'quantum-annealing': {
    slug: 'quantum-annealing',
    paradigmLabel: 'ANALOG · OPTIMIZATION',
    howItWorks: [
      'Quantum annealing is an analog computational paradigm designed specifically to find low-energy states of Ising spin models — which in turn can represent a wide class of combinatorial optimization problems. Rather than implementing discrete quantum gate operations, an annealer prepares the system in the known ground state of a simple transverse field Hamiltonian (all qubits in superposition) and then slowly evolves the system by reducing the transverse field while simultaneously increasing the strength of the problem Hamiltonian. If this evolution is slow enough (the adiabatic theorem), the system remains in the ground state throughout and ends in the ground state of the problem Hamiltonian, which encodes the solution.',
      'D-Wave\'s annealers use superconducting flux qubits as the physical qubits. A flux qubit encodes |0⟩ and |1⟩ as two directions of persistent current flowing around a superconducting loop. Programmable Josephson junction couplers between qubits allow the coupling strengths J_ij and local biases h_i to be set, encoding any problem that can be written as a quadratic unconstrained binary optimization (QUBO) or equivalently the Ising model E = Σ h_i σ_i + Σ J_ij σ_i σ_j.',
      'In practice, D-Wave systems do not run full adiabatic anneals. The anneal time is tunable (1–2000 µs), and at finite anneal speed the system does not always find the true ground state — it finds low-energy states that are typically good but not provably optimal solutions. Hybrid classical-quantum solvers (via Ocean SDK) decompose large problems, run subproblems on the QPU, and recombine results, significantly extending the class of tractable problems.',
    ],
    physicalImplementation: {
      qubitMedium: 'Superconducting flux qubits: persistent current states in Nb superconducting loops; programmable Josephson junction couplers set the problem Hamiltonian',
      controlMechanism: 'Slowly varying magnetic flux through each qubit loop to implement the transverse field schedule; programmable coupler flux biases set J_ij and h_i; fully analog control (no microwave pulses)',
      operatingEnvironment: '~15 millikelvin in dilution refrigerator; classical control electronics at room temperature; programming via D-Wave cloud API (no user-accessible lab hardware)',
      readoutMechanism: 'After the anneal, each qubit is read out by measuring its persistent current direction using a SQUID amplifier chain; repeated anneals sample the low-energy distribution; statistical mode is typically reported as the solution',
    },
    connectivityDetail: 'Sparse, fixed graph topology defined by the physical coupler layout. D-Wave Advantage uses the Pegasus graph (~15-way average connectivity per qubit); Advantage2 uses the Zephyr graph (~20-way connectivity). Problems requiring higher connectivity must be "embedded" — mapping logical qubits to chains of physical qubits, reducing the effective qubit count. Embedding is NP-hard in general.',
    nativeGates: 'Not gate-based — the annealing paradigm implements a continuous Hamiltonian evolution. Problems are specified as QUBO/Ising energy functions, not as circuit gate sequences. D-Wave Ocean SDK provides tools for QUBO formulation, embedding, and hybrid classical-quantum decomposition.',
    advantages: [
      'Largest physical qubit counts of any commercial quantum system: D-Wave Advantage2 has ~7,000+ physical qubits',
      'Simple, direct programming model for QUBO/Ising problems — many real optimization problems map naturally',
      'Proven enterprise deployments at Volkswagen, NTT, 1QBit, government labs, and financial institutions',
      'Mature cloud platform (Leap) with the longest commercial quantum computing track record of any company',
      'Hybrid classical-quantum solvers (Kerberos, BQM, NL) extend the class of solvable problems well beyond raw qubit count',
      'Each anneal takes 1–2000 µs and many can be run per second — high sampling throughput',
    ],
    limitations: [
      'Not a universal quantum computer — can only solve QUBO/Ising problems; gate-based algorithms (Shor, Grover) cannot be run',
      'No proven quantum speedup over the best classical algorithms for practical problems as of 2026',
      'Problem embedding on sparse Pegasus/Zephyr graphs can require 5–20 physical qubits per logical qubit, drastically reducing effective size',
      'Annealing is not guaranteed to find the global optimum — it finds low-energy states with some probability',
      'Coherence during the anneal is difficult to characterize and likely mixed quantum-classical in practice',
      'Limited by dilution refrigerator cooling capacity and wiring, same as superconducting gate-based systems',
    ],
    scalingNotes: 'D-Wave has scaled from 128 qubits (2011) to 5,000+ qubits (Advantage, 2020) to 7,000+ qubits (Advantage2, targeting Zephyr topology). The Zephyr graph provides ~20-way connectivity, reducing embedding overhead. Future scaling will be limited by the same physical constraints as superconducting: wiring density, cooling capacity, and crosstalk. D-Wave has also expanded to hybrid computing with their Leap platform, which can handle problems with millions of variables by decomposing them into QPU-sized chunks. The long-term question is whether quantum annealing ever provides a practical speedup over classical heuristics like simulated annealing, branch-and-bound, or tensor network methods on problems that matter to enterprise customers.',
    workloadNotes: {
      suited: [
        'Combinatorial optimization: logistics, scheduling, portfolio optimization, drug discovery (QUBO-formulated)',
        'Sampling from Boltzmann distributions for machine learning',
        'Graph problems: MaxCut, max clique, graph coloring (embedable on Pegasus/Zephyr)',
        'Materials simulation via Ising Hamiltonian analog',
        'Hybrid classical-quantum workflows via Ocean SDK',
      ],
      lesssuited: [
        'Problems requiring universal gate-based quantum algorithms (Shor, HHL, QSCI)',
        'Quantum chemistry simulation requiring arbitrary circuits',
        'Problems with more complex qubit interactions than QUBO/Ising (e.g., higher-order terms without embedding)',
      ],
    },
    faqs: [
      {
        question: 'Is quantum annealing really "quantum"? Does tunneling actually help?',
        answer: 'D-Wave\'s hardware is physically quantum — the flux qubits operate in the quantum regime at millikelvin temperatures, and quantum tunneling through energy barriers is theoretically present during the anneal. Whether this quantum tunneling provides a practical speedup over classical thermal annealing on real problems remains unresolved. Studies have found quantum behavior (tunneling signatures, entanglement) in D-Wave hardware, but head-to-head comparisons with optimized classical solvers have not definitively shown a quantum speedup on practical problem instances.',
      },
      {
        question: 'What is QUBO and how do I formulate my problem for annealing?',
        answer: 'QUBO stands for Quadratic Unconstrained Binary Optimization: minimize x^T Q x where x is a binary vector and Q is an upper triangular matrix. Many combinatorial problems map to QUBO: vertex cover, MaxCut, number partitioning, and others. D-Wave\'s Ocean SDK provides Python tools to formulate problems in QUBO or Ising form, embed them on the hardware, and retrieve solutions.',
      },
      {
        question: 'What is D-Wave Leap and how do I get access?',
        answer: 'D-Wave Leap is D-Wave\'s quantum cloud platform. It offers free trial access (1 minute of QPU time per month) and paid subscription tiers. The platform provides access to Advantage and Advantage2 QPUs, hybrid solvers, and the Ocean SDK. Enterprise customers typically purchase reserved access packages.',
      },
      {
        question: 'Can quantum annealing solve optimization problems faster than classical computers today?',
        answer: 'This is an open research question. D-Wave\'s hardware has not demonstrated a proven speedup over the best classical optimization algorithms on practically relevant problem instances. For some structured problems (e.g., crafted spin-glass instances), quantum annealing may show advantage. Commercial value comes from the hybrid workflow pipeline, fast sampling, and accessible cloud platform rather than a proven speedup claim.',
      },
    ],
    sources: [
      { title: 'Quantum annealing with manufactured spins', publisher: 'Nature / D-Wave', url: 'https://www.nature.com/articles/nature10012', year: 2011 },
      { title: 'Computational multiqubit tunnelling in programmable quantum annealers', publisher: 'Nature Communications', url: 'https://www.nature.com/articles/ncomms13524', year: 2016 },
      { title: 'Advantage2: an error-correcting quantum annealing system', publisher: 'D-Wave', url: 'https://www.dwavesys.com/solutions-and-products/systems/', year: 2023 },
    ],
  },

  topological: {
    slug: 'topological',
    paradigmLabel: 'GATE-BASED · RESEARCH',
    howItWorks: [
      'Topological quantum computing is a fundamentally different approach to qubit protection. Instead of encoding quantum information in the physical state of a single particle (a transmon, an ion, an atom) and carefully isolating it from noise, topological qubits encode information non-locally in collective properties of a many-body quantum system. The information is stored in the global topology of the quantum state rather than in any local degree of freedom — making it inherently resistant to local disturbances.',
      'The primary candidate for topological qubits is Majorana zero modes (MZMs). These are exotic quasiparticle excitations that appear at the ends of certain one-dimensional topological superconductors — specifically, semiconductor nanowires (InAs or InSb) with strong spin-orbit coupling, placed in proximity to a conventional superconductor (Al) and subjected to a magnetic field. When the parameters (field strength, chemical potential, superconducting gap) are tuned correctly, two Majorana modes appear localized at the two ends of the wire. Quantum information is encoded in the combined fermion parity of the two ends — a fundamentally non-local quantity.',
      'Quantum gates are implemented by "braiding" Majorana modes — physically exchanging the positions of two Majorana quasiparticles. In two-dimensional systems, unlike ordinary fermions or bosons, exchanging two non-Abelian anyons (the class to which MZMs belong) does not simply return the state to itself; it applies a unitary transformation to the degenerate ground state. This unitary depends only on the topology of the braid (which Majorana went around which other), not on the exact path or timing — giving topological protection against errors. In practice, Majorana modes must be moved using electrostatic gates on the nanowire.',
    ],
    physicalImplementation: {
      qubitMedium: 'Majorana zero modes at the ends of InAs or InSb semiconductor nanowires proximitized to Al superconducting shells; qubit encoded in fermion parity of a pair of MZMs',
      controlMechanism: 'Electrostatic gate voltages to tune chemical potential and control MZM positions; magnetic fields to drive topological phase transition; braiding via T-junction or 2D topological networks',
      operatingEnvironment: '~50–100 millikelvin in dilution refrigerator; applied magnetic field (0.1–1 T); UHV sample preparation; extreme parameter tuning sensitivity',
      readoutMechanism: 'Interferometric readout via Josephson junction or quantum dot charge sensing of the MZM parity; conductance spectroscopy for verification; non-demolition parity readout demonstrated in research settings',
    },
    connectivityDetail: 'Not yet demonstrated at scale. Theoretical proposals involve 2D networks of topological nanowires connected at T-junctions, allowing Majorana modes to be braided through the network. The connectivity structure would be determined by the device geometry and the gate-controlled movement of MZMs. The key challenge is engineering reliable T-junction devices where MZMs can be controllably exchanged.',
    nativeGates: 'Topologically protected: Clifford gates via Majorana braiding (Hadamard, CNOT, phase gate). Universal quantum computation requires a non-Clifford gate (e.g., T gate) which is not topologically protected and requires magic state distillation — a significant resource overhead. This is a fundamental limitation of Majorana-based topological computing with current proposals.',
    advantages: [
      'Theoretically intrinsic fault tolerance from non-local qubit encoding — local noise sources cannot flip the qubit',
      'If realized, topological qubits may require 10–100× fewer physical qubits per logical qubit than surface-code-corrected transmon qubits',
      'Braiding gates are topologically protected — their fidelity is determined by the topological gap, not by gate timing precision',
      'Long coherence times expected once MZMs are reliably created and the topological gap is sufficiently large',
      'Could dramatically reduce the hardware overhead for fault-tolerant quantum computing if engineering challenges are solved',
    ],
    limitations: [
      'Majorana zero modes have proven extremely difficult to reliably create, distinguish from trivial near-zero modes, and control',
      'No gate-based topological quantum computer has been demonstrated; the field is in an experimental physics research phase',
      'Microsoft\'s 2018 paper claiming Majorana signatures was retracted in 2021 due to data presentation issues — illustrating how difficult reliable verification is',
      'The topological gap (the energy protecting the qubit) must be large enough that thermal fluctuations cannot excite quasiparticles; achieving this at practical temperatures remains challenging',
      'Universal quantum computation requires magic state distillation for T gates — a costly classical-overhead step not removed by topological protection',
      'Timeline to a working topological quantum computer is the least certain of all commercial architectures',
    ],
    scalingNotes: 'Microsoft\'s Majorana 1 chip (announced 2025) represents the current state of the art: a chip integrating multiple topological qubit devices on a single package, with reported signatures of Majorana-based qubit operation. Microsoft\'s vision is that topological qubits will require far fewer physical-to-logical qubit overhead than conventional error correction, enabling compact fault-tolerant computers. The critical near-term milestones are: (1) reliably demonstrating a stable, protected topological qubit with measured coherence times, (2) demonstrating a two-qubit gate via braiding, and (3) reaching fidelity thresholds. Given the current research state, a working topological quantum computer delivering practical advantage is likely more than a decade away.',
    workloadNotes: {
      suited: [
        'Ultimately the same workloads as other gate-based quantum computers — but with potentially far lower qubit overhead for fault tolerance',
        'Research problems requiring fault-tolerant circuits that are currently too resource-intensive on non-topological architectures',
      ],
      lesssuited: [
        'Any near-term workload (topological QC is not commercially available)',
        'NISQ-era variational algorithms (topological approach is inherently fault-tolerant, not noise-tolerant-by-design)',
        'Continuous optimization requiring fast iteration cycles',
      ],
    },
    faqs: [
      {
        question: 'What is a Majorana zero mode?',
        answer: 'A Majorana zero mode is a quasiparticle excitation in a condensed matter system that is its own antiparticle. In a topological superconductor, pairs of MZMs appear at zero energy at the boundaries of the system. Unlike ordinary electrons (which are Fermi particles with definite number), MZMs are superpositions — encoding quantum information in their non-local collective state. The "zero mode" refers to the zero energy gap to create the excitation (within the degenerate ground state subspace).',
      },
      {
        question: 'Why was Microsoft\'s 2018 Majorana paper retracted?',
        answer: 'A 2018 Nature paper from Microsoft/TU Delft claimed to observe signatures consistent with a topological phase transition and Majorana modes in an InSb nanowire. A subsequent reanalysis in 2020–2021 found that the paper had not included all measured data and the selected data did not provide strong evidence for Majorana modes. The paper was retracted in 2021. This illustrates the challenge of distinguishing true topological Majorana signatures from trivial near-zero-energy states in semiconductor devices.',
      },
      {
        question: 'What is the topological protection and why does it help with errors?',
        answer: 'In a topological superconductor, the qubit\'s information is encoded in the shared parity state of two MZMs that are spatially separated. To corrupt this information, an error would need to simultaneously affect both ends of the wire — spanning the entire system. Local noise, which affects only individual atoms or small regions, cannot flip the qubit. This is analogous to how a knot in a string cannot be removed by local deformations — it requires a global operation.',
      },
      {
        question: 'What is Majorana 1 and what did Microsoft demonstrate?',
        answer: 'Microsoft\'s Majorana 1 (announced February 2025) is a chip that integrates eight topological qubits in a device using the topoconductor platform — InAs-Al heterostructures engineered to host Majorana modes. Microsoft claimed to have demonstrated a new phase of matter (the topological phase) and qubit readout with low error rates. Independent verification of these claims is ongoing in the research community.',
      },
      {
        question: 'When might topological quantum computers be practical?',
        answer: 'The most optimistic credible timelines suggest a first demonstration of a protected logical qubit via topological means by the late 2020s, and a small-scale practical topological processor by the 2030s. Given the experimental challenges encountered so far, significant uncertainty remains. Most quantum computing experts regard topological QC as the highest-risk but highest-reward long-term approach.',
      },
    ],
    sources: [
      { title: 'Non-Abelian anyons and topological quantum computation', publisher: 'Reviews of Modern Physics / Nayak et al.', url: 'https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.80.1083', year: 2008 },
      { title: 'Topological quantum computation', publisher: 'Bulletin of the AMS / Freedman, Kitaev, Larsen, Wang', url: 'https://www.ams.org/journals/bull/2003-40-01/S0273-0979-02-00964-3/', year: 2003 },
      { title: 'Microsoft\'s Majorana 1: A New Foundation for Fault-Tolerant Quantum Computing', publisher: 'Microsoft Research', url: 'https://azure.microsoft.com/en-us/blog/quantum/', year: 2025 },
    ],
  },
}
