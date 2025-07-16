"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface MobileHeaderProps {
  currentDate: string
  showStatusBar?: boolean
}

export function MobileHeader({ currentDate, showStatusBar = true }: MobileHeaderProps) {
  const { user, logout, isGuest } = useAuth()

  const handleLogout = async () => {
    if (confirm("Deseja sair da sua conta?")) {
      await logout()
    }
  }

  return (
    <>
      {/* Header com espaçamento ajustado */}
      <div className="pt-6 pb-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.avatar || "/images/perfil-padrao.jpg"} alt={user?.name} />
              <AvatarFallback className="bg-blue-600 text-white font-semibold">
                {isGuest ? <User className="w-6 h-6" /> : user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-white">Olá, {isGuest ? "Visitante" : user?.name} 👋</h1>
              <p className="text-gray-400 text-sm">{currentDate}</p>
            </div>
          </div>

          {!isGuest && (
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:text-white">
              <LogOut className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
