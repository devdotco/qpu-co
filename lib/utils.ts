import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ArchitectureType, QPUStatus, SuitabilityLevel } from '../types'

// ── Class Name Utility ────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ── Formatting ────────────────────────────────────────────────────────────────

/**
 * Format a physical qubit count for display.
 * Returns "Unknown" for null, abbreviates large numbers (e.g., 5627 → "5,627").
 */
export function formatQubits(n: number | null | undefined): string {
  if (n === null || n === undefined) return 'Unknown'
  return n.toLocaleString('en-US')
}

/**
 * Format an ISO date string to a human-readable date.
 * Returns "Unknown" for empty or invalid input.
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Unknown'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'Unknown'
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format an ISO date string to a short form (e.g., "Nov 2021").
 */
export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Unknown'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'Unknown'
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

// ── Label Functions ───────────────────────────────────────────────────────────

export function architectureLabel(arch: ArchitectureType): string {
  const labels: Record<ArchitectureType, string> = {
    'superconducting': 'Superconducting',
    'trapped-ion': 'Trapped Ion',
    'neutral-atom': 'Neutral Atom',
    'photonic': 'Photonic',
    'quantum-annealing': 'Quantum Annealing',
    'topological': 'Topological',
  }
  return labels[arch] ?? arch
}

export function statusLabel(status: QPUStatus): string {
  const labels: Record<QPUStatus, string> = {
    'public': 'Public',
    'cloud': 'Cloud Access',
    'reservation': 'By Reservation',
    'private': 'Private',
    'research': 'Research Only',
    'announced': 'Announced',
    'retired': 'Retired',
    'offline': 'Offline',
  }
  return labels[status] ?? status
}

export function suitabilityLabel(s: SuitabilityLevel): string {
  const labels: Record<SuitabilityLevel, string> = {
    'strong': 'Strong Fit',
    'possible': 'Possible',
    'experimental': 'Experimental',
    'limited': 'Limited',
    'unknown': 'Unknown',
  }
  return labels[s] ?? s
}

// ── Tailwind Color Classes ────────────────────────────────────────────────────

/**
 * Returns a Tailwind CSS badge/pill color class for a QPU status.
 * These classes must be present in the final CSS bundle (not dynamically constructed).
 */
export function statusColor(status: QPUStatus): string {
  const colors: Record<QPUStatus, string> = {
    'public': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    'cloud': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'reservation': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
    'private': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    'research': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    'announced': 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
    'retired': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'offline': 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400',
  }
  return colors[status] ?? 'bg-slate-100 text-slate-800'
}

/**
 * Returns a Tailwind CSS color class for a suitability level.
 */
export function suitabilityColor(s: SuitabilityLevel): string {
  const colors: Record<SuitabilityLevel, string> = {
    'strong': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    'possible': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'experimental': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    'limited': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'unknown': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  }
  return colors[s] ?? 'bg-slate-100 text-slate-600'
}

/**
 * Returns an architecture background color class (for accent dots, chips, etc.)
 */
export function architectureColor(arch: ArchitectureType): string {
  const colors: Record<ArchitectureType, string> = {
    'superconducting': 'bg-blue-500',
    'trapped-ion': 'bg-violet-500',
    'neutral-atom': 'bg-emerald-500',
    'photonic': 'bg-amber-500',
    'quantum-annealing': 'bg-orange-500',
    'topological': 'bg-pink-500',
  }
  return colors[arch] ?? 'bg-slate-500'
}

// ── Slugification ─────────────────────────────────────────────────────────────

/**
 * Convert a string to a URL-safe slug.
 * e.g., "IBM Eagle r1" → "ibm-eagle-r1"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Misc ──────────────────────────────────────────────────────────────────────

/**
 * Pluralize a word based on count.
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`)
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Safely get a value or return a fallback.
 */
export function fallback<T>(value: T | null | undefined, def: T): T {
  return value !== null && value !== undefined ? value : def
}
