import type { Metadata } from 'next'
import { QPUAdvisorPage } from '@/components/advisor/QPUAdvisorPage'
import { getQpus } from '@/lib/data'

export const metadata: Metadata = {
  title: 'QPU Advisor — Find the Right Quantum Hardware',
  description:
    'Multi-step workload analysis to identify the most suitable quantum processor architectures and specific QPUs for your use case.',
}

export default async function QPUAdvisorRoute() {
  const qpus = await getQpus()
  return <QPUAdvisorPage qpus={qpus} />
}
