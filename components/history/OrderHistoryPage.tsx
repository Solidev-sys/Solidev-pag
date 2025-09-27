"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { WhatsAppButton } from "@/components/WhatsAppButton"
import { OrderTable } from "@/components/history/OrderTable"
import { OrderModal } from "@/components/history/OrderModal"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, Loader2, AlertTriangle } from "lucide-react"
import { apiService } from "@/lib/api"
import type { Order, BackendHistoryItem } from '@/types';

export function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter((order) => order.status === statusFilter))
    }
  }, [orders, statusFilter])

  // Función para convertir datos del backend al formato del frontend
  const convertBackendToFrontend = (backendItem: BackendHistoryItem): Order => {
    // Mapear estados del backend a estados del frontend
    let status: "completada" | "pendiente" | "cancelada" = "pendiente";
    if (backendItem.estado === "completada" || backendItem.estado === "pagado") {
      status = "completada";
    } else if (backendItem.estado === "cancelada") {
      status = "cancelada";
    }

    return {
      id: backendItem.id.toString(),
      date: backendItem.fecha,
      total: backendItem.total,
      status: status,
      items: backendItem.detalles.map(detalle => ({
        name: detalle.producto,
        quantity: detalle.cantidad,
        price: detalle.precio_unitario
      }))
    };
  };

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const historyData = await apiService.getHistory()
      
      // Convertir datos del backend al formato del frontend
      const convertedOrders = historyData.map(convertBackendToFrontend)
      
      setOrders(convertedOrders)
    } catch (error: any) {
      console.error('Error loading orders:', error)
      setError(error.message || 'Error al cargar el historial de pedidos')
    } finally {
      setLoading(false)
    }
  }

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleCloseModal = () => {
    setSelectedOrder(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
              <p className="text-gray-600">Cargando historial de pedidos...</p>
            </div>
          </div>
        </div>
        <WhatsAppButton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar el historial</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadOrders} variant="outline">
                Intentar de nuevo
              </Button>
            </div>
          </div>
        </div>
        <WhatsAppButton />
      </div>
    )
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      completada: "Completada",
      pendiente: "Pendiente",
      cancelada: "Cancelada",
    }
    return labels[status as keyof typeof labels] || status
  }

  const getStatusColor = (status: string) => {
    const colors = {
      completada: "bg-green-100 text-green-800",
      pendiente: "bg-yellow-100 text-yellow-800",
      cancelada: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Cargando historial...</p>
            </div>
          </div>
        </div>
        <WhatsAppButton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={loadOrders}>Reintentar</Button>
            </div>
          </div>
        </div>
        <WhatsAppButton />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No tienes pedidos aún</h3>
              <p className="text-muted-foreground mb-6">Cuando realices tu primera compra, aparecerá aquí.</p>
              <Button asChild>
                <a href="/">Ir a Comprar</a>
              </Button>
            </div>
          </div>
        </div>
        <WhatsAppButton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mi Historial de Pedidos</h1>

        {/* Filter Controls */}
        <div className="mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="completada">Enviado</SelectItem>
              <SelectItem value="pendiente">En tránsito</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <OrderTable
          orders={filteredOrders}
          onViewDetails={(order) => setSelectedOrder(order)}
          getStatusLabel={getStatusLabel}
          getStatusColor={getStatusColor}
        />

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            getStatusLabel={getStatusLabel}
            getStatusColor={getStatusColor}
          />
        )}
      </main>

      <WhatsAppButton />
    </div>
  )
}
