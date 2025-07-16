import type { User, LoginCredentials, RegisterData } from "@/types/auth"
import { UserRole } from "@/types/roles"
import { ROLES } from "./role-service"

// Simulação de API - em produção seria uma API real
class AuthService {
  private readonly STORAGE_KEY = "barbershop-auth"

  // Usuários mockados para demonstração - inicializado no método
  private mockUsers: Array<User & { password: string }> = []

  constructor() {
    this.initializeMockUsers()
  }

  private initializeMockUsers() {
    this.mockUsers = [
      {
        id: "1",
        name: "João Silva",
        email: "joao@email.com",
        password: "123456",
        phone: "(11) 99999-9999",
        avatar: "/images/perfil-padrao.jpg",
        role: UserRole.CLIENT,
        permissions: ROLES["client"]?.permissions?.map((p) => p.id) || [],
      },
      {
        id: "2",
        name: "Carlos Silva",
        email: "carlos@barbeariacentral.com",
        password: "123456",
        phone: "(11) 88888-8888",
        role: UserRole.BARBER_ADMIN,
        permissions: ROLES["barber_admin"]?.permissions?.map((p) => p.id) || [],
        barbershopId: "1",
      },
      {
        id: "3",
        name: "Admin Master",
        email: "admin@sistema.com",
        password: "123456",
        phone: "(11) 77777-7777",
        role: UserRole.SUPER_ADMIN,
        permissions: ROLES["super_admin"]?.permissions?.map((p) => p.id) || [],
      },
    ]
  }

  async login(credentials: LoginCredentials): Promise<User> {
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = this.mockUsers.find((u) => u.email === credentials.email && u.password === credentials.password)

    if (!user) {
      throw new Error("Email ou senha incorretos")
    }

    const { password, ...userWithoutPassword } = user

    if (credentials.rememberMe) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userWithoutPassword))
    }

    return userWithoutPassword
  }

  async register(data: RegisterData): Promise<User> {
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const existingUser = this.mockUsers.find((u) => u.email === data.email)
    if (existingUser) {
      throw new Error("Email já cadastrado")
    }

    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: UserRole.CLIENT,
      permissions: ROLES["client"]?.permissions?.map((p) => p.id) || [],
    }

    this.mockUsers.push(newUser)

    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  createGuestUser(): User {
    return {
      id: "guest",
      name: "Visitante",
      email: "",
      isGuest: true,
      role: UserRole.CLIENT,
      permissions: [],
    }
  }
}

export const authService = new AuthService()
