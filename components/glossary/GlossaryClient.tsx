'use client'

import { useState, useMemo, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GlossaryTerm {
  letter: string
  term: string
  definition: string
  seeAlso?: string[]
}

interface GlossaryClientProps {
  terms: GlossaryTerm[]
}

// All unique first letters
function getLetters(terms: GlossaryTerm[]): string[] {
  return [...new Set(terms.map((t) => t.letter))].sort()
}

export function GlossaryClient({ terms }: GlossaryClientProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return terms
    const q = query.toLowerCase()
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q),
    )
  }, [query, terms])

  // Group filtered terms by letter
  const grouped = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {}
    for (const term of filtered) {
      if (!map[term.letter]) map[term.letter] = []
      map[term.letter].push(term)
    }
    return map
  }, [filtered])

  const presentLetters = Object.keys(grouped).sort()
  const allLetters = getLetters(terms)

  function clearSearch() {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div>
      {/* Search bar */}
      <div className="relative max-w-md mb-6">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms and definitions…"
          className="w-full pl-9 pr-8 py-2.5 text-sm bg-[var(--color-bg-panel)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-2 focus:outline-[var(--color-accent)] focus:border-transparent"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
            aria-label="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Alphabetical jump links */}
      {!query && (
        <nav aria-label="Jump to letter" className="flex flex-wrap gap-1 mb-8">
          {allLetters.map((letter) => {
            const isPresent = presentLetters.includes(letter)
            return (
              <a
                key={letter}
                href={`#glossary-${letter}`}
                className={cn(
                  'w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-xs font-mono font-semibold transition-colors',
                  isPresent
                    ? 'text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
                    : 'text-[var(--color-text-faint)] cursor-default',
                )}
                aria-disabled={!isPresent}
                tabIndex={isPresent ? 0 : -1}
              >
                {letter}
              </a>
            )
          })}
        </nav>
      )}

      {/* Results count when searching */}
      {query && (
        <p className="text-xs text-[var(--color-text-muted)] mb-6 font-mono">
          {filtered.length} term{filtered.length !== 1 ? 's' : ''} matching &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Terms */}
      {presentLetters.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)]">No terms match your search.</p>
      ) : (
        <div className="space-y-10">
          {presentLetters.map((letter) => (
            <section key={letter} id={`glossary-${letter}`} className="scroll-mt-20">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-2xl font-bold text-[var(--color-accent)]">
                  {letter}
                </span>
                <div className="h-px flex-1 bg-[var(--color-border)]" />
              </div>
              <dl className="space-y-5">
                {grouped[letter].map((item) => (
                  <div
                    key={item.term}
                    id={`term-${item.term.toLowerCase().replace(/\s+/g, '-')}`}
                    className="scroll-mt-20 pl-4 border-l-2 border-[var(--color-border)]"
                  >
                    <dt className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                      {item.term}
                    </dt>
                    <dd className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {item.definition}
                      {item.seeAlso && item.seeAlso.length > 0 && (
                        <span className="block mt-1.5 text-xs text-[var(--color-text-muted)]">
                          See also:{' '}
                          {item.seeAlso.map((ref, i) => (
                            <span key={ref}>
                              <a
                                href={`#term-${ref.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-[var(--color-accent)] hover:underline"
                              >
                                {ref}
                              </a>
                              {i < (item.seeAlso?.length ?? 0) - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
