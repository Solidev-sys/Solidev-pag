"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Printer, ArrowLeft } from "lucide-react"

interface OrderDetails {
  id: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping: number
  taxes: number
  total: number
  deliveryAddress: string
  estimatedDelivery: string
}

export function PaymentSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  useEffect(() => {
    // Simular carga de detalles del pedido
    const mockOrder: OrderDetails = {
      id: "ORD-2024-001234",
      items: [
        { name: "Laptop Gaming Pro", quantity: 1, price: 8000 },
        { name: "Secadora Industrial", quantity: 1, price: 322222 },
      ],
      subtotal: 330222,
      shipping: 500,
      taxes: 52835.52,
      total: 383557.52,
      deliveryAddress: "Av. Principal 123, Col. Centro\nCiudad de México, CP 01000",
      estimatedDelivery: "3-5 días hábiles",
    }
    setOrderDetails(mockOrder)
  }, [])

  const handlePrint = () => {
    window.print()
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-700">Cargando detalles del pedido...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">¡Pago Exitoso!</h1>
            <p className="text-green-600">Tu compra ha sido procesada correctamente</p>
          </div>

          {/* Order Number */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Número de Orden</span>
            </div>
            <p className="text-2xl font-bold text-green-900">#{orderDetails.id}</p>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Detalles de tu compra</h3>
              <div className="space-y-3">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${orderDetails.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>${orderDetails.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos:</span>
                  <span>${orderDetails.taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-green-600">${orderDetails.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-semibold mb-2">Información de entrega</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Dirección:</strong>
                  <p className="whitespace-pre-line">{orderDetails.deliveryAddress}</p>
                </div>
                <div>
                  <strong>Fecha estimada de entrega:</strong> {orderDetails.estimatedDelivery}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <a href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al inicio
                </a>
              </Button>
              <Button onClick={handlePrint} className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir recibo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
