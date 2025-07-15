import type { User, LoginCredentials, RegisterData } from "@/types/auth"

// Simulação de API - em produção seria uma API real
class AuthService {
  private readonly STORAGE_KEY = "barbershop-auth"
  private readonly USERS_KEY = "barbershop-users"

  // Usuários mockados para demonstração
  private mockUsers: Array<User & { password: string }> = [
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      password: "123456",
      phone: "(11) 99999-9999",
      avatar: "/images/jardel-profile.jpg",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@email.com",
      password: "123456",
      phone: "(11) 88888-8888",
    },
  ]

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
    }
  }
}

export const authService = new AuthService()
