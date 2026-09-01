'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type BookingRequest = { serviceId?: string; token: number }

type BookingContextValue = {
  request: BookingRequest | null
  requestBooking: (serviceId?: string) => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<BookingRequest | null>(null)

  const requestBooking = useCallback((serviceId?: string) => {
    setRequest({ serviceId, token: Date.now() })
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.href = `/#reservar`
      return
    }
    document.getElementById('reservar')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const value = useMemo(() => ({ request, requestBooking }), [request, requestBooking])

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
