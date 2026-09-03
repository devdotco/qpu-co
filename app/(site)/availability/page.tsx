import type { Metadata } from 'next'
import { getQpus, getCloudPlatforms } from '@/lib/data'
import AvailabilityDashboard from '@/components/availability/AvailabilityDashboard'

export const metadata: Metadata = {
  title: 'QPU Availability | QPU.co',
  description:
    'Current availability status for quantum processors. See which QPUs are publicly accessible, available by reservation, in private access, or announced.',
}

export default async function AvailabilityPage() {
  const [qpus, platforms] = await Promise.all([getQpus(), getCloudPlatforms()])
  return <AvailabilityDashboard qpus={qpus} platforms={platforms} />
}
