"use client"

import { useState, useEffect } from "react"
import { useAppointments } from "@/hooks/useAppointments"
import { useServices } from "@/hooks/useServices"
import { useOffers } from "@/hooks/useOffers"
import { apiService, type Schedule } from "@/lib/api"
import { Settings } from "lucide-react"

// Components
import { MobileHeader } from "@/components/mobile/mobile-header"
import { ScheduleSection } from "@/components/mobile/schedule-section"
import { NextAppointment } from "@/components/mobile/next-appointment"
import { OffersSection } from "@/components/mobile/offers-section"
import { ServicesSection } from "@/components/mobile/services-section"
import { BottomNavigation } from "@/components/mobile/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop/desktop-sidebar"
import { Button } from "@/components/ui/button"

export default function BarbershopApp() {
  const [isMobile, setIsMobile] = useState(false)
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [showNotification, setShowNotification] = useState(false)

  // Mock user data - replace with real authentication
  const userId = "user-123"
  const userName = "João"
  const userAvatar = "/images/jardel-profile.jpg"

  const { nextAppointment, loading: appointmentsLoading } = useAppointments(userId)
  const { services, loading: servicesLoading } = useServices()
  const { offers, loading: offersLoading } = useOffers()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const scheduleData = await apiService.getSchedule()
        setSchedule(scheduleData)
      } catch (error) {
        // Fallback schedule
        setSchedule({
          weekdays: { open: "8h", close: "19h" },
          saturday: { open: "8h", close: "17h" },
          isOpen: true,
        })
      }
    }

    fetchSchedule()
  }, [])

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  if (isMobile) {
    // Mobile: Layout original ocupando 100% da tela
    return (
      <div className="min-h-screen bg-gray-900 text-white w-full">
        <MobileHeader userName={userName} userAvatar={userAvatar} currentDate={currentDate} />

        {schedule && <ScheduleSection schedule={schedule} />}

        <NextAppointment appointment={nextAppointment} loading={appointmentsLoading} />

        <OffersSection offers={offers} loading={offersLoading} />

        <ServicesSection services={services} loading={servicesLoading} />

        <BottomNavigation />
      </div>
    )
  }

  // Desktop: Sidebar + conteúdo expandido em colunas
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar à esquerda */}
      <DesktopSidebar userName={userName} userAvatar={userAvatar} />

      {/* Conteúdo principal expandido */}
      <div className="flex-1 flex">
        {/* Coluna principal - conteúdo igual ao mobile */}
        <div className="flex-1 bg-gray-900">
          <MobileHeader userName={userName} userAvatar={userAvatar} currentDate={currentDate} showStatusBar={false} />

          {/* Settings toggle for expanded view */}
          <div className="px-4 pb-4 border-b border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowNotification(true)
                setTimeout(() => setShowNotification(false), 5000) // Auto-hide após 5 segundos
              }}
              className="text-gray-400 hover:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Ver Informações Detalhadas
            </Button>
          </div>

          {/* Notificação estilo toast */}
          {showNotification && (
            <div className="fixed top-4 right-4 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 animate-in slide-in-from-right duration-300">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">📊 Informações Detalhadas</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotification(false)}
                  className="text-gray-400 hover:text-white h-6 w-6 p-0"
                >
                  ✕
                </Button>
              </div>

              <div className="p-4 space-y-3">
                {/* Estatísticas em formato de notificação */}
                <div className="bg-gray-700 rounded p-3">
                  <p className="text-xs text-gray-400 mb-1">Resumo do Mês</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">12 agendamentos</span>
                    <span className="text-green-400 font-semibold">R$ 480,00</span>
                  </div>
                </div>

                {/* Próximos agendamentos */}
                <div className="bg-gray-700 rounded p-3">
                  <p className="text-xs text-gray-400 mb-1">Próximos Agendamentos</p>
                  <p className="text-sm text-blue-400 font-semibold">3 agendamentos marcados</p>
                </div>

                {/* Barbeiro favorito */}
                <div className="bg-gray-700 rounded p-3">
                  <p className="text-xs text-gray-400 mb-1">Barbeiro Favorito</p>
                  <p className="text-sm text-white font-semibold">👨‍💼 Jardel</p>
                </div>
              </div>
            </div>
          )}

          {schedule && <ScheduleSection schedule={schedule} />}
          <NextAppointment appointment={nextAppointment} loading={appointmentsLoading} />
          <OffersSection offers={offers} loading={offersLoading} />
          <ServicesSection services={services} loading={servicesLoading} />

          {/* Espaço para bottom navigation no desktop */}
          <div className="h-20"></div>
        </div>
      </div>
    </div>
  )
}
