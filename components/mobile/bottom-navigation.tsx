"use client"

import { Button } from "@/components/ui/button"
import { Home, Calendar, Plus, Heart, User } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { BarberSelection } from "@/components/booking/barber-selection"

interface BottomNavigationProps {
  showOnDesktop?: boolean
}

export function BottomNavigation({ showOnDesktop = false }: BottomNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showBarberSelection, setShowBarberSelection] = useState(false)

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 ${showOnDesktop ? "" : "md:hidden"}`}
      >
        <div className="flex items-center justify-around py-3 w-full px-4">
          <Button
            variant="ghost"
            size="icon"
            className={pathname === "/" ? "text-blue-500" : "text-gray-400"}
            onClick={() => router.push("/")}
          >
            <Home className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={pathname === "/agendamentos" ? "text-blue-500" : "text-gray-400"}
            onClick={() => router.push("/agendamentos")}
          >
            <Calendar className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 rounded-full"
            onClick={() => setShowBarberSelection(true)}
          >
            <Plus className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Heart className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <BarberSelection
        isOpen={showBarberSelection}
        onClose={() => setShowBarberSelection(false)}
        onSelectBarber={(barber) => {
          console.log("Barbeiro selecionado:", barber)
          setShowBarberSelection(false)
        }}
      />
    </>
  )
}
