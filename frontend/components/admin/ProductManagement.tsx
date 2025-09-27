"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, X } from "lucide-react"
import { showNotification } from "@/lib/notifications"
import { adminApiService } from "@/lib/api"
import type { Category, ProductFormData, AdminProduct } from "@/types"


export function ProductManagement() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    selectedCategories: [] as number[],
    status: "activo" as "activo" | "inactivo" | "mantenimiento",
    discount: "",
    image: "",
    video: "",
    carouselImages: [""],
  })

  useEffect(() => {
    setMounted(true)
    loadProducts()
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const categoriesData = await adminApiService.getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await adminApiService.getProducts() as any[]
      
      // Mapear los datos de la API a la estructura esperada por el frontend
      const mappedProducts = data.map((product: any): AdminProduct => {
        // Usar las categorías que ya vienen incluidas en la respuesta
        const productCategories: Category[] = product.categorias || []

        return {
          id: product.id,
          name: product.nombre || product.name,
          price: product.precio || product.price,
          stock: product.stock,
          description: product.descripcion || product.description,
          categories: productCategories,
          status: product.estado || product.status || 'activo',
          discount: product.descuento || product.discount || 0,
          image: product.imagen_url || product.image || '',
          video: product.video_url || product.video || '',
          carouselImages: (() => {
            try {
              if (product.img_carrusel) {
                const parsed = JSON.parse(product.img_carrusel)
                return parsed.imagenes || [""]
              }
              return [""]
            } catch {
              return [""]
            }
          })()
        }
      })
      
      setProducts(mappedProducts)
    } catch (error) {
      console.error("Error loading products:", error)
      showNotification("Error al cargar productos", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Función para validar si una cadena es una URL válida
    const isValidUrl = (string: string) => {
      if (!string || string.trim() === '') return false
      try {
        new URL(string)
        return true
      } catch (_) {
        return false
      }
    }

    // Mapear los datos del formulario a los nombres de campos que espera la API
    const productData: ProductFormData = {
      nombre: formData.name,
      precio: Number(formData.price),
      stock: Number(formData.stock),
      descripcion: formData.description,
      estado: formData.status,
      descuento: Number(formData.discount),
      imagen_url: formData.image,
      img_carrusel: JSON.stringify({ imagenes: formData.carouselImages.filter(img => img.trim() !== '') }),
      categorias: formData.selectedCategories
    }

    // Debug logs
    console.log('FormData selectedCategories:', formData.selectedCategories)
    console.log('ProductData categorias:', productData.categorias)
    console.log('ProductData completo:', productData)

    // Solo agregar video_url si es una URL válida
    if (isValidUrl(formData.video)) {
      productData.video_url = formData.video
    }

    try {
      if (editingProduct) {
        await adminApiService.updateProduct(editingProduct.id, productData)
        showNotification("Producto actualizado exitosamente", "success")
      } else {
        await adminApiService.createProduct(productData)
        showNotification("Producto creado exitosamente", "success")
      }
      
      setIsFormOpen(false)
      resetForm()
      loadProducts()
    } catch (error) {
      console.error("Error saving product:", error)
      
      let errorMessage = "Error al guardar el producto"
      if (error instanceof Error) {
        if (error.message.includes("Validation error")) {
          if (error.message.includes("URL válida")) {
            errorMessage = "La URL del video no es válida. Debe ser una URL completa (ej: https://youtube.com/watch?v=...)"
          } else {
            errorMessage = "Error de validación en los datos del producto"
          }
        } else {
          errorMessage = error.message
        }
      }
      
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return

    try {
      setLoading(true)
      await adminApiService.deleteProduct(id)
      showNotification("Producto eliminado correctamente", "success")
      loadProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      showNotification("Error al eliminar el producto", "error")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      stock: "",
      description: "",
      selectedCategories: [],
      status: "activo",
      discount: "",
      image: "",
      video: "",
      carouselImages: [""],
    })
    setEditingProduct(null)
  }

  const handleEdit = (product: AdminProduct) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      selectedCategories: product.categories.map(cat => cat.id),
      status: product.status,
      discount: product.discount.toString(),
      image: product.image,
      video: product.video || '',
      carouselImages: product.carouselImages.length > 0 ? product.carouselImages : [""],
    })
    setIsFormOpen(true)
  }

  const addCarouselImage = () => {
    setFormData({
      ...formData,
      carouselImages: [...formData.carouselImages, ""]
    })
  }

  const removeCarouselImage = (index: number) => {
    const newImages = formData.carouselImages.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      carouselImages: newImages.length > 0 ? newImages : [""]
    })
  }

  const updateCarouselImage = (index: number, value: string) => {
    const newImages = [...formData.carouselImages]
    newImages[index] = value
    setFormData({
      ...formData,
      carouselImages: newImages
    })
  }

  const toggleCategory = (categoryId: number) => {
    const isSelected = formData.selectedCategories.includes(categoryId)
    if (isSelected) {
      setFormData({
        ...formData,
        selectedCategories: formData.selectedCategories.filter(id => id !== categoryId)
      })
    } else {
      setFormData({
        ...formData,
        selectedCategories: [...formData.selectedCategories, categoryId]
      })
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Categorías</Label>
                  <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={formData.selectedCategories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                            className="rounded"
                          />
                          <label htmlFor={`category-${category.id}`} className="text-sm">
                            {category.nombre}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No hay categorías disponibles</p>
                    )}
                  </div>
                  {formData.selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.selectedCategories.map(categoryId => {
                        const category = categories.find(cat => cat.id === categoryId)
                        return category ? (
                          <Badge key={categoryId} variant="secondary" className="text-xs">
                            {category.nombre}
                            <button
                              type="button"
                              onClick={() => toggleCategory(categoryId)}
                              className="ml-1 hover:bg-gray-300 rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ) : null
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Descuento (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image">URL de Imagen Principal</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="video">URL de Video (opcional)</Label>
                  <Input
                    id="video"
                    value={formData.video}
                    onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value: "activo" | "inactivo" | "mantenimiento") => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Imágenes del Carrusel</Label>
                <div className="space-y-2">
                  {formData.carouselImages.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={image}
                        onChange={(e) => updateCarouselImage(index, e.target.value)}
                        placeholder="URL de imagen del carrusel"
                      />
                      {formData.carouselImages.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCarouselImage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCarouselImage}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Imagen
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : editingProduct ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && products.length === 0 ? (
        <div className="text-center py-8">Cargando productos...</div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <Badge variant={product.status === 'activo' ? 'default' : product.status === 'inactivo' ? 'destructive' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{product.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Precio:</span> ${product.price}
                      </div>
                      <div>
                        <span className="font-medium">Stock:</span> {product.stock}
                      </div>
                      <div>
                        <span className="font-medium">Descuento:</span> {product.discount}%
                      </div>
                      <div>
                        <span className="font-medium">Categorías:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.categories.length > 0 ? (
                            product.categories.map((category) => (
                              <Badge key={category.id} variant="outline" className="text-xs">
                                {category.nombre}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500">Sin categorías</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {products.length === 0 && !loading && (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No hay productos disponibles
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
