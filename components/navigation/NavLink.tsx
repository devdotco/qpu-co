'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  exact?: boolean
}

export default function NavLink({ href, children, className, exact = false }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={cn(
        'relative text-sm font-medium transition-colors duration-150',
        'hover:text-[var(--color-text-primary)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm',
        isActive
          ? 'text-[var(--color-text-primary)] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-px after:bg-[var(--color-accent)]'
          : 'text-[var(--color-text-secondary)]',
        className
      )}
    >
      {children}
    </Link>
  )
}

interface NavAnchorProps {
  href: string
  children: React.ReactNode
  className?: string
}

/**
 * Plain anchor inside mega-menus (no active-state logic needed).
 */
export function NavAnchor({ href, children, className }: NavAnchorProps) {
  return (
    <Link
      href={href}
      className={cn(
        'block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm',
        className
      )}
    >
      {children}
    </Link>
  )
}
