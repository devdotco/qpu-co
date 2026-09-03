'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { X, Plus, ArrowRight } from 'lucide-react'
import { useCompareTray } from '@/hooks/useCompareTray'

export default function CompareTray() {
  const { items, remove, count } = useCompareTray()

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full"
          style={{ maxWidth: 600, padding: '0 16px' }}
          role="region"
          aria-label="QPU comparison tray"
          aria-live="polite"
        >
          <div
            className="flex items-center gap-2 rounded-[var(--radius-xl)] px-4 py-3"
            style={{
              backgroundColor: 'var(--color-bg-panel)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {/* Selected items */}
            <div className="flex items-center gap-2 flex-1 flex-wrap min-w-0">
              {items.map(id => (
                <TrayItem key={id} id={id} onRemove={remove} />
              ))}

              {/* Add slot (if under 4 items) */}
              {count < 4 && (
                <Link
                  href="/qpus"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-md)] text-xs font-medium transition-colors"
                  style={{
                    color: 'var(--color-text-muted)',
                    border: '1px dashed var(--color-border)',
                  }}
                >
                  <Plus size={11} />
                  Add QPU
                </Link>
              )}
            </div>

            {/* CTA */}
            <Link
              href={`/compare?ids=${items.join(',')}`}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-semibold transition-colors"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-bg-base)',
              }}
            >
              Compare {count} {count === 1 ? 'QPU' : 'QPUs'}
              <ArrowRight size={13} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface TrayItemProps {
  id: string
  onRemove: (id: string) => void
}

function TrayItem({ id, onRemove }: TrayItemProps) {
  // Display name: capitalize, replace dashes with spaces, truncate
  const displayName = id
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .slice(0, 20)

  return (
    <span
      className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-[var(--radius-md)] text-xs font-medium"
      style={{
        backgroundColor: 'var(--color-bg-raised)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-secondary)',
      }}
    >
      <span className="max-w-[100px] truncate">{displayName}</span>
      <button
        onClick={() => onRemove(id)}
        aria-label={`Remove ${displayName} from comparison`}
        className="ml-0.5 flex items-center justify-center w-4 h-4 rounded-sm transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <X size={10} />
      </button>
    </span>
  )
}
