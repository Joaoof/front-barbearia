"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Calendar, Scissors, Heart, User, CreditCard, Clock, Settings, Bell, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function DesktopSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, isGuest } = useAuth()

  const handleLogout = async () => {
    if (confirm("Deseja sair da sua conta?")) {
      await logout()
    }
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Agendamentos", path: "/agendamentos" },
    { icon: Scissors, label: "Serviços", path: "/servicos" },
    { icon: Clock, label: "Horários", path: "/horarios" },
    { icon: Heart, label: "Favoritos", path: "/favoritos" },
    { icon: CreditCard, label: "Pagamentos", path: "/pagamentos" },
    { icon: User, label: "Perfil", path: "/perfil" },
    { icon: Settings, label: "Configurações", path: "/configuracoes" },
  ]

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen flex flex-col fixed left-0 top-0 bottom-0">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-center h-40">
        <img
          src="/images/image-login.png"
          alt=""
          width={100}
          height={100}
        />
      </div>


      {/* User Profile */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar || "/images/perfil-padrao.jpg"} alt={user?.name} />
            <AvatarFallback className="bg-blue-600 text-white font-semibold">
              {isGuest ? <User className="w-5 h-5" /> : user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{isGuest ? "Visitante" : user?.name}</p>
            <p className="text-gray-400 text-sm">{isGuest ? "Modo visitante" : "Cliente Premium"}</p>
          </div>
          {!isGuest && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-400 hover:text-white w-8 h-8"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={pathname === item.path ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 ${pathname === item.path
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              onClick={() => router.push(item.path)}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-700">
        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-300 hover:bg-gray-700 hover:text-white">
          <Bell className="w-4 h-4" />
          Notificações
        </Button>
      </div>
    </aside>
  )
}
