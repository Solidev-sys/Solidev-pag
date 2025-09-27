"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { showNotification } from "@/lib/notifications"
import { adminApiService } from "@/lib/api"
import type { Discount, SimpleProduct, BackendDiscount, DiscountFormData } from "@/types"

export function DiscountManagement() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [products, setProducts] = useState<SimpleProduct[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    productId: "",
    minQuantity: "",
    percentage: "",
    active: true,
  })

  useEffect(() => {
    setMounted(true)
    loadDiscounts()
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await adminApiService.getProductsForSelect()
      console.log('Datos de productos recibidos:', data)
      setProducts(data)
      console.log('Productos procesados:', data)
    } catch (error) {
      console.error("Error loading products:", error)
      showNotification("Error al cargar productos", "error")
    }
  }

  const loadDiscounts = async () => {
    try {
      setLoading(true)
      const data = await adminApiService.getDiscounts()
      console.log('Datos de descuentos recibidos:', data)
      
      // Transformar los datos del backend al formato esperado por el frontend
      const transformedDiscounts: Discount[] = data.map((discount: BackendDiscount) => ({
        id: discount.id.toString(),
        productId: discount.producto_id.toString(),
        productName: discount.productName || 'Producto no encontrado',
        minQuantity: discount.minQuantity,
        percentage: discount.percentage,
        active: discount.active ?? true
      }))
      
      setDiscounts(transformedDiscounts)
    } catch (error) {
      console.error("Error loading discounts:", error)
      showNotification("Error al cargar descuentos", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validar que se haya seleccionado un producto
    if (!formData.productId) {
      showNotification("Debe seleccionar un producto", "error")
      setLoading(false)
      return
    }

    // Preparar los datos para enviar al backend
    const discountData: DiscountFormData = {
      productId: Number(formData.productId),
      minQuantity: Number(formData.minQuantity),
      percentage: Number(formData.percentage),
      active: formData.active
    }

    try {
      if (editingDiscount) {
        await adminApiService.updateDiscount(editingDiscount.id, discountData)
        showNotification("Descuento actualizado correctamente", "success")
      } else {
        await adminApiService.createDiscount(discountData)
        showNotification("Descuento creado correctamente", "success")
      }
      
      setIsFormOpen(false)
      resetForm()
      loadDiscounts()
    } catch (error) {
      console.error("Error saving discount:", error)
      showNotification(
        error instanceof Error ? error.message : "Error al guardar el descuento", 
        "error"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este descuento?")) return

    try {
      setLoading(true)
      
      console.log('Intentando eliminar descuento con ID:', id)
      
      const response = await adminApiService.deleteDiscount(id)
      
      console.log('Respuesta del servidor:', response)
      
      // Verificar que la respuesta indique éxito
      if (response && (response.message || response)) {
        showNotification("Descuento eliminado correctamente", "success")
        await loadDiscounts() // Recargar la lista
      } else {
        throw new Error('Respuesta inesperada del servidor')
      }
      
    } catch (error) {
      console.error("Error deleting discount:", error)
      
      let errorMessage = "Error al eliminar el descuento"
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      productId: "",
      minQuantity: "",
      percentage: "",
      active: true,
    })
    setEditingDiscount(null)
  }

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount)
    setFormData({
      productId: discount.productId,
      minQuantity: discount.minQuantity.toString(),
      percentage: discount.percentage.toString(),
      active: discount.active,
    })
    setIsFormOpen(true)
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Descuentos</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Descuento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDiscount ? "Editar Descuento" : "Nuevo Descuento"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="product">Producto</Label>
                <Select 
                  value={formData.productId} 
                  onValueChange={(value) => setFormData({ ...formData, productId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No hay productos disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minQuantity">Cantidad Mínima</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    min="1"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="percentage">Porcentaje de Descuento</Label>
                  <Input
                    id="percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="active">Descuento activo</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : editingDiscount ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && discounts.length === 0 ? (
        <div className="text-center py-8">Cargando descuentos...</div>
      ) : (
        <div className="grid gap-4">
          {discounts.map((discount) => (
            <Card key={discount.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{discount.productName}</h3>
                      <Badge variant={discount.active ? "default" : "secondary"}>
                        {discount.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Cantidad mínima:</span> {discount.minQuantity}
                      </div>
                      <div>
                        <span className="font-medium">Descuento:</span> {discount.percentage}%
                      </div>
                      <div>
                        <span className="font-medium">ID Producto:</span> {discount.productId}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(discount)}
                      disabled={loading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(discount.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {discounts.length === 0 && !loading && (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No hay descuentos configurados
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
