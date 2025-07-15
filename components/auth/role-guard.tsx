"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/types/roles"
import { roleService } from "@/services/role-service"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, isGuest } = useAuth()

  if (isGuest || !user) {
    return (
      fallback || (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">Acesso Negado</h2>
            <p className="text-gray-400">Você não tem permissão para acessar esta página</p>
          </div>
        </div>
      )
    )
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">Acesso Negado</h2>
            <p className="text-gray-400">Você não tem permissão para acessar esta página</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}

interface PermissionGuardProps {
  children: React.ReactNode
  requiredPermission: string
  fallback?: React.ReactNode
}

export function PermissionGuard({ children, requiredPermission, fallback }: PermissionGuardProps) {
  const { user, isGuest } = useAuth()

  if (isGuest || !user) {
    return fallback || null
  }

  const hasPermission = roleService.hasPermission(user.permissions, requiredPermission)

  if (!hasPermission) {
    return fallback || null
  }

  return <>{children}</>
}
