"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Heart, Star } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { BookingFlow } from "./booking-flow"
import Image from "next/image"

interface BarberSelectionProps {
  isOpen: boolean
  onClose: () => void
  onSelectBarber?: (barber: any) => void
}

export function BarberSelection({ isOpen, onClose, onSelectBarber }: BarberSelectionProps) {
  const { barbers } = useApp()
  const [favorites, setFavorites] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [showBookingFlow, setShowBookingFlow] = useState(false)
  const [selectedBarber, setSelectedBarber] = useState<any>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleFavorite = (barberId: string) => {
    setFavorites((prev) => (prev.includes(barberId) ? prev.filter((id) => id !== barberId) : [...prev, barberId]))
  }

  const handleSelectBarber = (barber: any) => {
    setSelectedBarber(barber)
    setShowBookingFlow(true)
    // NÃO chamar onClose() aqui para não voltar à tela inicial
    if (onSelectBarber) {
      onSelectBarber(barber)
    }
  }

  if (!isOpen && !showBookingFlow) return null

  if (showBookingFlow) {
    return (
      <BookingFlow
        isOpen={showBookingFlow}
        onClose={() => {
          setShowBookingFlow(false)
          setSelectedBarber(null)
          onClose() // Só fechar quando terminar o fluxo completo
        }}
        selectedBarber={selectedBarber}
      />
    )
  }

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-gray-900">
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-4 mb-6">
          <h1 className="text-white text-2xl font-bold mb-2">Selecione um barbeiro</h1>
          <p className="text-gray-400 text-sm">Escolha um barbeiro de sua preferência.</p>
        </div>

        {/* Carrossel de barbeiros - sem scroll horizontal */}
        <div className="px-4 h-full overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide h-full">
            {barbers.map((barber, index) => (
              <div
                key={barber.id}
                className="flex-shrink-0 w-full max-w-xs snap-center animate-in slide-in-from-right duration-500"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Card
                  className="bg-gray-800 border-gray-700 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 h-96"
                  onClick={() => handleSelectBarber(barber)}
                >
                  <CardContent className="p-0 relative h-full">
                    <div className="relative h-full w-full">
                      <Image
                        src={barber.avatar || "/placeholder.svg"}
                        alt={barber.name}
                        fill
                        className="object-cover"
                        sizes="320px"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(barber.id)
                        }}
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${favorites.includes(barber.id) ? "text-red-500 fill-current" : "text-white"}`}
                        />
                      </Button>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-xl font-bold mb-1">{barber.name}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-yellow-500 text-sm font-medium">{barber.rating}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {barber.specialties.slice(0, 2).map((specialty) => (
                            <span key={specialty} className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Desktop
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Selecione um barbeiro</h1>
            <p className="text-gray-400">Escolha um barbeiro de sua preferência.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {barbers.map((barber) => (
            <Card
              key={barber.id}
              className="bg-gray-700 border-gray-600 overflow-hidden cursor-pointer hover:bg-gray-650"
              onClick={() => handleSelectBarber(barber)}
            >
              <CardContent className="p-0 relative">
                <div className="relative h-48 w-full">
                  <Image
                    src={barber.avatar || "/placeholder.svg"}
                    alt={barber.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(barber.id)
                    }}
                  >
                    <Heart
                      className={`w-4 h-4 ${favorites.includes(barber.id) ? "text-red-500 fill-current" : "text-white"}`}
                    />
                  </Button>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold">{barber.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-yellow-500 text-sm">{barber.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {barber.specialties.map((specialty) => (
                      <span key={specialty} className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
