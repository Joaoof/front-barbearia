"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Calendar, Clock, User, Phone, Check } from "lucide-react"
import { useApp, type Barber } from "@/contexts/app-context"
import { SuccessToast } from "@/components/notifications/success-toast"
import Image from "next/image"

interface BookingFlowProps {
  isOpen: boolean
  onClose: () => void
  selectedBarber?: Barber
}

type Step = "barber" | "service" | "datetime" | "contact" | "confirmation"

export function BookingFlow({ isOpen, onClose, selectedBarber }: BookingFlowProps) {
  const { barbers, services, createAppointment, getAvailableSlots, userName, userPhone, setUserInfo } = useApp()

  const [currentStep, setCurrentStep] = useState<Step>(selectedBarber ? "service" : "barber")
  const [selectedBarberId, setSelectedBarberId] = useState(selectedBarber?.id || "")
  const [selectedServiceId, setSelectedServiceId] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [clientName, setClientName] = useState(userName)
  const [clientPhone, setClientPhone] = useState(userPhone)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [appointmentData, setAppointmentData] = useState<any>(null)

  if (!isOpen && !showSuccessToast) return null

  const selectedBarberData = barbers.find((b) => b.id === selectedBarberId)
  const selectedServiceData = services.find((s) => s.id === selectedServiceId)

  const handleNext = () => {
    if (currentStep === "barber" && selectedBarberId) {
      setCurrentStep("service")
    } else if (currentStep === "service" && selectedServiceId) {
      setCurrentStep("datetime")
    } else if (currentStep === "datetime" && selectedDate && selectedTime) {
      setCurrentStep("contact")
    } else if (currentStep === "contact" && clientName && clientPhone) {
      setCurrentStep("confirmation")
    }
  }

  const handleConfirm = () => {
    if (selectedBarberId && selectedServiceId && selectedDate && selectedTime && clientName && clientPhone) {
      createAppointment({
        barberId: selectedBarberId,
        serviceId: selectedServiceId,
        date: selectedDate,
        time: selectedTime,
        status: "scheduled",
        clientName,
        clientPhone,
      })

      setUserInfo(clientName, clientPhone)

      // Preparar dados para a notificação
      const appointmentInfo = {
        barberName: selectedBarberData?.name || "",
        serviceName: selectedServiceData?.name || "",
        date: selectedDate,
        time: selectedTime,
        clientName,
        clientPhone,
      }

      setAppointmentData(appointmentInfo)

      // Fechar o modal de agendamento PRIMEIRO
      onClose()

      // Mostrar notificação DEPOIS
      setTimeout(() => {
        setShowSuccessToast(true)
      }, 300)

      // Reset form
      setCurrentStep(selectedBarber ? "service" : "barber")
      setSelectedBarberId(selectedBarber?.id || "")
      setSelectedServiceId("")
      setSelectedDate("")
      setSelectedTime("")
    }
  }

  const getNextDays = (count: number) => {
    const days = []
    for (let i = 0; i < count; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      days.push({
        date: date.toISOString().split("T")[0],
        display: date.toLocaleDateString("pt-BR", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
      })
    }
    return days
  }

  return (
    <>
      {/* Booking Flow Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-700">
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-white text-lg font-bold">Novo Agendamento</h1>
                <p className="text-gray-400 text-sm">
                  {currentStep === "barber" && "Escolha um barbeiro"}
                  {currentStep === "service" && "Escolha um serviço"}
                  {currentStep === "datetime" && "Escolha data e horário"}
                  {currentStep === "contact" && "Seus dados"}
                  {currentStep === "confirmation" && "Confirmar agendamento"}
                </p>
              </div>
            </div>

            <div className="p-4">
              {/* Step 1: Select Barber */}
              {currentStep === "barber" && (
                <div className="space-y-3">
                  {barbers.map((barber) => (
                    <Card
                      key={barber.id}
                      className={`cursor-pointer transition-colors ${
                        selectedBarberId === barber.id
                          ? "bg-blue-600 border-blue-500"
                          : "bg-gray-700 border-gray-600 hover:bg-gray-650"
                      }`}
                      onClick={() => setSelectedBarberId(barber.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={barber.avatar || "/placeholder.svg"}
                            alt={barber.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{barber.name}</h3>
                            <p className="text-gray-300 text-sm">⭐ {barber.rating}</p>
                          </div>
                          {selectedBarberId === barber.id && <Check className="w-5 h-5 text-white" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Step 2: Select Service */}
              {currentStep === "service" && (
                <div className="space-y-3">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-colors ${
                        selectedServiceId === service.id
                          ? "bg-blue-600 border-blue-500"
                          : "bg-gray-700 border-gray-600 hover:bg-gray-650"
                      }`}
                      onClick={() => setSelectedServiceId(service.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{service.name}</h3>
                            <p className="text-gray-300 text-sm">{service.description}</p>
                            <p className="text-green-400 text-sm font-medium">
                              R$ {service.price.toFixed(2)} • {service.duration}min
                            </p>
                          </div>
                          {selectedServiceId === service.id && <Check className="w-5 h-5 text-white ml-3" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Step 3: Select Date & Time */}
              {currentStep === "datetime" && (
                <div className="space-y-4">
                  {/* Date Selection */}
                  <div>
                    <Label className="text-white mb-2 block">Escolha a data</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {getNextDays(9).map((day) => (
                        <Button
                          key={day.date}
                          variant={selectedDate === day.date ? "default" : "outline"}
                          className={`text-xs p-2 h-auto ${
                            selectedDate === day.date
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                          }`}
                          onClick={() => setSelectedDate(day.date)}
                        >
                          {day.display}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div>
                      <Label className="text-white mb-2 block">Escolha o horário</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {getAvailableSlots(selectedBarberId, selectedDate).map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedTime === slot.time ? "default" : "outline"}
                            disabled={!slot.available}
                            className={`text-xs p-2 h-auto ${
                              selectedTime === slot.time
                                ? "bg-blue-600 text-white"
                                : slot.available
                                  ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                  : "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
                            }`}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Contact Info */}
              {currentStep === "contact" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Nome completo
                    </Label>
                    <Input
                      id="name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white mt-1"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white mt-1"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Confirmation */}
              {currentStep === "confirmation" && (
                <div className="space-y-4">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <h3 className="text-white font-bold mb-3">Resumo do Agendamento</h3>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">Barbeiro:</span>
                          <span className="text-white font-medium">{selectedBarberData?.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-gray-300">Serviço:</span>
                          <span className="text-white font-medium">{selectedServiceData?.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">Data:</span>
                          <span className="text-white font-medium">
                            {new Date(selectedDate).toLocaleDateString("pt-BR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">Horário:</span>
                          <span className="text-white font-medium">{selectedTime}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">Cliente:</span>
                          <span className="text-white font-medium">{clientName}</span>
                        </div>

                        <div className="border-t border-gray-600 pt-2 mt-3">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Total:</span>
                            <span className="text-green-400 font-bold text-lg">
                              R$ {selectedServiceData?.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {currentStep !== "barber" && currentStep !== "confirmation" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (currentStep === "service") setCurrentStep(selectedBarber ? "service" : "barber")
                      else if (currentStep === "datetime") setCurrentStep("service")
                      else if (currentStep === "contact") setCurrentStep("datetime")
                    }}
                    className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    Voltar
                  </Button>
                )}

                <Button
                  onClick={currentStep === "confirmation" ? handleConfirm : handleNext}
                  disabled={
                    (currentStep === "barber" && !selectedBarberId) ||
                    (currentStep === "service" && !selectedServiceId) ||
                    (currentStep === "datetime" && (!selectedDate || !selectedTime)) ||
                    (currentStep === "contact" && (!clientName || !clientPhone))
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {currentStep === "confirmation" ? "Confirmar Agendamento" : "Continuar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast - Renderizado independentemente */}
      <SuccessToast open={showSuccessToast} onOpenChange={setShowSuccessToast} appointmentData={appointmentData} />
    </>
  )
}
