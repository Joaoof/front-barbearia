export enum UserRole {
  CLIENT = "CLIENT",
  BARBER_ADMIN = "BARBER_ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface Permission {
  id: string
  name: string
  description: string
}

export interface Role {
  id: string
  name: string
  permissions: Permission[]
}

export interface Barbershop {
  id: string
  name: string
  address: string
  phone: string
  email: string
  logo?: string
  isActive: boolean
  createdAt: string
  subscription: {
    plan: "basic" | "premium" | "enterprise"
    expiresAt: string
    isActive: boolean
  }
  stats: {
    totalAppointments: number
    totalRevenue: number
    activeBarbers: number
    totalClients: number
  }
}

export interface BarberAdmin {
  id: string
  name: string
  email: string
  barbershopId: string
  barbershop: Barbershop
  role: UserRole.BARBER_ADMIN
  permissions: string[]
}

export interface SuperAdmin {
  id: string
  name: string
  email: string
  role: UserRole.SUPER_ADMIN
  permissions: string[]
}
