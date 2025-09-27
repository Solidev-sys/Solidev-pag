"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"

export function PaymentFailedPage() {
  const handleRetry = () => {
    // Redirigir al carrito o proceso de pago
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {/* Error Header */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-red-800 mb-2">Pago Fallido</h1>
          <p className="text-red-600 mb-6">Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.</p>

          {/* Error Details */}
          <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-red-800 mb-2">Posibles causas:</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Fondos insuficientes</li>
              <li>• Información de tarjeta incorrecta</li>
              <li>• Problema temporal del banco</li>
              <li>• Límite de transacción excedido</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Intentar Nuevamente
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <a href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </a>
            </Button>
          </div>

          {/* Support Info */}
          <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
            <p>¿Necesitas ayuda?</p>
            <p>
              Contacta nuestro soporte: <strong>soporte@tienda.com</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
