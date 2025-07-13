"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, ChevronDown, Star } from "lucide-react"
import { BottomNavigation } from "@/components/mobile/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop/desktop-sidebar"

interface Appointment {
  id: string
  barberName: string
  barberAvatar: string
  date: string
  time: string
  status: "scheduled" | "completed" | "cancelled"
  rating?: number
}

export default function AgendamentosPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("Período")
  const [selectedStatus, setSelectedStatus] = useState("Situação")
  const [selectedBarber, setSelectedBarber] = useState("Barbeiro")

  // Mock user data
  const userName = "João"
  const userAvatar = "/images/jardel-profile.jpg"

  // Mock data - dados mockados como solicitado
  const mockAppointments: Appointment[] = [
    {
      id: "1",
      barberName: "Jardel",
      barberAvatar: "/images/jardel-profile.jpg",
      date: "Terça, 24 de Maio",
      time: "10:00",
      status: "scheduled",
    },
    {
      id: "2",
      barberName: "Jardel",
      barberAvatar: "/images/jardel-profile.jpg",
      date: "Terça, 29 de Abril",
      time: "10:00",
      status: "completed",
      rating: 5.0,
    },
    {
      id: "3",
      barberName: "Jardel",
      barberAvatar: "/images/jardel-profile.jpg",
      date: "Segunda, 14 de Abril",
      time: "10:00",
      status: "completed",
      rating: 5.0,
    },
  ]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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
        <div className="p-4 space-y-4 w-full">
          <div className="flex gap-2 w-full">
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
        <div className="px-4 pb-20 w-full">
          {Object.entries(groupedAppointments).map(([month, appointments]) => (
            <div key={month} className="mb-6 w-full">
              <h2 className="text-white font-medium mb-3">{month}</h2>
              <div className="space-y-3 w-full">
                {appointments.map((appointment) => (
                  <Card key={appointment.id} className="bg-gray-800 border-gray-700 w-full">
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

  // Desktop: Página completa com sidebar
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar à esquerda */}
      <DesktopSidebar userName={userName} userAvatar={userAvatar} />

      {/* Conteúdo principal */}
      <div className="flex-1 bg-gray-900">
        {/* Header da página */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">Agendamentos</h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie seus agendamentos</p>
        </div>

        {/* Filtros */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex gap-4">
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

        {/* Conteúdo dos agendamentos como notificações */}
        <div className="p-6">
          <div className="space-y-4 max-w-2xl">
            {Object.entries(groupedAppointments).map(([month, appointments]) => (
              <div key={month} className="bg-gray-800 border border-gray-600 rounded-lg p-4 flex items-start gap-4">
                {/* Ícone de data */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Conteúdo da notificação */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg">{month}</h3>
                    <Badge className="bg-gray-700 text-gray-300 hover:bg-gray-700">
                      {appointments.length} agendamento{appointments.length > 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {/* Lista compacta dos agendamentos */}
                  <div className="space-y-2">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center gap-3 p-2 bg-gray-700 rounded">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={appointment.barberAvatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{appointment.barberName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-white text-sm font-medium">{appointment.barberName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs">{appointment.time}</span>
                              <Badge className={`${getStatusColor(appointment.status)} text-xs px-2 py-1`}>
                                {getStatusText(appointment.status)}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-400 text-xs">{appointment.date}</span>
                            {appointment.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-yellow-500 text-xs">{appointment.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
