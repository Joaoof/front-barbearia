"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Lock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { Appointment } from "@/lib/api"

interface NextAppointmentProps {
  appointment?: Appointment
  loading?: boolean
}

export function NextAppointment({ appointment, loading }: NextAppointmentProps) {
  const { isGuest } = useAuth()

  if (loading) {
    return (
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-medium">Seu próximo horário</h2>
          <span className="text-gray-400 text-sm">Ver mais</span>
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isGuest) {
    return (
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-medium">Seu próximo horário</h2>
          <span className="text-gray-400 text-sm">Ver mais</span>
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Lock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">Faça login para ver seus agendamentos</p>
                <p className="text-gray-500 text-sm">Entre na sua conta ou crie uma nova</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-medium">Seu próximo horário</h2>
          <span className="text-gray-400 text-sm">Ver mais</span>
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <p className="text-gray-400 text-center">Nenhum agendamento encontrado</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-medium">Seu próximo horário</h2>
        <span className="text-gray-400 text-sm">Ver mais</span>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={appointment.barber.avatar || "/placeholder.svg"} />
              <AvatarFallback>{appointment.barber.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-white font-medium">{appointment.barber.name}</h3>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                <Clock className="w-4 h-4" />
                <span>{appointment.time}</span>
                <Badge className="bg-green-600 hover:bg-green-600 text-white text-xs ml-2">
                  {appointment.status === "scheduled" ? "Agendado" : appointment.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
