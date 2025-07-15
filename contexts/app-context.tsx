"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Barber {
  id: string
  name: string
  avatar: string
  rating: number
  specialties: string[]
  available: boolean
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  image?: string
}

export interface Appointment {
  id: string
  barberId: string
  barber: Barber
  serviceId: string
  service: Service
  date: string
  time: string
  status: "scheduled" | "completed" | "cancelled"
  rating?: number
  clientName: string
  clientPhone: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

interface AppContextType {
  // Data
  barbers: Barber[]
  services: Service[]
  appointments: Appointment[]

  // Actions
  createAppointment: (appointment: Omit<Appointment, "id" | "barber" | "service">) => void
  cancelAppointment: (appointmentId: string) => void
  getAvailableSlots: (barberId: string, date: string) => TimeSlot[]

  // User data
  userName: string
  userPhone: string
  setUserInfo: (name: string, phone: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Mock data
const mockBarbers: Barber[] = [
  {
    id: "1",
    name: "Jardel",
    avatar: "/images/barber-jardel.jpg",
    rating: 5.0,
    specialties: ["Corte", "Barba", "Bigode"],
    available: true,
  },
  {
    id: "2",
    name: "Carlos",
    avatar: "/images/jardel-profile.jpg",
    rating: 4.8,
    specialties: ["Corte", "Barba", "Degradê"],
    available: true,
  },
  {
    id: "3",
    name: "Roberto",
    avatar: "/images/jardel-profile.jpg",
    rating: 4.9,
    specialties: ["Corte", "Degradê", "Sobrancelha"],
    available: true,
  },
  {
    id: "4",
    name: "Anderson",
    avatar: "/images/jardel-profile.jpg",
    rating: 4.7,
    specialties: ["Corte", "Barba"],
    available: true,
  },
]

const mockServices: Service[] = [
  {
    id: "1",
    name: "Corte de Cabelo",
    description: "Corte moderno e estiloso",
    price: 25.0,
    duration: 30,
    image: "/images/barber-service-1.jpg",
  },
  {
    id: "2",
    name: "Barba",
    description: "Aparar e modelar barba",
    price: 15.0,
    duration: 20,
    image: "/images/barber-service-2.jpg",
  },
  {
    id: "3",
    name: "Corte + Barba",
    description: "Pacote completo",
    price: 35.0,
    duration: 45,
    image: "/images/barber-offer.jpg",
  },
  {
    id: "4",
    name: "Bigode",
    description: "Aparar e modelar bigode",
    price: 10.0,
    duration: 15,
  },
  {
    id: "5",
    name: "Sobrancelha",
    description: "Design de sobrancelha masculina",
    price: 12.0,
    duration: 15,
  },
  {
    id: "6",
    name: "Degradê",
    description: "Corte degradê profissional",
    price: 30.0,
    duration: 40,
  },
]

const initialAppointments: Appointment[] = [
  {
    id: "1",
    barberId: "1",
    barber: mockBarbers[0],
    serviceId: "3",
    service: mockServices[2],
    date: "2024-05-24",
    time: "10:00",
    status: "scheduled",
    clientName: "João Silva",
    clientPhone: "(11) 99999-9999",
  },
  {
    id: "2",
    barberId: "1",
    barber: mockBarbers[0],
    serviceId: "1",
    service: mockServices[0],
    date: "2024-04-29",
    time: "10:00",
    status: "completed",
    rating: 5.0,
    clientName: "João Silva",
    clientPhone: "(11) 99999-9999",
  },
  {
    id: "3",
    barberId: "1",
    barber: mockBarbers[0],
    serviceId: "2",
    service: mockServices[1],
    date: "2024-04-14",
    time: "10:00",
    status: "completed",
    rating: 5.0,
    clientName: "João Silva",
    clientPhone: "(11) 99999-9999",
  },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [userName, setUserName] = useState("João Silva")
  const [userPhone, setUserPhone] = useState("(11) 99999-9999")

  // Load data from localStorage on mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem("barbershop-appointments")
    const savedUserName = localStorage.getItem("barbershop-user-name")
    const savedUserPhone = localStorage.getItem("barbershop-user-phone")

    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    } else {
      setAppointments(initialAppointments)
    }

    if (savedUserName) setUserName(savedUserName)
    if (savedUserPhone) setUserPhone(savedUserPhone)
  }, [])

  // Save to localStorage whenever appointments change
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem("barbershop-appointments", JSON.stringify(appointments))
    }
  }, [appointments])

  const createAppointment = (appointmentData: Omit<Appointment, "id" | "barber" | "service">) => {
    const barber = mockBarbers.find((b) => b.id === appointmentData.barberId)!
    const service = mockServices.find((s) => s.id === appointmentData.serviceId)!

    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      barber,
      service,
    }

    setAppointments((prev) => [...prev, newAppointment])
  }

  const cancelAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "cancelled" as const } : apt)),
    )
  }

  const getAvailableSlots = (barberId: string, date: string): TimeSlot[] => {
    const allSlots = [
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
    ]

    const bookedSlots = appointments
      .filter((apt) => apt.barberId === barberId && apt.date === date && apt.status === "scheduled")
      .map((apt) => apt.time)

    return allSlots.map((time) => ({
      time,
      available: !bookedSlots.includes(time),
    }))
  }

  const setUserInfo = (name: string, phone: string) => {
    setUserName(name)
    setUserPhone(phone)
    localStorage.setItem("barbershop-user-name", name)
    localStorage.setItem("barbershop-user-phone", phone)
  }

  return (
    <AppContext.Provider
      value={{
        barbers: mockBarbers,
        services: mockServices,
        appointments,
        createAppointment,
        cancelAppointment,
        getAvailableSlots,
        userName,
        userPhone,
        setUserInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
