"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/contexts/app-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Settings } from "lucide-react"
import { UserRole } from "@/types/roles"

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
  const [showNotification, setShowNotification] = useState(false)
  const router = useRouter()

  const { appointments, services } = useApp()
  const { isGuest, user } = useAuth()

  // Mock schedule data
  const schedule = {
    weekdays: { open: "8h", close: "19h" },
    saturday: { open: "8h", close: "17h" },
    isOpen: true,
  }

  // Mock offers data
  const offers = [
    {
      id: "1",
      title: "Corte + Barba",
      description: "Pacote completo com desconto especial",
      discount: 20,
      image: "/images/barber-offer.jpg",
      validUntil: "2024-12-31",
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

  // Redirect based on user role
  useEffect(() => {
    if (user && !isGuest) {
      if (user.role === UserRole.SUPER_ADMIN) {
        router.push("/super-admin")
        return
      }
      if (user.role === UserRole.BARBER_ADMIN) {
        router.push("/admin")
        return
      }
    }
  }, [user, isGuest, router])

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  // Get next appointment only if user is authenticated
  const nextAppointment = !isGuest
    ? appointments
        .filter((apt) => apt.status === "scheduled")
        .sort((a, b) => new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime())[0]
    : undefined

  if (isMobile) {
    // Mobile: Layout original ocupando 100% da tela sem bordas
    return (
      <div className="min-h-screen bg-gray-900 text-white w-full overflow-x-hidden">
        <MobileHeader currentDate={currentDate} />

        <ScheduleSection schedule={schedule} />

        <NextAppointment appointment={nextAppointment} />

        <OffersSection offers={offers} />

        <ServicesSection services={services} />

        <BottomNavigation />
      </div>
    )
  }

  // Desktop: Sidebar fixa + conteúdo com margem
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar fixa */}
      <DesktopSidebar />

      {/* Conteúdo principal com margem para a sidebar */}
      <div className="ml-64 min-h-screen">
        <div className="bg-gray-900">
          <MobileHeader currentDate={currentDate} showStatusBar={false} />

          {/* Settings toggle for expanded view */}
          <div className="px-4 pb-4 border-b border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowNotification(true)
                setTimeout(() => setShowNotification(false), 5000)
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
                {!isGuest ? (
                  <>
                    <div className="bg-gray-700 rounded p-3">
                      <p className="text-xs text-gray-400 mb-1">Resumo do Mês</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{appointments.length} agendamentos</span>
                        <span className="text-green-400 font-semibold">
                          R$ {appointments.reduce((sum, apt) => sum + apt.service.price, 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-700 rounded p-3">
                      <p className="text-xs text-gray-400 mb-1">Próximos Agendamentos</p>
                      <p className="text-sm text-blue-400 font-semibold">
                        {appointments.filter((apt) => apt.status === "scheduled").length} agendamentos marcados
                      </p>
                    </div>

                    <div className="bg-gray-700 rounded p-3">
                      <p className="text-xs text-gray-400 mb-1">Barbeiro Favorito</p>
                      <p className="text-sm text-white font-semibold">👨‍💼 Jardel</p>
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-700 rounded p-3 text-center">
                    <p className="text-sm text-gray-400">Faça login para ver suas estatísticas</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <ScheduleSection schedule={schedule} />
          <NextAppointment appointment={nextAppointment} />
          <OffersSection offers={offers} />
          <ServicesSection services={services} />

          <div className="h-20"></div>
        </div>
      </div>
    </div>
  )
}
