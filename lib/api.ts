// API service para integração com back-end
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Barber {
  id: string
  name: string
  avatar?: string
  specialties: string[]
}

export interface Appointment {
  id: string
  barberId: string
  barber: Barber
  date: string
  time: string
  service: string
  status: "scheduled" | "completed" | "cancelled"
  price: number
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  image?: string
}

export interface Offer {
  id: string
  title: string
  description: string
  discount: number
  image?: string
  validUntil: string
}

export interface Schedule {
  weekdays: { open: string; close: string }
  saturday: { open: string; close: string }
  sunday?: { open: string; close: string }
  isOpen: boolean
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // User endpoints
  async getUser(userId: string): Promise<User> {
    return this.request<User>(`/users/${userId}`)
  }

  // Appointments endpoints
  async getUserAppointments(userId: string): Promise<Appointment[]> {
    return this.request<Appointment[]>(`/users/${userId}/appointments`)
  }

  async createAppointment(appointment: Omit<Appointment, "id">): Promise<Appointment> {
    return this.request<Appointment>("/appointments", {
      method: "POST",
      body: JSON.stringify(appointment),
    })
  }

  async cancelAppointment(appointmentId: string): Promise<void> {
    return this.request<void>(`/appointments/${appointmentId}`, {
      method: "DELETE",
    })
  }

  // Services endpoints
  async getServices(): Promise<Service[]> {
    return this.request<Service[]>("/services")
  }

  // Barbers endpoints
  async getBarbers(): Promise<Barber[]> {
    return this.request<Barber[]>("/barbers")
  }

  async getBarberAvailability(barberId: string, date: string): Promise<string[]> {
    return this.request<string[]>(`/barbers/${barberId}/availability?date=${date}`)
  }

  // Offers endpoints
  async getOffers(): Promise<Offer[]> {
    return this.request<Offer[]>("/offers")
  }

  // Schedule endpoints
  async getSchedule(): Promise<Schedule> {
    return this.request<Schedule>("/schedule")
  }
}

export const apiService = new ApiService()
