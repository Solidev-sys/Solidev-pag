"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, ArrowLeft, RefreshCw } from "lucide-react"

export function PaymentPendingPage() {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const paymentId = params?.get('payment_id') || 'N/A'
  const amount = params?.get('amount') || '0'
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {/* Pending Header */}
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>

          <h1 className="text-2xl font-bold text-yellow-800 mb-2">Pago Pendiente</h1>
          <p className="text-yellow-700 mb-6">Tu pago está siendo procesado. Esto puede tomar unos minutos.</p>

          {/* Status Info */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-yellow-800 mb-2">Estado actual:</h3>
            <div className="flex items-center gap-2 text-sm text-yellow-700">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Verificando con el banco... (ID: {paymentId}, monto: {amount})</span>
            </div>
            <p className="text-xs text-yellow-600 mt-2">Tiempo estimado: 2-5 minutos</p>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Qué hacer ahora:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• No cierres esta ventana</li>
              <li>• No realices el pago nuevamente</li>
              <li>• Recibirás una confirmación por email</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleRefresh} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar Estado
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
            <p>¿El pago sigue pendiente después de 10 minutos?</p>
            <p>
              Contacta soporte: <strong>soporte@tienda.com</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
