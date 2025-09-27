"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye } from "lucide-react"
import { showNotification } from "@/lib/notifications"
import { adminApiService } from "@/lib/api"
import type { AdminOrder, BackendAdminOrder, OrderItem } from "@/types"

export function OrderManagement() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

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

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await adminApiService.getOrders()
      console.log("Datos del backend:", data) // Para debug
      
      // Transformar los datos del backend al formato esperado por el componente
      const transformedOrders: AdminOrder[] = data.map((order: BackendAdminOrder) => ({
        id: order.id.toString(),
        customerName: order.usuario_nombre || 'Usuario no disponible',
        customerEmail: order.usuario_email || 'Email no disponible',
        customerRut: order.usuario_rut || undefined,
        customerPhone: order.usuario_telefono || undefined,
        customerAddress: order.usuario_direccion || undefined,
        customerCity: order.usuario_ciudad || undefined,
        customerRegion: order.usuario_region || undefined,
        date: order.fecha,
        total: parseFloat(order.total.toString()) || 0,
        status: (order.estado as AdminOrder["status"]) || 'pendiente',
        items: order.detalles || []
      }))
      
      console.log("Datos transformados:", transformedOrders) // Para debug
      setOrders(transformedOrders)
    } catch (error) {
      console.error("Error loading orders:", error)
      showNotification("Error al cargar pedidos", "error")
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setLoading(true)
      await adminApiService.updateOrderStatus(orderId, newStatus)
      showNotification("Estado del pedido actualizado exitosamente", "success")
      
      // Actualizar el estado local
      setOrders(
        orders.map((order) => 
          order.id === orderId ? { ...order, status: newStatus as AdminOrder["status"] } : order
        )
      )
    } catch (error) {
      console.error("Error updating order status:", error)
      showNotification(
        error instanceof Error ? error.message : "Error al actualizar estado", 
        "error"
      )
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pendiente: "bg-yellow-100 text-yellow-800",
      completada: "bg-green-100 text-green-800",
      cancelada: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      pendiente: "Pendiente",
      completada: "Completada",
      cancelada: "Cancelada",
    }
    return labels[status as keyof typeof labels] || status
  }

  const handleViewDetails = (order: AdminOrder) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Pedidos</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="completada">Completada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">ID Pedido</th>
                  <th className="text-left py-3 px-4 font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium">Total</th>
                  <th className="text-left py-3 px-4 font-medium">Estado</th>
                  <th className="text-right py-3 px-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{new Date(order.date).toLocaleDateString('es-CL')}</td>
                      <td className="py-3 px-4 font-semibold">{formatCurrency(order.total)}</td>
                      <td className="py-3 px-4">
                        <Select 
                          value={order.status} 
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                          disabled={loading}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusLabel(order.status)}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="completada">Completada</SelectItem>
                            <SelectItem value="cancelada">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalles
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No hay pedidos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalles del pedido */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Pedido #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Información del cliente */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Información del Cliente</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Nombre:</span> {selectedOrder.customerName}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {selectedOrder.customerEmail}
                      </div>
                      {selectedOrder.customerRut && (
                        <div>
                          <span className="font-medium">RUT:</span> {selectedOrder.customerRut}
                        </div>
                      )}
                      {selectedOrder.customerPhone && (
                        <div>
                          <span className="font-medium">Teléfono:</span> {selectedOrder.customerPhone}
                        </div>
                      )}
                      {selectedOrder.customerAddress && (
                        <div>
                          <span className="font-medium">Dirección:</span> {selectedOrder.customerAddress}
                        </div>
                      )}
                      {selectedOrder.customerCity && (
                        <div>
                          <span className="font-medium">Ciudad:</span> {selectedOrder.customerCity}
                        </div>
                      )}
                      {selectedOrder.customerRegion && (
                        <div>
                          <span className="font-medium">Región:</span> {selectedOrder.customerRegion}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Información del Pedido</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">ID:</span> {selectedOrder.id}
                      </div>
                      <div>
                        <span className="font-medium">Fecha:</span> {new Date(selectedOrder.date).toLocaleString('es-CL')}
                      </div>
                      <div>
                        <span className="font-medium">Estado:</span>
                        <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusLabel(selectedOrder.status)}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> 
                        <span className="text-lg font-bold ml-2">{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Productos del pedido */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Productos del Pedido</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-medium">Producto</th>
                          <th className="text-center py-2 px-3 font-medium">Cantidad</th>
                          <th className="text-right py-2 px-3 font-medium">Precio Unit.</th>
                          <th className="text-right py-2 px-3 font-medium">Descuento</th>
                          <th className="text-right py-2 px-3 font-medium">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 px-3">
                              <div className="flex items-center space-x-3">
                                {item.imagen_url && (
                                  <img 
                                    src={item.imagen_url} 
                                    alt={item.producto}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )}
                                <span className="font-medium">{item.producto}</span>
                              </div>
                            </td>
                            <td className="py-2 px-3 text-center">{item.cantidad}</td>
                            <td className="py-2 px-3 text-right">{formatCurrency(item.precio_unitario)}</td>
                            <td className="py-2 px-3 text-right">{item.descuento}%</td>
                            <td className="py-2 px-3 text-right font-semibold">{formatCurrency(item.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2">
                          <td colSpan={4} className="py-3 px-3 text-right font-bold">Total:</td>
                          <td className="py-3 px-3 text-right font-bold text-lg">
                            {formatCurrency(selectedOrder.total)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
