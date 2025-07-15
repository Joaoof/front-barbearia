import type { Permission, Role, Barbershop, BarberAdmin, SuperAdmin } from "@/types/roles"
import { UserRole } from "@/types/roles"

// Definição de permissões do sistema
export const PERMISSIONS: Record<string, Permission> = {
  // Cliente
  VIEW_SERVICES: { id: "view_services", name: "Ver Serviços", description: "Visualizar serviços disponíveis" },
  BOOK_APPOINTMENT: { id: "book_appointment", name: "Agendar", description: "Criar agendamentos" },
  VIEW_OWN_APPOINTMENTS: {
    id: "view_own_appointments",
    name: "Ver Agendamentos",
    description: "Ver próprios agendamentos",
  },

  // Barbeiro Admin
  VIEW_ALL_APPOINTMENTS: {
    id: "view_all_appointments",
    name: "Ver Todos Agendamentos",
    description: "Ver agendamentos da barbearia",
  },
  MANAGE_APPOINTMENTS: {
    id: "manage_appointments",
    name: "Gerenciar Agendamentos",
    description: "Editar/cancelar agendamentos",
  },
  VIEW_ANALYTICS: { id: "view_analytics", name: "Ver Relatórios", description: "Acessar dashboard analítico" },
  MANAGE_BARBERS: { id: "manage_barbers", name: "Gerenciar Barbeiros", description: "Adicionar/remover barbeiros" },
  MANAGE_SERVICES: { id: "manage_services", name: "Gerenciar Serviços", description: "Editar serviços e preços" },
  VIEW_REVENUE: { id: "view_revenue", name: "Ver Faturamento", description: "Visualizar receitas" },

  // Super Admin
  VIEW_ALL_BARBERSHOPS: {
    id: "view_all_barbershops",
    name: "Ver Barbearias",
    description: "Visualizar todas as barbearias",
  },
  MANAGE_BARBERSHOPS: {
    id: "manage_barbershops",
    name: "Gerenciar Barbearias",
    description: "Criar/editar barbearias",
  },
  VIEW_SYSTEM_ANALYTICS: {
    id: "view_system_analytics",
    name: "Analytics Sistema",
    description: "Relatórios do sistema completo",
  },
  MANAGE_SUBSCRIPTIONS: {
    id: "manage_subscriptions",
    name: "Gerenciar Assinaturas",
    description: "Controlar planos e pagamentos",
  },
}

// Definição de roles
export const ROLES: Record<string, Role> = {
  client: {
    id: "client",
    name: "Cliente",
    permissions: [PERMISSIONS.VIEW_SERVICES, PERMISSIONS.BOOK_APPOINTMENT, PERMISSIONS.VIEW_OWN_APPOINTMENTS],
  },
  barber_admin: {
    id: "barber_admin",
    name: "Administrador da Barbearia",
    permissions: [
      PERMISSIONS.VIEW_SERVICES,
      PERMISSIONS.VIEW_ALL_APPOINTMENTS,
      PERMISSIONS.MANAGE_APPOINTMENTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.MANAGE_BARBERS,
      PERMISSIONS.MANAGE_SERVICES,
      PERMISSIONS.VIEW_REVENUE,
    ],
  },
  super_admin: {
    id: "super_admin",
    name: "Super Administrador",
    permissions: Object.values(PERMISSIONS),
  },
}

class RoleService {
  // Mock data para demonstração
  private mockBarbershops: Barbershop[] = [
    {
      id: "1",
      name: "Barbearia Central",
      address: "Rua das Flores, 123 - Centro",
      phone: "(11) 99999-1111",
      email: "contato@barbeariacentral.com",
      logo: "/images/barbershop-1.jpg",
      isActive: true,
      createdAt: "2024-01-15",
      subscription: {
        plan: "premium",
        expiresAt: "2024-12-31",
        isActive: true,
      },
      stats: {
        totalAppointments: 1250,
        totalRevenue: 45000,
        activeBarbers: 4,
        totalClients: 320,
      },
    },
    {
      id: "2",
      name: "Barbearia do João",
      address: "Av. Paulista, 456 - Bela Vista",
      phone: "(11) 88888-2222",
      email: "joao@barbearia.com",
      logo: "/images/barbershop-2.jpg",
      isActive: true,
      createdAt: "2024-02-20",
      subscription: {
        plan: "basic",
        expiresAt: "2024-11-30",
        isActive: true,
      },
      stats: {
        totalAppointments: 850,
        totalRevenue: 28000,
        activeBarbers: 2,
        totalClients: 180,
      },
    },
    {
      id: "3",
      name: "Elite Barbershop",
      address: "Rua Augusta, 789 - Consolação",
      phone: "(11) 77777-3333",
      email: "elite@barbershop.com",
      logo: "/images/barbershop-3.jpg",
      isActive: false,
      createdAt: "2024-03-10",
      subscription: {
        plan: "enterprise",
        expiresAt: "2024-10-15",
        isActive: false,
      },
      stats: {
        totalAppointments: 2100,
        totalRevenue: 89000,
        activeBarbers: 8,
        totalClients: 650,
      },
    },
  ]

  private mockBarberAdmins: BarberAdmin[] = []
  private mockSuperAdmins: SuperAdmin[] = []

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    this.mockBarberAdmins = [
      {
        id: "barber_1",
        name: "Carlos Silva",
        email: "carlos@barbeariacentral.com",
        barbershopId: "1",
        barbershop: this.mockBarbershops[0],
        role: UserRole.BARBER_ADMIN,
        permissions: ROLES["barber_admin"].permissions.map((p) => p.id),
      },
    ]

    this.mockSuperAdmins = [
      {
        id: "super_1",
        name: "Admin Master",
        email: "admin@sistema.com",
        role: UserRole.SUPER_ADMIN,
        permissions: ROLES["super_admin"].permissions.map((p) => p.id),
      },
    ]
  }

  async getAllBarbershops(): Promise<Barbershop[]> {
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 800))
    return this.mockBarbershops
  }

  async getBarbershopById(id: string): Promise<Barbershop | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return this.mockBarbershops.find((b) => b.id === id) || null
  }

  async getBarberAdminByEmail(email: string): Promise<BarberAdmin | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return this.mockBarberAdmins.find((b) => b.email === email) || null
  }

  async getSuperAdminByEmail(email: string): Promise<SuperAdmin | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return this.mockSuperAdmins.find((s) => s.email === email) || null
  }

  hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    return userPermissions.includes(requiredPermission)
  }

  getUserRole(email: string): string {
    // Lógica para determinar role baseado no email
    if (email === "admin@sistema.com") return "super_admin"
    if (email === "carlos@barbeariacentral.com") return "barber_admin"
    return "client"
  }

  async updateBarbershopStatus(id: string, isActive: boolean): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const barbershop = this.mockBarbershops.find((b) => b.id === id)
    if (barbershop) {
      barbershop.isActive = isActive
      barbershop.subscription.isActive = isActive
    }
  }
}

export const roleService = new RoleService()
