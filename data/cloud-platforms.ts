import type { CloudPlatform } from '../types'

export const cloudPlatforms: CloudPlatform[] = [
  {
    id: 'aws-braket',
    slug: 'aws-braket',
    name: 'Amazon Braket',
    providers: ['ionq', 'rigetti', 'quera', 'iqm', 'dwave'],
    frameworks: ['amazon-braket-sdk', 'pennylane', 'qiskit'],
    regions: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-2'],
    accessModels: ['pay-per-shot', 'pay-per-task', 'reservation'],
    pricingModel:
      'Per-task fee ($0.00035–$0.10 per task depending on hardware) plus per-shot fees ($0.01–$0.90 per shot). Reserved instances available for sustained workloads.',
    status: 'active',
    website: 'https://aws.amazon.com/braket/',
    description:
      'Amazon Braket is AWS\'s fully managed quantum computing service providing access to multiple QPU technologies from IonQ, Rigetti, QuEra, IQM, and D-Wave, alongside high-performance classical simulators. Braket integrates with AWS Lambda, S3, and SageMaker for hybrid workflows.',
  },
  {
    id: 'azure-quantum',
    slug: 'azure-quantum',
    name: 'Azure Quantum',
    providers: ['ionq', 'quantinuum', 'rigetti'],
    frameworks: ['qsharp', 'qiskit', 'cirq', 'pennylane'],
    regions: ['eastus', 'westeurope', 'westus'],
    accessModels: ['pay-per-shot', 'subscription', 'enterprise'],
    pricingModel:
      'Credit-based pricing model with free Azure Quantum Credits for new users. Pay-as-you-go per-shot rates vary by provider. Enterprise agreements available.',
    status: 'active',
    website: 'https://azure.microsoft.com/products/quantum',
    description:
      'Azure Quantum is Microsoft\'s quantum computing cloud service providing access to IonQ, Quantinuum, and Rigetti hardware alongside Microsoft\'s own quantum-inspired optimization solvers. Azure Quantum integrates tightly with the Azure development ecosystem and Microsoft\'s Q# language toolchain.',
  },
  {
    id: 'ibm-quantum',
    slug: 'ibm-quantum',
    name: 'IBM Quantum',
    providers: ['ibm'],
    frameworks: ['qiskit', 'pennylane', 'cuda-q'],
    regions: ['us-east', 'us-south', 'eu-de', 'jp-tok'],
    accessModels: ['open-access', 'subscription', 'enterprise', 'reservation'],
    pricingModel:
      'IBM Quantum Network offers tiered plans: Open (free, limited access), Pay-as-you-go (per runtime second), Dedicated (reserved system access). Qiskit Runtime pricing is per second of QPU time.',
    status: 'active',
    website: 'https://quantum.ibm.com/',
    description:
      'IBM Quantum is IBM\'s cloud quantum computing platform providing access to IBM\'s fleet of superconducting quantum processors (Eagle, Heron, Flamingo). Offers the Qiskit Runtime environment for hybrid workloads, plus real-time classical co-processing. Largest fleet of publicly accessible quantum systems globally.',
  },
  {
    id: 'ionq-cloud',
    slug: 'ionq-cloud',
    name: 'IonQ Quantum Cloud',
    providers: ['ionq'],
    frameworks: ['qiskit', 'cirq', 'amazon-braket-sdk', 'pennylane'],
    regions: ['us-east-1'],
    accessModels: ['pay-per-shot', 'enterprise'],
    pricingModel:
      'Direct API access priced per circuit shot. Enterprise contracts available for dedicated or priority access.',
    status: 'active',
    website: 'https://cloud.ionq.com/',
    description:
      'IonQ\'s direct cloud platform provides API access to IonQ Forte and Aria systems for developers and enterprise customers. Circuits are submitted via REST API or SDK; IonQ also partners with AWS Braket, Azure Quantum, and Google Cloud for multi-cloud QPU access.',
  },
  {
    id: 'dwave-leap',
    slug: 'dwave-leap',
    name: 'D-Wave Leap',
    providers: ['dwave'],
    frameworks: ['amazon-braket-sdk'],
    regions: ['us-west-2', 'eu-central-1'],
    accessModels: ['subscription', 'pay-per-task', 'open-access', 'enterprise'],
    pricingModel:
      'Leap Hybrid Solver Service charged per second of solver runtime (approximately $2.00/minute). Free developer tier available with limited QPU access. Enterprise plans include dedicated time.',
    status: 'active',
    website: 'https://cloud.dwavesys.com/leap/',
    description:
      'D-Wave Leap is D-Wave\'s cloud quantum computing service providing access to D-Wave Advantage quantum annealers and the Leap Hybrid Solver Service (HSS), which transparently routes problems between classical and quantum resources. Leap is the primary platform for D-Wave\'s enterprise customers and researchers.',
  },
  {
    id: 'quantinuum-nexus',
    slug: 'quantinuum-nexus',
    name: 'Quantinuum Nexus',
    providers: ['quantinuum'],
    frameworks: ['qiskit', 'cirq', 'pennylane'],
    regions: ['us-east', 'eu-west'],
    accessModels: ['reservation', 'enterprise', 'research'],
    pricingModel:
      'Access primarily through enterprise agreements and research partnerships. H-Series QPU time reserved in blocks; TKET compiler is open-source.',
    status: 'active',
    website: 'https://www.quantinuum.com/products/nexus',
    description:
      'Quantinuum Nexus is Quantinuum\'s quantum computing platform offering access to H-Series trapped-ion systems (H1, H2). TKET, Quantinuum\'s open-source compiler, provides hardware-agnostic circuit optimization. Access is primarily via reserved time blocks for enterprise and research accounts.',
  },
]
