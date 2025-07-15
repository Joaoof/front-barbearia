"use client"

import { RoleGuard } from "@/components/auth/role-guard"
import { BarbershopDashboard } from "@/components/admin/barbershop-dashboard"
import { UserRole } from "@/types/roles"

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.BARBER_ADMIN]}>
      <BarbershopDashboard />
    </RoleGuard>
  )
}
