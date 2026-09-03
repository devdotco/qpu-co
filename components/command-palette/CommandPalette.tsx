'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { qpus } from '@/data/qpus'
import { providers } from '@/data/providers'
import { architectures } from '@/data/architectures'
import { useCases } from '@/data/use-cases'
import { frameworks } from '@/data/frameworks'

// ─── Context ─────────────────────────────────────────────────────────────────

interface CommandPaletteContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const CommandPaletteContext = React.createContext<CommandPaletteContextValue>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
})

export function useCommandPalette() {
  return React.useContext(CommandPaletteContext)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  const toggle = React.useCallback(() => setOpen((v) => !v), [])

  // Global keyboard shortcut
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen, toggle }}>
      {children}
      <CommandPaletteModal />
    </CommandPaletteContext.Provider>
  )
}

// ─── Static Pages ─────────────────────────────────────────────────────────────

const staticPages = [
  { label: 'Home', href: '/', description: 'QPU.co home' },
  { label: 'All QPUs', href: '/qpus', description: 'Browse all quantum processors' },
  { label: 'Providers', href: '/providers', description: 'Hardware manufacturers' },
  { label: 'Architectures', href: '/architectures', description: 'Qubit technology types' },
  { label: 'Use Cases', href: '/use-cases', description: 'Quantum application domains' },
  { label: 'Frameworks', href: '/frameworks', description: 'Quantum software frameworks' },
  { label: 'Compare', href: '/compare', description: 'Side-by-side QPU comparison' },
  { label: 'Learn', href: '/learn', description: 'Quantum computing education' },
  { label: 'Methodology', href: '/methodology', description: 'How we verify data' },
  { label: 'About', href: '/about', description: 'About QPU.co' },
]

// ─── Result Item ─────────────────────────────────────────────────────────────

function ResultItem({
  icon,
  label,
  category,
  onSelect,
}: {
  icon: React.ReactNode
  label: string
  category: string
  onSelect: () => void
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] cursor-pointer',
        'text-sm text-[var(--color-text-secondary)]',
        'outline-none transition-colors',
        'data-[selected=true]:bg-[var(--color-bg-overlay)] data-[selected=true]:text-[var(--color-text-primary)]',
        'hover:bg-[var(--color-bg-overlay)] hover:text-[var(--color-text-primary)]',
      )}
    >
      <span
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-bg-base)] text-[var(--color-text-muted)]"
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      <span className="text-[10px] font-mono text-[var(--color-text-faint)] shrink-0 uppercase tracking-wide">
        {category}
      </span>
    </Command.Item>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-1.5">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-faint)]"
        style={{ letterSpacing: '0.08em' }}>
        {children}
      </span>
    </div>
  )
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function ChipIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <line x1="1" y1="5" x2="3.5" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="1" y1="9" x2="3.5" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="10.5" y1="5" x2="13" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="10.5" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5" y1="1" x2="5" y2="3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="9" y1="1" x2="9" y2="3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5" y1="10.5" x2="5" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="9" y1="10.5" x2="9" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <line x1="5" y1="2" x2="5" y2="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="9" y1="2" x2="9" y2="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  )
}

function AtomIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
      <ellipse cx="7" cy="7" rx="5" ry="2.5" stroke="currentColor" strokeWidth="1.1" />
      <ellipse cx="7" cy="7" rx="5" ry="2.5" stroke="currentColor" strokeWidth="1.1" transform="rotate(60 7 7)" />
      <ellipse cx="7" cy="7" rx="5" ry="2.5" stroke="currentColor" strokeWidth="1.1" transform="rotate(120 7 7)" />
    </svg>
  )
}

function FlaskIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5 2v5L2 11h10L9 7V2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="5" y1="2" x2="9" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M4.5 4.5L2 7l2.5 2.5M9.5 4.5L12 7l-2.5 2.5M7 3l-1 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2" y="1" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <line x1="4.5" y1="5" x2="9.5" y2="5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="4.5" y1="7.5" x2="9.5" y2="7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="4.5" y1="10" x2="7.5" y2="10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────

function CommandPaletteModal() {
  const { open, setOpen } = useCommandPalette()
  const router = useRouter()
  const [query, setQuery] = React.useState('')

  function navigate(href: string) {
    router.push(href)
    setOpen(false)
    setQuery('')
  }

  const filteredQPUs = qpus.filter(
    (q) =>
      !query ||
      q.name.toLowerCase().includes(query.toLowerCase()) ||
      q.providerId.toLowerCase().includes(query.toLowerCase()),
  )

  const filteredProviders = providers.filter(
    (p) =>
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.shortName.toLowerCase().includes(query.toLowerCase()),
  )

  const filteredArchitectures = architectures.filter(
    (a) =>
      !query ||
      a.name.toLowerCase().includes(query.toLowerCase()),
  )

  const filteredUseCases = useCases.filter(
    (u) =>
      !query ||
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.category.toLowerCase().includes(query.toLowerCase()),
  )

  const filteredFrameworks = frameworks.filter(
    (f) =>
      !query ||
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.maintainer.toLowerCase().includes(query.toLowerCase()),
  )

  const filteredPages = staticPages.filter(
    (p) =>
      !query ||
      p.label.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()),
  )

  const hasResults =
    filteredQPUs.length > 0 ||
    filteredProviders.length > 0 ||
    filteredArchitectures.length > 0 ||
    filteredUseCases.length > 0 ||
    filteredFrameworks.length > 0 ||
    filteredPages.length > 0

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className="fixed inset-0 z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        />

        {/* Panel */}
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-[15vh] -translate-x-1/2 z-50',
            'w-full max-w-[560px] mx-4',
            'rounded-[var(--radius-xl)] border border-[var(--color-border-strong)]',
            'bg-[var(--color-bg-raised)] shadow-2xl overflow-hidden',
            'animate-fade-in',
          )}
          aria-label="Command palette"
        >
          <Command
            className="flex flex-col"
            shouldFilter={false}
            loop
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="text-[var(--color-text-muted)] shrink-0"
              >
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Search QPUs, providers, architectures..."
                className={cn(
                  'flex-1 bg-transparent text-sm text-[var(--color-text-primary)]',
                  'placeholder:text-[var(--color-text-faint)]',
                  'outline-none',
                )}
              />
              <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-[var(--color-text-faint)] border border-[var(--color-border)] rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <Command.List className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
              {!hasResults && (
                <Command.Empty className="py-12 text-center">
                  <p className="text-sm text-[var(--color-text-muted)]">No results for &ldquo;{query}&rdquo;</p>
                </Command.Empty>
              )}

              {/* QPUs */}
              {filteredQPUs.length > 0 && (
                <Command.Group>
                  <SectionHeader>QPUs</SectionHeader>
                  {filteredQPUs.slice(0, query ? 5 : 3).map((qpu) => (
                    <ResultItem
                      key={qpu.id}
                      icon={<ChipIcon />}
                      label={qpu.name}
                      category="QPU"
                      onSelect={() => navigate(`/qpus/${qpu.slug}`)}
                    />
                  ))}
                </Command.Group>
              )}

              {/* Providers */}
              {filteredProviders.length > 0 && (
                <Command.Group>
                  <SectionHeader>Providers</SectionHeader>
                  {filteredProviders.slice(0, query ? 5 : 3).map((p) => (
                    <ResultItem
                      key={p.id}
                      icon={<BuildingIcon />}
                      label={p.name}
                      category="Provider"
                      onSelect={() => navigate(`/providers/${p.slug}`)}
                    />
                  ))}
                </Command.Group>
              )}

              {/* Architectures */}
              {filteredArchitectures.length > 0 && (
                <Command.Group>
                  <SectionHeader>Architectures</SectionHeader>
                  {filteredArchitectures.slice(0, query ? 6 : 3).map((a) => (
                    <ResultItem
                      key={a.id}
                      icon={<AtomIcon />}
                      label={a.name}
                      category="Architecture"
                      onSelect={() => navigate(`/architectures/${a.slug}`)}
                    />
                  ))}
                </Command.Group>
              )}

              {/* Use Cases */}
              {filteredUseCases.length > 0 && (
                <Command.Group>
                  <SectionHeader>Use Cases</SectionHeader>
                  {filteredUseCases.slice(0, query ? 5 : 2).map((u) => (
                    <ResultItem
                      key={u.id}
                      icon={<FlaskIcon />}
                      label={u.name}
                      category="Use Case"
                      onSelect={() => navigate(`/use-cases/${u.slug}`)}
                    />
                  ))}
                </Command.Group>
              )}

              {/* Frameworks */}
              {filteredFrameworks.length > 0 && (
                <Command.Group>
                  <SectionHeader>Frameworks</SectionHeader>
                  {filteredFrameworks.slice(0, query ? 5 : 2).map((f) => (
                    <ResultItem
                      key={f.id}
                      icon={<CodeIcon />}
                      label={f.name}
                      category="Framework"
                      onSelect={() => navigate(`/frameworks/${f.slug}`)}
                    />
                  ))}
                </Command.Group>
              )}

              {/* Pages */}
              {filteredPages.length > 0 && (
                <Command.Group>
                  <SectionHeader>Pages</SectionHeader>
                  {filteredPages.map((p) => (
                    <ResultItem
                      key={p.href}
                      icon={<PageIcon />}
                      label={p.label}
                      category="Page"
                      onSelect={() => navigate(p.href)}
                    />
                  ))}
                </Command.Group>
              )}
            </Command.List>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2 border-t border-[var(--color-border)] bg-[var(--color-bg-base)]">
              <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--color-text-faint)]">
                <kbd className="border border-[var(--color-border)] rounded px-1 py-0.5">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--color-text-faint)]">
                <kbd className="border border-[var(--color-border)] rounded px-1 py-0.5">↵</kbd>
                open
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--color-text-faint)]">
                <kbd className="border border-[var(--color-border)] rounded px-1 py-0.5">ESC</kbd>
                close
              </span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
