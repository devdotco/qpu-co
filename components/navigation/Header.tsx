'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, Menu, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Logo from './Logo'
import MegaMenu, { type MenuId } from './MegaMenu'
import MobileNav from './MobileNav'
import { useCompareTray } from '@/hooks/useCompareTray'

const NAV_ITEMS: { id: MenuId; label: string }[] = [
  { id: 'qpus', label: 'QPUs' },
  { id: 'technology', label: 'Technology' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'developers', label: 'Developers' },
  { id: 'intelligence', label: 'Intelligence' },
  { id: 'resources', label: 'Resources' },
]

const HEADER_HEIGHT = 60

interface HeaderProps {
  onSearchOpen?: () => void
  onMobileNavOpen?: () => void
}

export default function Header({ onSearchOpen, onMobileNavOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<MenuId>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const { count } = useCompareTray()

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mega menu on route change
  useEffect(() => {
    setActiveMenu(null)
    setMobileNavOpen(false)
  }, [pathname])

  // Escape key closes menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMenu(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 350)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const handleNavEnter = useCallback(
    (id: MenuId) => {
      cancelClose()
      setActiveMenu(id)
    },
    [cancelClose]
  )

  const handleHeaderLeave = useCallback(() => {
    scheduleClose()
  }, [scheduleClose])

  const handleHeaderEnter = useCallback(() => {
    cancelClose()
  }, [cancelClose])

  return (
    <>
      <header
        ref={headerRef}
        onMouseLeave={handleHeaderLeave}
        onMouseEnter={handleHeaderEnter}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
          'border-b border-transparent',
          scrolled && 'header-scrolled'
        )}
        style={{ height: HEADER_HEIGHT }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-4 lg:px-6">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {NAV_ITEMS.map(item => {
              const isActive = activeMenu === item.id
              return (
                <button
                  key={item.id}
                  onMouseEnter={() => handleNavEnter(item.id)}
                  onClick={() => setActiveMenu(isActive ? null : item.id)}
                  aria-expanded={isActive}
                  aria-controls={`mega-menu-${item.id}`}
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
                    isActive
                      ? 'text-[var(--color-text-primary)] bg-[var(--color-bg-panel)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-panel)]'
                  )}
                >
                  {item.label}
                  <ChevronDown
                    size={13}
                    className={cn(
                      'transition-transform duration-150',
                      isActive && 'rotate-180'
                    )}
                  />
                </button>
              )
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={onSearchOpen}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-panel)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              aria-label="Open search"
            >
              <Search size={15} />
            </button>

            {/* Compare */}
            <Link
              href="/compare"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-panel)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              Compare
              {count > 0 && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold bg-[var(--color-accent)] text-[var(--color-bg-base)]">
                  {count}
                </span>
              )}
            </Link>

            {/* Find a QPU CTA */}
            <Link
              href="/qpus"
              className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-bg-base)',
              }}
            >
              Find a QPU →
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => {
                setMobileNavOpen(true)
                onMobileNavOpen?.()
              }}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-panel)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              aria-label="Open navigation menu"
              aria-expanded={mobileNavOpen}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mega menu panel (desktop) */}
      <div className="hidden lg:block">
        <MegaMenu
          activeMenu={activeMenu}
          headerHeight={HEADER_HEIGHT}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        />
      </div>

      {/* Overlay to close mega menu when clicking outside */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-40 hidden lg:block"
          onClick={() => setActiveMenu(null)}
          aria-hidden="true"
        />
      )}

      {/* Mobile navigation drawer */}
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  )
}
