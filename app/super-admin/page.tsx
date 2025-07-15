"use client"

import { RoleGuard } from "@/components/auth/role-guard"
import { SuperAdminDashboard } from "@/components/super-admin/super-admin-dashboard"
import { UserRole } from "@/types/roles"

export default function SuperAdminPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
      <SuperAdminDashboard />
    </RoleGuard>
  )
}
