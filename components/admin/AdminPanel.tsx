"use client"

import { ProductManagement } from "@/components/admin/ProductManagement"
import { DiscountManagement } from "@/components/admin/DiscountManagement"
import { OrderManagement } from "@/components/admin/OrderManagement"
import { CategoryManagement } from "@/components/admin/CategoryManagement"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"
import { Package, Percent, ShoppingBag, Tag, LogOut } from "lucide-react"
import { useEffect, useState } from "react"

export function AdminPanel() {
  const { logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  // Mostrar loading hasta que el componente esté montado
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Panel de Administrador</h1>
              <p className="text-muted-foreground">Gestiona productos, categorías, descuentos y pedidos</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <a href="/admin/history">Gestionar Historial</a>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Categorías
            </TabsTrigger>
            <TabsTrigger value="discounts" className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Descuentos
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Pedidos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>

          <TabsContent value="discounts">
            <DiscountManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
