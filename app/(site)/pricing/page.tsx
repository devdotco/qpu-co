import type { Metadata } from 'next'
import { getQpus, getProviders, getCloudPlatforms } from '@/lib/data'
import PricingClient from '@/components/pricing/PricingClient'

export const metadata: Metadata = {
  title: 'Quantum Computing Pricing | QPU.co',
  description:
    'Compare quantum computing access costs across providers and cloud platforms. Per-shot, per-task, reservation, and subscription pricing models explained.',
}

export default async function PricingPage() {
  const [qpus, providers, platforms] = await Promise.all([
    getQpus(),
    getProviders(),
    getCloudPlatforms(),
  ])
  return <PricingClient qpus={qpus} providers={providers} platforms={platforms} />
}
