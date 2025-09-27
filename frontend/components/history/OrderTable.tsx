"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"
import type { Order } from '@/types'

interface OrderTableProps {
  orders: Order[]
  onViewDetails: (order: Order) => void
  getStatusLabel: (status: string) => string
  getStatusColor: (status: string) => string
}

export function OrderTable({ orders, onViewDetails, getStatusLabel, getStatusColor }: OrderTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tus Pedidos Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">ID de Venta</th>
                <th className="text-left py-3 px-4 font-medium">Fecha</th>
                <th className="text-left py-3 px-4 font-medium">Total</th>
                <th className="text-left py-3 px-4 font-medium">Estado</th>
                <th className="text-right py-3 px-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                  <td className="py-3 px-4">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-semibold">${order.total.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(order)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
