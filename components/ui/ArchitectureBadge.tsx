import * as React from 'react'
import type { ArchitectureType } from '@/types'
import { cn } from '@/lib/utils'

export interface ArchitectureBadgeProps {
  architecture: ArchitectureType
  size?: 'sm' | 'md'
}

interface ArchConfig {
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: React.ReactNode
}

function SuperconductingIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="2.5" cy="2.5" r="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="9.5" cy="2.5" r="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="2.5" cy="9.5" r="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="9.5" cy="9.5" r="1.5" fill="currentColor" opacity="0.9" />
    </svg>
  )
}

function TrappedIonIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="1.5" cy="6" r="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="10.5" cy="6" r="1.5" fill="currentColor" opacity="0.9" />
    </svg>
  )
}

function NeutralAtomIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="2" r="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="10" cy="7" r="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="2" cy="7" r="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="6" cy="6" r="1" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

function PhotonicIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M1 6 Q3 3 5 6 Q7 9 9 6 Q10.5 3.5 11 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  )
}

function AnnealingIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="2" cy="2" r="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="10" cy="2" r="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="6" cy="10" r="1.5" fill="currentColor" opacity="0.9" />
      <line x1="2" y1="2" x2="10" y2="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="2" y1="2" x2="6" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="10" y1="2" x2="6" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

function TopologicalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M1 8 C2 6 3 4 5 5 C7 6 8 4 9 3 C10 2 11 4 11 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  )
}

const archConfig: Record<ArchitectureType, ArchConfig> = {
  superconducting: {
    label: 'Superconducting',
    color: '#60A5FA',
    bgColor: 'rgba(96,165,250,0.1)',
    borderColor: 'rgba(96,165,250,0.2)',
    icon: <SuperconductingIcon />,
  },
  'trapped-ion': {
    label: 'Trapped Ion',
    color: '#A78BFA',
    bgColor: 'rgba(167,139,250,0.1)',
    borderColor: 'rgba(167,139,250,0.2)',
    icon: <TrappedIonIcon />,
  },
  'neutral-atom': {
    label: 'Neutral Atom',
    color: '#34D399',
    bgColor: 'rgba(52,211,153,0.1)',
    borderColor: 'rgba(52,211,153,0.2)',
    icon: <NeutralAtomIcon />,
  },
  photonic: {
    label: 'Photonic',
    color: '#F472B6',
    bgColor: 'rgba(244,114,182,0.1)',
    borderColor: 'rgba(244,114,182,0.2)',
    icon: <PhotonicIcon />,
  },
  'quantum-annealing': {
    label: 'Annealing',
    color: '#FB923C',
    bgColor: 'rgba(251,146,60,0.1)',
    borderColor: 'rgba(251,146,60,0.2)',
    icon: <AnnealingIcon />,
  },
  topological: {
    label: 'Topological',
    color: '#FBBF24',
    bgColor: 'rgba(251,191,36,0.1)',
    borderColor: 'rgba(251,191,36,0.2)',
    icon: <TopologicalIcon />,
  },
}

export function ArchitectureBadge({ architecture, size = 'sm' }: ArchitectureBadgeProps) {
  const config = archConfig[architecture]
  const textClass = size === 'sm' ? 'text-[10px]' : 'text-xs'
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-0.5'

  return (
    <span
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
        textClass,
        padding,
      )}
    >
      {config.icon}
      {config.label}
    </span>
  )
}
