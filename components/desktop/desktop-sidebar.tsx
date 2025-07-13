"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Calendar, Scissors, Heart, User, CreditCard, Clock, Settings, Bell } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface DesktopSidebarProps {
  userName: string
  userAvatar?: string
}

export function DesktopSidebar({ userName, userAvatar }: DesktopSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

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
    <aside className="w-64 bg-gray-800 text-white h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">BarberShop</h1>
        <p className="text-gray-400 text-sm">Sistema de Agendamentos</p>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={userAvatar || "/placeholder.svg"} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{userName}</p>
            <p className="text-gray-400 text-sm">Cliente Premium</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={pathname === item.path ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 ${
                pathname === item.path
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
