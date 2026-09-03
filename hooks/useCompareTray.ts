'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'qpu-compare-tray'
const MAX_ITEMS = 4

export interface CompareTrayState {
  items: string[]
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  has: (id: string) => boolean
  count: number
  isFull: boolean
}

export function useCompareTray(): CompareTrayState {
  const [items, setItems] = useState<string[]>([])

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setItems(parsed.slice(0, MAX_ITEMS))
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Persist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore write errors
    }
  }, [items])

  const add = useCallback((id: string) => {
    setItems(prev => {
      if (prev.includes(id) || prev.length >= MAX_ITEMS) return prev
      return [...prev, id]
    })
  }, [])

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item !== id))
  }, [])

  const clear = useCallback(() => {
    setItems([])
  }, [])

  const has = useCallback(
    (id: string) => items.includes(id),
    [items]
  )

  return {
    items,
    add,
    remove,
    clear,
    has,
    count: items.length,
    isFull: items.length >= MAX_ITEMS,
  }
}
