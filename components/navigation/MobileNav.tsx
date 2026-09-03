'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import * as Accordion from '@radix-ui/react-accordion'
import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import { X, ChevronDown, Search, ArrowRight } from 'lucide-react'
import Logo from './Logo'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

interface NavSection {
  id: string
  label: string
  links: { href: string; label: string }[]
}

const sections: NavSection[] = [
  {
    id: 'qpus',
    label: 'QPUs',
    links: [
      { href: '/qpus', label: 'All QPUs' },
      { href: '/compare', label: 'Compare QPUs' },
      { href: '/benchmarks', label: 'Benchmarks' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/availability', label: 'Availability' },
      { href: '/providers', label: 'Providers' },
    ],
  },
  {
    id: 'technology',
    label: 'Technology',
    links: [
      { href: '/architectures', label: 'Architectures' },
      { href: '/learn/qubits', label: 'Qubits' },
      { href: '/learn/error-correction', label: 'Error Correction' },
      { href: '/technology/control-systems', label: 'Control Systems' },
      { href: '/technology/cryogenics', label: 'Cryogenics' },
    ],
  },
  {
    id: 'use-cases',
    label: 'Use Cases',
    links: [
      { href: '/use-cases/chemistry', label: 'Chemistry' },
      { href: '/use-cases/optimization', label: 'Optimization' },
      { href: '/use-cases/finance', label: 'Finance' },
      { href: '/use-cases/machine-learning', label: 'Machine Learning' },
      { href: '/use-cases/drug-discovery', label: 'Drug Discovery' },
      { href: '/use-cases/cryptography', label: 'Cryptography' },
    ],
  },
  {
    id: 'developers',
    label: 'Developers',
    links: [
      { href: '/developers', label: 'Developer Overview' },
      { href: '/developers/api', label: 'API' },
      { href: '/developers/examples', label: 'Code Examples' },
      { href: '/frameworks/qiskit', label: 'Qiskit' },
      { href: '/frameworks/cirq', label: 'Cirq' },
      { href: '/qpu-advisor', label: 'QPU Advisor' },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    links: [
      { href: '/intelligence/news', label: 'Latest News' },
      { href: '/intelligence/research', label: 'Research' },
      { href: '/intelligence/launches', label: 'Processor Launches' },
      { href: '/companies', label: 'Company Directory' },
      { href: '/intelligence/roadmaps', label: 'Hardware Roadmaps' },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    links: [
      { href: '/learn', label: 'Learn' },
      { href: '/learn/what-is-a-qpu', label: 'What is a QPU?' },
      { href: '/learn/qpu-vs-gpu', label: 'QPU vs GPU' },
      { href: '/glossary', label: 'Glossary' },
      { href: '/methodology', label: 'Methodology' },
    ],
  },
]

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const searchRef = useRef<HTMLInputElement>(null)

  // Focus search on open
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 150)
    }
  }, [open])

  return (
    <Dialog.Root open={open} onOpenChange={o => !o && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Drawer */}
            <Dialog.Content asChild>
              <motion.div
                key="drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="fixed top-0 left-0 bottom-0 z-50 flex flex-col"
                style={{
                  width: 'min(85vw, 360px)',
                  backgroundColor: 'var(--color-bg-raised)',
                  borderRight: '1px solid var(--color-border)',
                }}
              >
                <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>

                {/* Header */}
                <div
                  className="flex items-center justify-between px-4 flex-shrink-0"
                  style={{ height: 56 }}
                >
                  <Logo size="sm" />
                  <Dialog.Close asChild>
                    <button
                      className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-panel)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                      aria-label="Close navigation"
                    >
                      <X size={16} />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Search bar */}
                <div
                  className="px-4 pb-3 flex-shrink-0"
                  style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                  <div
                    className="flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2"
                    style={{
                      backgroundColor: 'var(--color-bg-panel)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <Search size={14} className="text-[var(--color-text-muted)] flex-shrink-0" />
                    <input
                      ref={searchRef}
                      type="search"
                      placeholder="Search QPUs, architectures…"
                      className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none"
                    />
                  </div>
                </div>

                {/* Accordion navigation */}
                <div className="flex-1 overflow-y-auto">
                  <Accordion.Root type="multiple" className="py-2">
                    {sections.map(section => (
                      <Accordion.Item
                        key={section.id}
                        value={section.id}
                        className="border-b border-[var(--color-border-subtle)] last:border-b-0"
                      >
                        <Accordion.Trigger
                          className={cn(
                            'w-full flex items-center justify-between px-4 py-3',
                            'text-sm font-medium text-[var(--color-text-secondary)]',
                            'hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-panel)]',
                            'transition-colors focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
                            '[&[data-state=open]]:text-[var(--color-text-primary)]'
                          )}
                        >
                          {section.label}
                          <ChevronDown
                            size={14}
                            className="text-[var(--color-text-muted)] transition-transform duration-200 [[data-state=open]_&]:rotate-180"
                          />
                        </Accordion.Trigger>

                        <Accordion.Content className="overflow-hidden data-[state=open]:animate-[slideDown_0.2s_ease] data-[state=closed]:animate-[slideUp_0.2s_ease]">
                          <ul className="py-1 pl-4 pr-4 space-y-0.5">
                            {section.links.map(link => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  onClick={onClose}
                                  className="block px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-[var(--radius-md)] hover:bg-[var(--color-bg-panel)] transition-colors"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Accordion.Content>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </div>

                {/* Sticky bottom CTA */}
                <div
                  className="flex-shrink-0 p-4"
                  style={{ borderTop: '1px solid var(--color-border)' }}
                >
                  <Link
                    href="/qpus"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-[var(--radius-md)] text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-bg-base)',
                    }}
                  >
                    Find a QPU <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
