'use client'

import dynamic from 'next/dynamic'

const TopologyMap = dynamic(() => import('@/components/svg/TopologyMap'), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      style={{
        width: '520px',
        height: '420px',
        maxWidth: '100%',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
      }}
    />
  ),
})

export default function TopologyMapClient() {
  return <TopologyMap />
}
