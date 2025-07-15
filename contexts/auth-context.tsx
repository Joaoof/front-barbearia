"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService } from "@/services/auth-service"
import type { AuthState, LoginCredentials, RegisterData } from "@/types/auth"

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  continueAsGuest: () => void
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isGuest: false,
    loading: true,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar se há usuário armazenado
    const storedUser = authService.getStoredUser()
    if (storedUser) {
      setState({
        user: storedUser,
        isAuthenticated: true,
        isGuest: false,
        loading: false,
      })
    } else {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null)
      setState((prev) => ({ ...prev, loading: true }))

      const user = await authService.login(credentials)

      setState({
        user,
        isAuthenticated: true,
        isGuest: false,
        loading: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login")
      setState((prev) => ({ ...prev, loading: false }))
      throw err
    }
  }

  const register = async (data: RegisterData) => {
    try {
      setError(null)
      setState((prev) => ({ ...prev, loading: true }))

      const user = await authService.register(data)

      setState({
        user,
        isAuthenticated: true,
        isGuest: false,
        loading: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta")
      setState((prev) => ({ ...prev, loading: false }))
      throw err
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setState({
        user: null,
        isAuthenticated: false,
        isGuest: false,
        loading: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao sair")
    }
  }

  const continueAsGuest = () => {
    const guestUser = authService.createGuestUser()
    setState({
      user: guestUser,
      isAuthenticated: false,
      isGuest: true,
      loading: false,
    })
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        continueAsGuest,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
