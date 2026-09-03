import type { Article } from '../types'

// NOTE: These are fictional sample articles for seed/demo purposes.
// They are illustrative intelligence pieces and do not represent real events.

export const articles: Article[] = [
  {
    id: 'art-001',
    slug: 'ibm-heron-r2-performance-analysis',
    title: 'IBM Heron r2: A Performance Deep-Dive After Six Months of Cloud Access',
    dek: 'We ran 40,000 circuits on IBM\'s 156-qubit Heron r2 processor. Here\'s what the data actually shows about two-qubit gate fidelity, crosstalk, and real workload throughput.',
    author: 'QPU Intelligence Desk',
    publishedAt: '2026-07-14T09:00:00Z',
    updatedAt: '2026-07-18T14:30:00Z',
    readingTime: 11,
    category: 'benchmarks',
    tags: ['ibm', 'heron', 'superconducting', 'benchmarks', 'fidelity', 'clops'],
    excerpt:
      'IBM\'s Heron r2 represents the company\'s shift to a tunable coupler architecture designed to reduce ZZ crosstalk that plagued earlier Eagle-generation processors. After six months of broad cloud access, enough real-world circuit data has accumulated to evaluate whether Heron r2 delivers on its fidelity promises.',
    content: `IBM's Heron r2 processor launched with bold claims: dramatically lower crosstalk, improved two-qubit gate fidelity, and a new heavy-hex variant topology. After six months of cloud access through IBM Quantum Platform, enough real-world circuit execution data has accumulated to evaluate whether Heron r2 delivers on those promises.

## Methodology

We submitted a battery of 40,000 circuits spanning four workload types: random clifford circuits (for benchmarking), VQE ansatz circuits for H2 and LiH molecules, QAOA circuits on Max-Cut instances with 10–50 nodes, and randomized benchmarking sequences targeting individual two-qubit gate pairs. All circuits were transpiled using Qiskit's Level 3 optimization with hardware-aware routing.

## Key Findings

**Two-qubit gate fidelity** improved meaningfully versus Eagle r3. Median ECR gate fidelity across the 156-qubit device measured at 99.3%, compared to 98.7% on the best Eagle r3 units we benchmarked in Q1 2025. The tunable coupler architecture suppresses residual ZZ coupling during idle periods — this shows up clearly in multi-qubit idle crosstalk benchmarks.

**CLOPS (Circuit Layer Operations Per Second)** for Heron r2 consistently measured between 1,500 and 2,100 CLOPS on our standard 100-qubit circuits, reflecting improved classical control electronics and reduced shot overhead in Qiskit Runtime's batch execution mode.

**Effective circuit depth** for chemistry workloads increased by approximately 40% before noise dominates, compared to Eagle r3 baselines. This is the most practically significant improvement for near-term variational algorithms.

## Limitations

Not everything improved. Readout fidelity on the outer qubit ring (qubits 128–155) is noticeably lower than the core — average readout assignment error of 2.1% vs 1.1% on the core — suggesting calibration or connectivity edge effects. Queue wait times during peak hours remain significant, often exceeding 90 minutes for 100+ shot circuits without reservation access.

## Verdict

For chemistry simulation and QAOA workloads under 80 qubits, Heron r2 is a meaningful step forward. For users targeting the full 156-qubit device, the fidelity gradient across the chip requires careful qubit selection to avoid degraded performance regions.`,
  },
  {
    id: 'art-002',
    slug: 'quantinuum-h2-error-correction-milestone',
    title: 'Quantinuum\'s H2 Demonstrates Real-Time Error Correction at 56 Qubits',
    dek: 'Quantinuum published results showing real-time syndrome measurement and correction on their H2-1 trapped-ion processor. We examine what this means for the fault-tolerant roadmap.',
    author: 'QPU Intelligence Desk',
    publishedAt: '2026-06-02T08:00:00Z',
    updatedAt: null,
    readingTime: 9,
    category: 'research',
    tags: ['quantinuum', 'trapped-ion', 'error-correction', 'fault-tolerant', 'h2'],
    excerpt:
      'Quantinuum\'s H2-1 system, with 56 trapped ytterbium ions, has become the proving ground for mid-circuit measurement and real-time error correction experiments that are moving fault-tolerant quantum computing from theoretical frameworks toward engineering reality.',
    content: `Quantinuum published a preprint last week demonstrating real-time quantum error correction (QEC) cycles on their H2-1 trapped-ion processor — a result that moves the needle on fault-tolerant computing timelines.

## What Was Demonstrated

The team implemented a 7-qubit Steane code logical qubit using H2-1's 56 physical qubits, performing 10 rounds of syndrome measurement and real-time feed-forward correction within a single circuit execution. Crucially, the logical error rate after 10 QEC cycles was lower than the equivalent physical qubit error rate — the break-even point that demonstrates genuine error suppression.

The logical two-qubit gate error rate was measured at 2.8 × 10⁻³, achieved through real-time decoding using a minimum-weight perfect matching (MWPM) decoder running on an on-chip FPGA co-processor. Correction latency was approximately 1.2 ms per syndrome round.

## Why This Matters

Most QEC demonstrations to date have been post-hoc — errors are recorded but correction is simulated classically afterward. Real-time correction (feed-forward) is necessary for fault-tolerant computation because logical algorithms cannot pause between syndrome cycles. H2-1's demonstration of real-time feed-forward at 56 qubits with genuine logical error suppression is the most practically significant QEC milestone since Google's 2023 surface code below-threshold result.

## The Trapped-Ion Advantage

H2-1's all-to-all connectivity is essential for this result. Steane code syndrome circuits require connectivity between non-neighboring qubits; in superconducting systems with grid topology, this requires SWAP chains that add error. Trapped-ion systems implement these circuits natively.

## What's Next

Quantinuum's roadmap targets a 100+ logical qubit system by 2028 using concatenated codes. The H2-1 result validates the physical layer; the challenge now is scaling the decoder and classical control bandwidth alongside qubit count.`,
  },
  {
    id: 'art-003',
    slug: 'ionq-forte-enterprise-aerospace-deployment',
    title: 'IonQ Forte Enterprise Enters First Aerospace Deployment for Route Optimization',
    dek: 'A major aerospace contractor has signed a multi-year agreement to use IonQ\'s Forte Enterprise system for fleet scheduling and maintenance routing problems — one of quantum computing\'s first sustained enterprise deployments.',
    author: 'QPU Intelligence Desk',
    publishedAt: '2026-05-19T11:00:00Z',
    updatedAt: '2026-05-20T09:15:00Z',
    readingTime: 7,
    category: 'business',
    tags: ['ionq', 'trapped-ion', 'enterprise', 'optimization', 'aerospace', 'business'],
    excerpt:
      'IonQ announced that a major aerospace defense contractor will deploy IonQ Forte Enterprise hardware on-premises to run vehicle routing and maintenance scheduling optimization workloads — marking one of the first multi-year, sustained enterprise quantum computing deployments outside of research labs.',
    content: `IonQ announced a multi-year enterprise agreement this week with a major aerospace and defense contractor (name withheld pending customer announcement) for on-premises deployment of the IonQ Forte Enterprise system — one of the first sustained, non-research quantum computing deployments in the sector.

## The Use Case

The customer will use Forte Enterprise for fleet maintenance scheduling optimization across a 400+ aircraft maintenance network. The problem maps naturally to a quadratic binary optimization: minimize total downtime across scheduled maintenance intervals subject to parts availability, crew certification, and regulatory compliance constraints.

The IonQ team confirmed that a QAOA-based hybrid solver will be used, with IonQ's Quantum Hybrid execution environment managing the classical-quantum loop. Circuit execution targets 35 algorithmic qubits of effective problem encoding.

## Why Trapped-Ion for This Workload

The aerospace team cited three factors in selecting IonQ's trapped-ion hardware over quantum annealers (which would seem a natural fit for optimization):

1. **Circuit programmability**: QAOA requires gate-based hardware; optimization parameters can be updated between iterations
2. **Fidelity at small scale**: At 35 AQ, Forte Enterprise can encode problem instances that fit within a single scheduling horizon without embedding overhead
3. **Error characteristics**: Trapped-ion systems produce more predictable, correlated errors that the hybrid solver's error mitigation can compensate

## Reality Check

The aerospace partner acknowledged that classical solvers (specifically a Gurobi-based branch-and-bound implementation) currently match or exceed the quantum hybrid solver for the majority of problem instances. The deployment is structured as an R&D agreement with commercial trigger milestones: the quantum-classical hybrid must demonstrate 15% improvement in schedule quality on a defined benchmark suite before moving to production operations.

This is honest framing — quantum optimization at enterprise scale remains a work in progress, and the aerospace sector's patience for multi-year R&D cycles makes it an ideal early adopter.`,
  },
  {
    id: 'art-004',
    slug: 'neutral-atom-quera-aquila-2026-update',
    title: 'QuEra\'s Aquila After Three Years: The Neutral-Atom Platform That Quietly Delivered',
    dek: 'QuEra\'s 256-qubit Aquila processor has run more than 2 million cloud jobs. We assess what researchers have actually accomplished on the platform and where the technology is heading.',
    author: 'QPU Intelligence Desk',
    publishedAt: '2026-04-08T09:30:00Z',
    updatedAt: null,
    readingTime: 10,
    category: 'hardware',
    tags: ['quera', 'neutral-atom', 'aquila', 'rydberg', 'analog', 'research'],
    excerpt:
      'When QuEra made their 256-qubit Aquila neutral-atom processor available on AWS Braket in 2023, most of the quantum computing community treated it as an exotic curiosity. Three years later, it has accumulated over two million cloud executions, supported dozens of published research papers, and quietly established neutral-atom hardware as a serious platform for quantum simulation and optimization.',
    content: `When QuEra made Aquila available on Amazon Braket in late 2023, industry observers questioned whether analog neutral-atom hardware had a path to broad adoption. The programming model was unfamiliar — no circuit gates, instead a Hamiltonian evolution spec — and the lack of single-qubit addressability seemed limiting. Three years later, those concerns look premature.

## What the Data Shows

QuEra disclosed that Aquila has processed over 2 million cloud jobs since launch, representing the most cloud executions of any neutral-atom system. The user base spans 47 countries, primarily university research groups (68%) and national laboratories (22%).

Published research using Aquila includes:
- **Quantum spin liquid simulation**: A Harvard-led team used Aquila to simulate the ground state of a ruby lattice Hamiltonian at 219 atoms — the largest quantum simulation of a frustrated magnetic system
- **Optimization benchmarking**: Multiple groups ran QUBMIS (maximum independent set) problems, confirming Aquila's native advantage for Rydberg-blockade-compatible graph problems
- **Quantum phase transitions**: Studies of confinement/deconfinement transitions in Z₂ lattice gauge theories at scales unreachable by classical tensor network methods

## Platform Limitations That Remain

Aquila's analog mode lacks single-qubit control — all atoms receive the same drive pulse, and spatial addressing is limited. This rules out arbitrary gate sequences. The platform excels at problems naturally described by 2D Rydberg Hamiltonians; users trying to force arbitrary optimization problems into this model face significant formulation overhead.

Atom loading efficiency is approximately 97% per site, meaning a 256-site array has a small probability of loading with missing atoms. Software compensation handles most cases, but it adds a layer of stochasticity researchers must account for.

## What's Coming

QuEra is developing a gate-based mode for the successor to Aquila (internal codename Helios) with individual qubit addressing via local laser beams. QuEra CEO Nate Gemelke confirmed at IEEE Quantum Week 2025 that gate-based Aquila access is targeted for 2026. If delivered, this would make QuEra's platform competitive with trapped-ion and superconducting systems for gate-based workloads while retaining the large-scale analog simulation capability.`,
  },
  {
    id: 'art-005',
    slug: 'dwave-advantage2-logistics-case-study',
    title: 'D-Wave Advantage2 Pilot: Real Numbers From a Freight Forwarding Deployment',
    dek: 'A European freight forwarder published internal benchmark data from a six-month D-Wave Advantage2 pilot for container shipment routing. The results are more nuanced than the press release suggested.',
    author: 'QPU Intelligence Desk',
    publishedAt: '2026-03-25T10:00:00Z',
    updatedAt: '2026-03-27T16:45:00Z',
    readingTime: 8,
    category: 'business',
    tags: ['dwave', 'quantum-annealing', 'optimization', 'logistics', 'enterprise', 'case-study'],
    excerpt:
      'A European freight forwarding company released an internal technical report summarizing six months of running container shipment routing problems on D-Wave\'s Advantage2 prototype system via D-Wave Leap. The headline result — "15% cost reduction" — requires careful interpretation.',
    content: `A European freight forwarding company (name anonymized in the published report) released its internal benchmark data from a six-month D-Wave Advantage2 pilot program this week. The company's logistics team ran real container shipment routing problems alongside their existing classical Gurobi solver, and the data is worth examining in detail.

## The Problem Formulation

Container shipment routing at this scale involves 800–1,400 containers per weekly planning cycle, each with origin, destination, time window, and 3–5 carrier options. The optimization objective minimizes total freight cost plus late delivery penalty. This maps naturally to a QUBO formulation after encoding carrier selection as binary variables, but the resulting problem graph has 3,200–5,600 binary variables — too large to embed directly on Advantage2's Pegasus graph without minor embedding overhead.

The team used D-Wave's hybrid BQM (Binary Quadratic Model) solver, which decomposes large problems into sub-problems that alternate between quantum annealer and classical CPU components.

## The Actual Results

The headline "15% cost reduction" refers to the improvement over the company's baseline greedy heuristic solver — not over Gurobi. When compared to Gurobi with a 120-second time limit:

- **D-Wave Hybrid**: 8.3% better than greedy baseline, 1.2% better than Gurobi (120s)
- **D-Wave Hybrid**: 4.1% worse than Gurobi with a 10-minute time limit
- **D-Wave Hybrid**: Significantly faster than Gurobi at solution times under 30 seconds

This is an honest mixed result. For time-critical re-planning scenarios (port delays, carrier failures requiring rapid re-routing), the D-Wave hybrid solver provides solution quality competitive with Gurobi at a fraction of the classical computation time. For the weekly planning cycle where compute time is unconstrained, Gurobi remains superior.

## What This Tells the Market

The freight forwarder framed this as a deployment success, and they're not wrong — but the value proposition is speed, not optimality. D-Wave's hybrid solver delivers near-Gurobi solution quality in under 30 seconds on problems where Gurobi takes minutes. For operational contexts where 30-second replanning windows exist, this has real value.

The lesson for evaluating quantum annealing pilots: ask whether the comparison baseline is the customer's existing heuristic or a well-tuned classical optimizer with adequate compute time. The honest answer often looks like this report — competitive in specific time-constrained scenarios, not yet dominant across the board.`,
  },
  {
    id: 'art-006',
    slug: 'iqm-spark-education-deployment',
    title: 'IQM Spark Arrives on Campus: A Review of the 5-Qubit On-Premises Educational System',
    dek: 'IQM\'s Spark system is the first superconducting quantum processor designed for on-campus deployment at universities. We evaluate the hardware, software stack, and whether it actually changes how quantum education works.',
    author: 'QPU Intelligence Desk',
    publishedAt: '2026-02-12T08:00:00Z',
    updatedAt: null,
    readingTime: 6,
    category: 'hardware',
    tags: ['iqm', 'superconducting', 'education', 'spark', 'on-premises', 'hardware'],
    excerpt:
      'IQM\'s Spark is a 5-qubit superconducting quantum processor sold as an on-premises educational system — the first of its kind designed specifically for university deployment rather than research use. It ships with a dilution refrigerator in a 19-inch rack-mountable form factor and uses IQM\'s cloud-accessible control software.',
    content: `IQM Quantum Computers is marketing a fundamentally different product with Spark: not a research system or cloud QPU, but a 5-qubit superconducting processor packaged specifically for university computer science and physics departments to install on-campus.

## Hardware Reality

Spark ships in a BlueFors LD-250 dilution refrigerator, pre-configured and factory-calibrated. The package is designed to be operational within 72 hours of delivery — a stark contrast to the weeks-to-months commissioning time of research-grade QPUs. IQM handles remote calibration updates via their cloud control plane, so users don't need on-site quantum hardware expertise.

Qubit count is intentionally minimal at 5 qubits with ring connectivity. This is a pedagogical choice: 5 qubits is large enough to demonstrate quantum entanglement, Bell states, and basic variational algorithms, while small enough that students can track full 32-dimensional state vectors classically for comparison.

## Software Stack

Spark uses IQM's Resonance cloud platform for circuit submission, supporting Qiskit and Cirq front-ends. A purpose-built educational curriculum from IQM Academy accompanies every Spark deployment — 12 lab modules covering superposition through simple VQE.

The real-time access model is novel: students reserve 20-minute execution slots via a web scheduler, submit circuits, and receive results within their window. For classrooms of 20–30 students, the bottleneck is the scheduling system, not the hardware.

## Does On-Premises Actually Matter?

The honest pedagogical question: does running circuits on real hardware in the building deliver meaningfully different learning outcomes than using cloud QPUs? Two physics department chairs we spoke to argued yes — the physical presence of the cryostat demystifies the technology and enables lab tours that cloud access cannot replicate. One noted that grants for campus infrastructure were more accessible than cloud compute budgets.

The counter-argument: 5 physical qubits offers limited quantum advantage exploration; students working on real algorithms will quickly outgrow Spark and move to cloud systems anyway. IQM's pitch is that Spark is the gateway, not the destination.

At approximately €500,000 per system (estimated, IQM doesn't publish list prices), Spark is competitive with other major research equipment purchases and within reach for well-funded physics departments.`,
  },
]
