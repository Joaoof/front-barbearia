export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  isGuest?: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isGuest: boolean
  loading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}
