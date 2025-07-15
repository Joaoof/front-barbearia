"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, DollarSign, Users, Scissors, TrendingUp, Clock, Star, BarChart3, Settings, Plus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useApp } from "@/contexts/app-context"

export function BarbershopDashboard() {
  const { user } = useAuth()
  const { appointments, barbers, services } = useApp()
  const [selectedPeriod, setSelectedPeriod] = useState("today")

  // Estatísticas calculadas
  const todayAppointments = appointments.filter((apt) => {
    const today = new Date().toISOString().split("T")[0]
    return apt.date === today
  })

  const monthlyRevenue = appointments
    .filter((apt) => apt.status === "completed")
    .reduce((sum, apt) => sum + apt.service.price, 0)

  const completionRate =
    appointments.length > 0
      ? (appointments.filter((apt) => apt.status === "completed").length / appointments.length) * 100
      : 0

  const avgRating = appointments
    .filter((apt) => apt.rating)
    .reduce((sum, apt, _, arr) => sum + (apt.rating || 0) / arr.length, 0)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Administrativo</h1>
            <p className="text-gray-400">Barbearia Central - Visão Geral</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-gray-800 border-gray-600 text-white">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filtros de Período */}
        <div className="flex gap-2 mb-6">
          {["today", "week", "month"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={
                selectedPeriod === period
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              }
            >
              {period === "today" && "Hoje"}
              {period === "week" && "Esta Semana"}
              {period === "month" && "Este Mês"}
            </Button>
          ))}
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Agendamentos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{todayAppointments.length}</div>
              <p className="text-xs text-gray-400">+12% em relação a ontem</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">R$ {monthlyRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-400">+8% em relação ao mês passado</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Taxa de Conclusão</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{completionRate.toFixed(1)}%</div>
              <p className="text-xs text-gray-400">+2% em relação à semana passada</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Avaliação Média</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{avgRating.toFixed(1)}</div>
              <p className="text-xs text-gray-400">
                Baseado em {appointments.filter((apt) => apt.rating).length} avaliações
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agendamentos de Hoje */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Agendamentos de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/images/jardel-profile.jpg" />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {appointment.clientName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-white font-medium">{appointment.clientName}</p>
                      <p className="text-gray-400 text-sm">{appointment.service.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{appointment.time}</p>
                      <Badge
                        className={
                          appointment.status === "scheduled"
                            ? "bg-blue-600"
                            : appointment.status === "completed"
                              ? "bg-green-600"
                              : "bg-red-600"
                        }
                      >
                        {appointment.status === "scheduled"
                          ? "Agendado"
                          : appointment.status === "completed"
                            ? "Concluído"
                            : "Cancelado"}
                      </Badge>
                    </div>
                  </div>
                ))}
                {todayAppointments.length === 0 && (
                  <p className="text-gray-400 text-center py-4">Nenhum agendamento para hoje</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance dos Barbeiros */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Performance dos Barbeiros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {barbers.map((barber) => {
                  const barberAppointments = appointments.filter((apt) => apt.barberId === barber.id)
                  const revenue = barberAppointments
                    .filter((apt) => apt.status === "completed")
                    .reduce((sum, apt) => sum + apt.service.price, 0)

                  return (
                    <div key={barber.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={barber.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-600 text-white">{barber.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-white font-medium">{barber.name}</p>
                        <p className="text-gray-400 text-sm">{barberAppointments.length} agendamentos</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-medium">R$ {revenue.toFixed(2)}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-yellow-500 text-sm">{barber.rating}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Serviços Mais Populares */}
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Serviços Mais Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.slice(0, 3).map((service) => {
                const serviceAppointments = appointments.filter((apt) => apt.serviceId === service.id)
                const percentage =
                  appointments.length > 0 ? (serviceAppointments.length / appointments.length) * 100 : 0

                return (
                  <div key={service.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{service.name}</h3>
                      <Scissors className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{serviceAppointments.length} agendamentos</p>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <p className="text-blue-400 text-sm mt-2">{percentage.toFixed(1)}% do total</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
