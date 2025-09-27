"use client"
import { useState, useEffect } from "react"
import { Header } from "./Header"
import { WhatsAppButton } from "./WhatsAppButton"
import { ProductGrid } from "./ProductGrid"
import { MarqueeBanner } from "./MarqueeBanner"
import { useCart } from "@/hooks/useCart"
import { showNotification } from "@/lib/notifications"
import { apiService } from "@/lib/api"
import { transformApiProduct } from "@/lib/utils"
import type { Product } from "@/types"

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔄 Fetching products from API...')
        const data = await apiService.getProducts()
        console.log('📦 Raw API response:', data)
        
        // Validar que data existe y es un array
        if (!Array.isArray(data)) {
          throw new Error('Formato de datos inválido recibido del servidor')
        }
        
        // Transformar los datos usando la utilidad
        const transformedProducts: Product[] = data
          .map(transformApiProduct)
          .filter(Boolean) as Product[]
        
        console.log('✅ Transformed products:', transformedProducts)
        console.log(`📊 Successfully processed ${transformedProducts.length} products`)
        
        setProducts(transformedProducts)
        setError(null)
        
        if (transformedProducts.length === 0) {
          showNotification('No se encontraron productos', 'info')
        }
        
      } catch (err) {
        console.error('❌ Error fetching products:', err)
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar los productos'
        setError(errorMessage)
        
        if (mounted) {
          showNotification(errorMessage, 'error')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [mounted])

  const handleAddToCart = async (product: Product): Promise<void> => {
    try {
      console.log('🛒 Adding product to cart:', product.name)
      
      // Validar producto antes de agregar
      if (!product.id || !product.name) {
        throw new Error('Producto inválido')
      }
      
      await addItem(product, 1)
      
      if (mounted) {
        showNotification(`${product.name} agregado al carrito`, 'success')
      }
      
      console.log('✅ Product successfully added to cart')
    } catch (error) {
      console.error('❌ Error adding to cart:', error)
      
      if (mounted) {
        if (error instanceof Error) {
          showNotification(error.message, 'error')
        } else {
          showNotification('Error al agregar al carrito', 'error')
        }
      }
      
      throw error
    }
  }

  // No renderizar hasta que esté montado (evita problemas de hidratación)
  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-home-dark-2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-home-light-2 mx-auto mb-4"></div>
          <div className="text-home-white text-xl">Cargando productos...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-home-dark-2 flex items-center justify-center">
        <div className="text-center">
          <div className="text-home-error text-xl mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-home-green-btn hover:bg-home-green-btn-hover text-home-white px-6 py-2 rounded-lg transition-colors shadow-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-home-dark-2">
      <Header />
      <MarqueeBanner />
      <main className="container mx-auto px-4 py-8">
        <ProductGrid products={products} onAddToCart={handleAddToCart} />
      </main>
      <WhatsAppButton />
    </div>
  )
}
