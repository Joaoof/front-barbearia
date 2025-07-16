"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, ChevronDown, Star, X } from "lucide-react"
import { BottomNavigation } from "@/components/mobile/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop/desktop-sidebar"
import { useApp } from "@/contexts/app-context"

export default function AgendamentosPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("Período")
  const [selectedStatus, setSelectedStatus] = useState("Situação")
  const [selectedBarber, setSelectedBarber] = useState("Barbeiro")

  const { appointments, cancelAppointment, userName } = useApp()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Agrupar agendamentos por mês
  const groupedAppointments = appointments.reduce(
    (groups, appointment) => {
      const date = new Date(appointment.date)
      const month = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
      if (!groups[month]) {
        groups[month] = []
      }
      groups[month].push(appointment)
      return groups
    },
    {} as Record<string, typeof appointments>,
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
      cancelAppointment(appointmentId)
    }
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white w-full overflow-x-hidden">
        {/* Header com filtros */}
        <div className="p-4 space-y-4 w-full">
          <div className="flex gap-2 w-full overflow-x-auto">
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 flex-shrink-0"
            >
              {selectedPeriod}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 flex-shrink-0"
            >
              {selectedStatus}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 flex-shrink-0"
            >
              {selectedBarber}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Lista de agendamentos agrupados por mês */}
        <div className="px-4 pb-20 w-full">
          {Object.entries(groupedAppointments).map(([month, monthAppointments]) => (
            <div key={month} className="mb-6 w-full">
              <h2 className="text-white font-medium mb-3 capitalize">{month}</h2>
              <div className="space-y-3 w-full">
                {monthAppointments.map((appointment) => (
                  <Card key={appointment.id} className="bg-gray-800 border-gray-700 w-full">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="/images/perfil-padrao.jpg" alt={appointment.barber.name} />
                          <AvatarFallback className="bg-blue-600 text-white font-semibold">
                            {appointment.barber.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-white font-medium">{appointment.barber.name}</h3>
                            <div className="flex items-center gap-2">
                              {appointment.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="text-white text-sm">{appointment.rating}</span>
                                </div>
                              )}
                              {appointment.status === "scheduled" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-6 h-6 text-red-400 hover:text-red-300"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mb-1">{appointment.service.name}</p>
                          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>{appointment.time}</span>
                              <span className="text-green-400 font-medium">
                                R$ {appointment.service.price.toFixed(2)}
                              </span>
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

          {appointments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhum agendamento encontrado</p>
              <p className="text-gray-500 text-sm mt-1">Faça seu primeiro agendamento!</p>
            </div>
          )}
        </div>

        <BottomNavigation />
      </div>
    )
  }

  // Desktop: Página completa com sidebar fixa
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DesktopSidebar userName={userName} />

      <div className="ml-64 min-h-screen bg-gray-900">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">Agendamentos</h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie seus agendamentos</p>
        </div>

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

        <div className="p-6">
          <div className="space-y-4 max-w-2xl">
            {Object.entries(groupedAppointments).map(([month, monthAppointments]) => (
              <div key={month} className="bg-gray-800 border border-gray-600 rounded-lg p-4 flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg capitalize">{month}</h3>
                    <Badge className="bg-gray-700 text-gray-300 hover:bg-gray-700">
                      {monthAppointments.length} agendamento{monthAppointments.length > 1 ? "s" : ""}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {monthAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center gap-3 p-2 bg-gray-700 rounded">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/images/perfil-padrao.jpg" alt={appointment.barber.name} />
                          <AvatarFallback className="text-xs bg-blue-600 text-white font-semibold">
                            {appointment.barber.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-white text-sm font-medium">{appointment.barber.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs">{appointment.time}</span>
                              <Badge className={`${getStatusColor(appointment.status)} text-xs px-2 py-1`}>
                                {getStatusText(appointment.status)}
                              </Badge>
                              {appointment.status === "scheduled" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-5 h-5 text-red-400 hover:text-red-300 p-0"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-400 text-xs">{appointment.service.name}</span>
                            <span className="text-green-400 text-xs font-medium">
                              R$ {appointment.service.price.toFixed(2)}
                            </span>
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

            {appointments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">Nenhum agendamento encontrado</p>
                <p className="text-gray-500 text-sm mt-1">Faça seu primeiro agendamento!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
