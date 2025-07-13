import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Image from "next/image"
import type { Service } from "@/lib/api"

interface ServicesSectionProps {
  services: Service[]
  loading?: boolean
}

export function ServicesSection({ services, loading }: ServicesSectionProps) {
  if (loading) {
    return (
      <div className="px-4 mb-20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-medium">Serviços disponíveis</h2>
          <span className="text-gray-400 text-sm">Ver mais</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <div className="animate-pulse">
                  <div className="w-full h-24 bg-gray-700"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-700 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 mb-20">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-medium">Serviços disponíveis</h2>
        <span className="text-gray-400 text-sm">Ver mais</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {services.slice(0, 4).map((service) => (
          <Card key={service.id} className="bg-gray-800 border-gray-700 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src={service.image || "/images/barber-service-1.jpg"}
                  alt={service.name}
                  width={200}
                  height={120}
                  className="w-full h-24 object-cover"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70"
                >
                  <Heart className="w-3 h-3 text-white" />
                </Button>
              </div>
              <div className="p-3">
                <p className="text-white text-sm font-medium">{service.name}</p>
                <p className="text-gray-400 text-xs">R$ {service.price.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
