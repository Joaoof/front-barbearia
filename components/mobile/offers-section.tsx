import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { Offer } from "@/lib/api"

interface OffersSectionProps {
  offers: Offer[]
  loading?: boolean
}

export function OffersSection({ offers, loading }: OffersSectionProps) {
  if (loading) {
    return (
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-medium">Ofertas especiais + combos</h2>
          <span className="text-gray-400 text-sm">Ver mais</span>
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-0">
            <div className="animate-pulse">
              <div className="w-full h-32 bg-gray-700"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const mainOffer = offers[0]

  if (!mainOffer) {
    return null
  }

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-medium">Ofertas especiais + combos</h2>
        <span className="text-gray-400 text-sm">Ver mais</span>
      </div>

      <Card className="bg-gray-800 border-gray-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={mainOffer.image || "/images/barber-offer.png"}
              alt={mainOffer.title}
              width={200}
              height={200}
              className="w-full h-42  object-cover"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-green-600 hover:bg-green-600 text-white">{mainOffer.discount}% de desconto</Badge>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white font-medium mb-1">{mainOffer.title}</h3>
            <p className="text-gray-400 text-sm">{mainOffer.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
