"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  Search,
  MoreHorizontal,
  Eye,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
} from "lucide-react"
import { roleService } from "@/services/role-service"
import type { Barbershop } from "@/types/roles"

export function SuperAdminDashboard() {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  useEffect(() => {
    loadBarbershops()
  }, [])

  const loadBarbershops = async () => {
    try {
      setLoading(true)
      const data = await roleService.getAllBarbershops()
      setBarbershops(data)
    } catch (error) {
      console.error("Erro ao carregar barbearias:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await roleService.updateBarbershopStatus(id, !currentStatus)
      setBarbershops((prev) => prev.map((b) => (b.id === id ? { ...b, isActive: !currentStatus } : b)))
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const filteredBarbershops = barbershops.filter((barbershop) => {
    const matchesSearch =
      barbershop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barbershop.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "active" && barbershop.isActive) ||
      (selectedFilter === "inactive" && !barbershop.isActive) ||
      selectedFilter === barbershop.subscription.plan

    return matchesSearch && matchesFilter
  })

  // Estatísticas gerais
  const totalRevenue = barbershops.reduce((sum, b) => sum + b.stats.totalRevenue, 0)
  const totalAppointments = barbershops.reduce((sum, b) => sum + b.stats.totalAppointments, 0)
  const totalClients = barbershops.reduce((sum, b) => sum + b.stats.totalClients, 0)
  const activeBarbershops = barbershops.filter((b) => b.isActive).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando barbearias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Super Admin Dashboard</h1>
            <p className="text-gray-400">Gerenciamento de todas as barbearias do sistema</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-gray-800 border-gray-600 text-white">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Barbearia
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Cards de Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total de Barbearias</CardTitle>
              <Building2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{barbershops.length}</div>
              <p className="text-xs text-gray-400">{activeBarbershops} ativas</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">R$ {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-400">+15% este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalClients.toLocaleString()}</div>
              <p className="text-xs text-gray-400">Across all barbershops</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Agendamentos</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalAppointments.toLocaleString()}</div>
              <p className="text-xs text-gray-400">Total realizados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar barbearias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "inactive", "basic", "premium", "enterprise"].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className={
                  selectedFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                }
              >
                <Filter className="w-3 h-3 mr-1" />
                {filter === "all" && "Todas"}
                {filter === "active" && "Ativas"}
                {filter === "inactive" && "Inativas"}
                {filter === "basic" && "Básico"}
                {filter === "premium" && "Premium"}
                {filter === "enterprise" && "Enterprise"}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de Barbearias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBarbershops.map((barbershop) => (
            <Card key={barbershop.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{barbershop.name}</CardTitle>
                      <p className="text-gray-400 text-sm">{barbershop.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={barbershop.isActive ? "bg-green-600" : "bg-red-600"}>
                      {barbershop.isActive ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" /> Ativa
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" /> Inativa
                        </>
                      )}
                    </Badge>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Informações de Contato */}
                  <div className="text-sm">
                    <p className="text-gray-400">📞 {barbershop.phone}</p>
                    <p className="text-gray-400">✉️ {barbershop.email}</p>
                  </div>

                  {/* Plano de Assinatura */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Plano:</span>
                    <Badge
                      className={
                        barbershop.subscription.plan === "enterprise"
                          ? "bg-purple-600"
                          : barbershop.subscription.plan === "premium"
                            ? "bg-blue-600"
                            : "bg-gray-600"
                      }
                    >
                      {barbershop.subscription.plan.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Estatísticas */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{barbershop.stats.totalAppointments}</p>
                      <p className="text-xs text-gray-400">Agendamentos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">
                        R$ {barbershop.stats.totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">Receita</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{barbershop.stats.activeBarbers}</p>
                      <p className="text-xs text-gray-400">Barbeiros</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">{barbershop.stats.totalClients}</p>
                      <p className="text-xs text-gray-400">Clientes</p>
                    </div>
                  </div>

                  {/* Status da Assinatura */}
                  <div className="flex items-center gap-2 pt-2">
                    {barbershop.subscription.isActive ? (
                      <div className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle className="w-3 h-3" />
                        Assinatura ativa até {new Date(barbershop.subscription.expiresAt).toLocaleDateString("pt-BR")}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-400 text-sm">
                        <AlertCircle className="w-3 h-3" />
                        Assinatura expirada
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(barbershop.id, barbershop.isActive)}
                      className={`flex-1 ${
                        barbershop.isActive
                          ? "bg-red-600 border-red-500 text-white hover:bg-red-700"
                          : "bg-green-600 border-green-500 text-white hover:bg-green-700"
                      }`}
                    >
                      {barbershop.isActive ? "Desativar" : "Ativar"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBarbershops.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhuma barbearia encontrada</h3>
            <p className="text-gray-400">Tente ajustar os filtros ou termo de busca</p>
          </div>
        )}
      </div>
    </div>
  )
}
