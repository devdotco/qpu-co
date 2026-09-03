'use client'

import { Plus, Check } from 'lucide-react'
import { useCompareTray } from '@/hooks/useCompareTray'
import { cn } from '@/lib/utils'

interface CompareButtonProps {
  qpuId: string
  qpuName: string
  size?: 'sm' | 'md'
}

export function CompareButton({ qpuId, qpuName, size = 'md' }: CompareButtonProps) {
  const { has, add, remove, isFull } = useCompareTray()
  const isSelected = has(qpuId)

  const handleClick = () => {
    if (isSelected) {
      remove(qpuId)
    } else if (!isFull) {
      add(qpuId)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isSelected && isFull}
      aria-label={isSelected ? `Remove ${qpuName} from comparison` : `Add ${qpuName} to comparison`}
      aria-pressed={isSelected}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-[var(--radius-md)] border transition-colors',
        'focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2',
        'disabled:opacity-40 disabled:pointer-events-none',
        size === 'sm' && 'text-xs h-7 px-2.5',
        size === 'md' && 'text-sm h-9 px-3.5',
        isSelected
          ? 'border-[rgba(34,211,238,0.3)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
          : 'border-[var(--color-border)] bg-[var(--color-bg-panel)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]',
      )}
    >
      {isSelected ? <Check size={size === 'sm' ? 11 : 13} /> : <Plus size={size === 'sm' ? 11 : 13} />}
      {isSelected ? 'Added to Compare' : 'Compare +'}
    </button>
  )
}
