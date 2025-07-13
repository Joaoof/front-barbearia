"use client"

import { useState, useEffect } from "react"
import { apiService, type Appointment } from "@/lib/api"

export function useAppointments(userId: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true)
        const data = await apiService.getUserAppointments(userId)
        setAppointments(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar agendamentos")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchAppointments()
    }
  }, [userId])

  const nextAppointment = appointments
    .filter((apt) => apt.status === "scheduled")
    .sort((a, b) => new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime())[0]

  return {
    appointments,
    nextAppointment,
    loading,
    error,
    refetch: () => {
      if (userId) {
        setLoading(true)
        apiService
          .getUserAppointments(userId)
          .then(setAppointments)
          .catch((err) => setError(err.message))
          .finally(() => setLoading(false))
      }
    },
  }
}
