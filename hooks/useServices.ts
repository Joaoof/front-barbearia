"use client"

import { useState, useEffect } from "react"
import { apiService, type Service } from "@/lib/api"

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true)
        const data = await apiService.getServices()
        setServices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar serviços")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return { services, loading, error }
}
