import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Quantum Computing Company Directory — QPU.co',
  description:
    'Directory of quantum computing companies: QPU manufacturers, quantum software, control systems, cryogenics, photonics, cloud platforms, and research organizations.',
}

interface CompanyEntry {
  name: string
  country: string
  description: string
  website: string
}

type CategoryData = {
  label: string
  companies: CompanyEntry[]
}

const CATEGORIES: CategoryData[] = [
  {
    label: 'QPU Manufacturers',
    companies: [
      { name: 'IBM Quantum', country: 'US', description: 'Superconducting quantum processors and cloud access via IBM Quantum Network.', website: 'https://www.ibm.com/quantum' },
      { name: 'IonQ', country: 'US', description: 'Trapped-ion quantum computers available on AWS, Azure, and Google Cloud.', website: 'https://ionq.com' },
      { name: 'Rigetti Computing', country: 'US', description: 'Superconducting QPUs and Quantum Cloud Services (QCS) platform.', website: 'https://www.rigetti.com' },
      { name: 'Quantinuum', country: 'US/UK', description: 'Trapped-ion systems with industry-leading two-qubit gate fidelities.', website: 'https://www.quantinuum.com' },
      { name: 'IQM Quantum Computers', country: 'FI', description: 'Superconducting QPUs for on-premises deployment across European research institutes.', website: 'https://www.meetiqm.com' },
      { name: 'QuEra Computing', country: 'US', description: 'Neutral-atom quantum computers using Rydberg atom arrays. Spun out of Harvard and MIT.', website: 'https://www.quera.com' },
      { name: 'PASQAL', country: 'FR', description: 'Neutral-atom processors using optical tweezers. Spun out of Institut d\'Optique.', website: 'https://www.pasqal.com' },
      { name: 'D-Wave Systems', country: 'CA', description: 'Quantum annealing hardware for optimization problems via the Leap cloud platform.', website: 'https://www.dwavesys.com' },
      { name: 'AQT', country: 'AT', description: 'Trapped-ion quantum computers for research and commercial deployment.', website: 'https://www.aqt.eu' },
      { name: 'Atom Computing', country: 'US', description: 'Neutral-atom quantum computers using optically trapped arrays of nuclear-spin qubits.', website: 'https://www.atomcomputing.com' },
      { name: 'Oxford Quantum Circuits', country: 'UK', description: 'Superconducting QPUs via cloud access with 3D integrated circuit architecture.', website: 'https://www.oxfordquantumcircuits.com' },
      { name: 'PsiQuantum', country: 'US', description: 'Photonic quantum computing, targeting fault-tolerant systems at scale.', website: 'https://www.psiquantum.com' },
      { name: 'Xanadu', country: 'CA', description: 'Photonic quantum computing and the PennyLane software framework.', website: 'https://www.xanadu.ai' },
    ],
  },
  {
    label: 'Quantum Software',
    companies: [
      { name: 'Q-CTRL', country: 'AU', description: 'Quantum control software and firmware to improve QPU performance and stability.', website: 'https://q-ctrl.com' },
      { name: 'Strangeworks', country: 'US', description: 'Quantum computing platform providing access to multiple hardware backends.', website: 'https://strangeworks.com' },
      { name: 'Multiverse Computing', country: 'ES', description: 'Quantum algorithms for finance, energy, and industrial optimization.', website: 'https://multiversecomputing.com' },
      { name: 'QunaSys', country: 'JP', description: 'Quantum chemistry and materials science software for near-term hardware.', website: 'https://qunasys.com' },
    ],
  },
  {
    label: 'Control Systems',
    companies: [
      { name: 'Quantum Machines', country: 'IL', description: 'Quantum orchestration platform and OPX control hardware for QPU operations.', website: 'https://www.quantum-machines.co' },
      { name: 'Zurich Instruments', country: 'CH', description: 'High-frequency test and measurement instruments for qubit control and readout.', website: 'https://www.zhinst.com' },
      { name: 'Keysight Technologies', country: 'US', description: 'Electronic design automation and quantum measurement solutions.', website: 'https://www.keysight.com/quantum' },
    ],
  },
  {
    label: 'Cryogenics & Hardware Enablement',
    companies: [
      { name: 'Bluefors', country: 'FI', description: 'Dilution refrigerator systems used across quantum computing research and commercial deployments.', website: 'https://bluefors.com' },
      { name: 'Oxford Instruments', country: 'UK', description: 'Cryogenic systems, magnets, and low-temperature instruments for quantum hardware labs.', website: 'https://www.oxinst.com' },
    ],
  },
  {
    label: 'Photonics',
    companies: [
      { name: 'PsiQuantum', country: 'US', description: 'Silicon photonics for fault-tolerant quantum computing at scale.', website: 'https://www.psiquantum.com' },
      { name: 'Xanadu', country: 'CA', description: 'Photonic quantum computing via Strawberry Fields and Borealis systems.', website: 'https://www.xanadu.ai' },
    ],
  },
  {
    label: 'Cloud Platforms',
    companies: [
      { name: 'Amazon Braket', country: 'US', description: 'AWS managed quantum computing service with access to IonQ, Rigetti, QuEra, and simulators.', website: 'https://aws.amazon.com/braket/' },
      { name: 'Azure Quantum', country: 'US', description: 'Microsoft\'s quantum cloud platform with IonQ, Quantinuum, Rigetti, and resource estimator.', website: 'https://azure.microsoft.com/products/quantum' },
      { name: 'IBM Quantum', country: 'US', description: 'IBM cloud access to Eagle, Heron, and other superconducting processors via Qiskit Runtime.', website: 'https://quantum.ibm.com' },
    ],
  },
]

const FLAG: Record<string, string> = {
  US: '🇺🇸', UK: '🇬🇧', 'US/UK': '🇺🇸🇬🇧', FI: '🇫🇮', FR: '🇫🇷', CA: '🇨🇦',
  AU: '🇦🇺', ES: '🇪🇸', JP: '🇯🇵', IL: '🇮🇱', CH: '🇨🇭', AT: '🇦🇹',
}

export default function CompaniesPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      {/* Header */}
      <section
        style={{ borderBottom: '1px solid var(--color-border)', padding: '56px 24px 48px' }}
        className="grid-bg"
      >
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Breadcrumb
            items={[{ label: 'qpu.co', href: '/' }, { label: 'companies' }]}
            className="mb-6"
          />
          <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 14 }}>
            Quantum Computing Companies
          </h1>
          <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', margin: 0, maxWidth: '58ch' }}>
            A directory of companies across the quantum computing ecosystem: QPU manufacturers,
            software, control systems, cryogenics, and cloud platforms.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '52px 24px' }}>

        {CATEGORIES.map(category => (
          <section key={category.label} style={{ marginBottom: 52 }}>
            <p className="eyebrow" style={{ marginBottom: 16 }}>{category.label}</p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 10,
              }}
            >
              {category.companies.map(company => (
                <a
                  key={company.name}
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block no-underline rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-panel)] hover:border-[rgba(255,255,255,0.14)] hover:bg-[var(--color-bg-overlay)] transition-colors"
                  style={{ padding: '16px 18px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {company.name}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'var(--font-mono), monospace',
                        color: 'var(--color-text-muted)',
                        marginLeft: 'auto',
                        flexShrink: 0,
                      }}
                      title={company.country}
                    >
                      {FLAG[company.country] ?? company.country}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.55 }}>
                    {company.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}

        {/* Footer note */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-panel)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>
            This directory is not comprehensive. Companies can submit for inclusion.
          </p>
          <Link
            href="/list-your-qpu"
            style={{
              fontSize: 13,
              color: 'var(--color-accent)',
              fontWeight: 500,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            List your hardware →
          </Link>
        </div>
      </div>
    </div>
  )
}
