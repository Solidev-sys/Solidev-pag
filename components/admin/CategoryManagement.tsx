"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Tag } from "lucide-react"
import { showNotification } from "@/lib/notifications"
import { adminApiService } from "@/lib/api"
import type { Category } from "@/types"

interface CategoryFormData {
  nombre: string
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState<CategoryFormData>({
    nombre: ""
  })

  useEffect(() => {
    setMounted(true)
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await adminApiService.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
      showNotification("Error al cargar categorías", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre.trim()) {
      showNotification("El nombre de la categoría es requerido", "error")
      return
    }

    try {
      setLoading(true)
      
      if (editingCategory) {
        await adminApiService.updateCategory(editingCategory.id, formData)
        showNotification("Categoría actualizada exitosamente", "success")
      } else {
        await adminApiService.createCategory(formData)
        showNotification("Categoría creada exitosamente", "success")
      }
      
      await loadCategories()
      resetForm()
    } catch (error: any) {
      console.error("Error saving category:", error)
      const errorMessage = error.message || "Error al guardar categoría"
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      nombre: category.nombre
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (category: Category) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.nombre}"?`)) {
      return
    }

    try {
      setLoading(true)
      await adminApiService.deleteCategory(category.id)
      showNotification("Categoría eliminada exitosamente", "success")
      await loadCategories()
    } catch (error: any) {
      console.error("Error deleting category:", error)
      const errorMessage = error.message || "Error al eliminar categoría"
      showNotification(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ nombre: "" })
    setEditingCategory(null)
    setIsFormOpen(false)
  }

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Categorías</h2>
          <p className="text-muted-foreground">
            Administra las categorías de productos
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Categoría</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Ej: Electrónicos, Ropa, Hogar..."
                  required
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Guardando..." : editingCategory ? "Actualizar" : "Crear"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Categorías */}
      <div className="grid gap-4">
        {loading && categories.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Tag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay categorías</h3>
              <p className="text-muted-foreground text-center mb-4">
                Comienza creando tu primera categoría para organizar tus productos.
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Categoría
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Tag className="h-5 w-5 text-green-600" />
                    {category.nombre}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      disabled={loading}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}