"use client"

import { useState, useEffect } from "react"
import { apiService, type Offer } from "@/lib/api"

export function useOffers() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOffers() {
      try {
        setLoading(true)
        const data = await apiService.getOffers()
        setOffers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar ofertas")
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  return { offers, loading, error }
}
