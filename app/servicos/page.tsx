"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { BottomNavigation } from "@/components/mobile/bottom-navigation"
import { DesktopSidebar } from "@/components/desktop/desktop-sidebar"
import { useApp } from "@/contexts/app-context"
import Image from "next/image"

export default function ServicosPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  const { services, userName } = useApp()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const categories = ["Todos", "Corte", "Barba", "Combo", "Extras"]

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "Todos" || service.name.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (serviceId: string) => {
    setFavorites((prev) => (prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]))
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white w-full overflow-x-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-2">Serviços</h1>
          <p className="text-gray-400 text-sm">Escolha o serviço ideal para você</p>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={`flex-shrink-0 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="px-4 pb-20">
          <div className="grid grid-cols-1 gap-4">
            {filteredServices.map((service) => (
              <Card key={service.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={service.image || "/images/barber-service-1.jpg"}
                        alt={service.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">{service.name}</h3>
                          <p className="text-gray-400 text-sm mb-2">{service.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600 hover:bg-green-600 text-white">
                              R$ {service.price.toFixed(2)}
                            </Badge>
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                              <Clock className="w-3 h-3" />
                              <span>{service.duration}min</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-gray-400 hover:text-red-500"
                          onClick={() => toggleFavorite(service.id)}
                        >
                          <Heart
                            className={`w-4 h-4 ${favorites.includes(service.id) ? "text-red-500 fill-current" : ""}`}
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhum serviço encontrado</p>
              <p className="text-gray-500 text-sm mt-1">Tente buscar por outro termo</p>
            </div>
          )}
        </div>

        <BottomNavigation />
      </div>
    )
  }

  // Desktop
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DesktopSidebar userName={userName} />

      <div className="ml-64 min-h-screen bg-gray-900">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">Serviços</h1>
          <p className="text-gray-400 text-sm mt-1">Escolha o serviço ideal para você</p>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar serviços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="bg-gray-800 border-gray-700 overflow-hidden hover:bg-gray-750 transition-colors"
              >
                <CardContent className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={service.image || "/images/barber-service-1.jpg"}
                      alt={service.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full hover:bg-black/70"
                      onClick={() => toggleFavorite(service.id)}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.includes(service.id) ? "text-red-500 fill-current" : "text-white"
                        }`}
                      />
                    </Button>
                  </div>

                  <div className="p-4">
                    <h3 className="text-white font-bold mb-2">{service.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{service.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600 hover:bg-green-600 text-white">
                          R$ {service.price.toFixed(2)}
                        </Badge>
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration}min</span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Agendar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Nenhum serviço encontrado</p>
              <p className="text-gray-500 text-sm mt-2">Tente buscar por outro termo ou categoria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
