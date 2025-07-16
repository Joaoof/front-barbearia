"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, ChevronDown, Star } from "lucide-react"
import { BottomNavigation } from "@/components/mobile/bottom-navigation"

interface Appointment {
  id: string
  barberName: string
  barberAvatar: string
  date: string
  time: string
  status: "scheduled" | "completed" | "cancelled"
  rating?: number
}

interface AppointmentsScreenProps {
  isMobile?: boolean
  onClose?: () => void
  isFullPage?: boolean
}

export function AppointmentsScreen({ isMobile = false, onClose, isFullPage = false }: AppointmentsScreenProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("Período")
  const [selectedStatus, setSelectedStatus] = useState("Situação")
  const [selectedBarber, setSelectedBarber] = useState("Barbeiro")

  // Mock data - dados mockados como solicitado
  const mockAppointments: Appointment[] = [
    {
      id: "1",
      barberName: "Jardel",
      barberAvatar: "/images/barbeiro1.jpg",
      date: "Terça, 24 de Maio",
      time: "10:00",
      status: "scheduled",
    },
    {
      id: "2",
      barberName: "Marcus",
      barberAvatar: "/images/barbeiro2.jpg",
      date: "Terça, 29 de Abril",
      time: "10:00",
      status: "completed",
      rating: 5.0,
    },
    {
      id: "3",
      barberName: "Natan",
      barberAvatar: "/images/barbeiro3.jpg",
      date: "Segunda, 14 de Abril",
      time: "10:00",
      status: "completed",
      rating: 5.0,
    },
  ]

  // Agrupar agendamentos por mês
  const groupedAppointments = mockAppointments.reduce(
    (groups, appointment) => {
      const month = appointment.date.includes("Maio") ? "Maio" : "Abril"
      if (!groups[month]) {
        groups[month] = []
      }
      groups[month].push(appointment)
      return groups
    },
    {} as Record<string, Appointment[]>,
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-600 hover:bg-blue-600 text-white"
      case "completed":
        return "bg-green-600 hover:bg-green-600 text-white"
      case "cancelled":
        return "bg-red-600 hover:bg-red-600 text-white"
      default:
        return "bg-gray-600 hover:bg-gray-600 text-white"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendado"
      case "completed":
        return "Concluído"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white w-full">
        {/* Header com filtros */}
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              {selectedPeriod}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              {selectedStatus}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              {selectedBarber}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Lista de agendamentos agrupados por mês */}
        <div className="px-4 pb-20">
          {Object.entries(groupedAppointments).map(([month, appointments]) => (
            <div key={month} className="mb-6">
              <h2 className="text-white font-medium mb-3">{month}</h2>
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <Card key={appointment.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={appointment.barberAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{appointment.barberName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-white font-medium">{appointment.barberName}</h3>
                            {appointment.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-white text-sm">{appointment.rating}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>{appointment.time}</span>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusText(appointment.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <BottomNavigation />
      </div>
    )
  }

  if (!isMobile && isFullPage) {
    return (
      <div className="flex-1 bg-gray-900 text-white">
        {/* Header da página */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">Agendamentos</h1>
        </div>

        {/* Filtros */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex gap-4">{/* Filtros aqui */}</div>
        </div>

        {/* Conteúdo dos agendamentos */}
        <div className="p-6">{/* Lista de agendamentos */}</div>
      </div>
    )
  }

  // Desktop: Painel de notificação expandido
  return (
    <div className="fixed top-4 right-4 w-96 max-h-[80vh] bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-white">📅 Meus Agendamentos</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white h-6 w-6 p-0">
          ✕
        </Button>
      </div>

      {/* Filtros compactos */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 text-xs"
          >
            Período
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 text-xs"
          >
            Status
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* Lista de agendamentos scrollável */}
      <div className="overflow-y-auto max-h-96">
        <div className="p-4 space-y-4">
          {Object.entries(groupedAppointments).map(([month, appointments]) => (
            <div key={month}>
              <h4 className="text-white font-medium mb-2 text-sm">{month}</h4>
              <div className="space-y-2">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gray-700 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={appointment.barberAvatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">{appointment.barberName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium">{appointment.barberName}</span>
                          {appointment.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-white text-xs">{appointment.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">{appointment.date}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{appointment.time}</span>
                      <Badge className={`${getStatusColor(appointment.status)} text-xs px-2 py-1`}>
                        {getStatusText(appointment.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
