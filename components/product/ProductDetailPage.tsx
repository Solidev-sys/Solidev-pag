"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { WhatsAppButton } from "@/components/WhatsAppButton"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductSummary } from "@/components/product/ProductSummary"
import { ProductDetails } from "@/components/product/ProductDetails"
import { useCart } from "@/hooks/useCart"
import { showNotification } from "@/lib/notifications"
import { apiService } from "@/lib/api"
import { transformApiProduct } from "@/lib/utils"
import type { Product } from "@/types"
import { CartSidebar } from "@/components/CartSidebar"

interface ProductDetailPageProps {
  productId: string
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log(`[PRODUCT-DETAIL] Cargando producto con ID: ${productId}`)
        
        // Llamada a la API real
        const apiProduct = await apiService.getProduct(productId)
        console.log(`[PRODUCT-DETAIL] Datos recibidos de la API:`, apiProduct)
        
        // Transformar los datos de la API al formato del frontend
        const transformedProduct = transformApiProduct(apiProduct)
        console.log(`[PRODUCT-DETAIL] Producto transformado:`, transformedProduct)
        
        if (!transformedProduct) {
          throw new Error('No se pudo procesar la información del producto')
        }
        
        setProduct(transformedProduct)
        
      } catch (error) {
        console.error(`[PRODUCT-DETAIL] Error al cargar producto ${productId}:`, error)
        setError(error instanceof Error ? error.message : 'Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return

    addItem(product, quantity)
    showNotification(`${product.name} agregado al carrito`)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando producto...</p>
          </div>
        </div>
        <CartSidebar isOpen={false} onClose={() => {}} />
        <WhatsAppButton />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {error ? 'Error al cargar producto' : 'Producto no encontrado'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || 'El producto que buscas no existe.'}
            </p>
            <a
              href="/"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Volver al inicio
            </a>
          </div>
        </div>
        <CartSidebar isOpen={false} onClose={() => {}} />
        <WhatsAppButton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Product Hero Section */}
        <section className="grid lg:grid-cols-2 gap-8 mb-12">
          <ProductGallery 
            images={product.carousel && product.carousel.length > 0 ? product.carousel : [product.image ?? '']} 
            productName={product.name} 
          />
          <ProductSummary
            product={product}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* Product Details Section */}
        <ProductDetails 
          description={product.description ?? ''} 
          videoUrl={product.videoUrl ?? ''} 
        />
      </main>

      <CartSidebar isOpen={false} onClose={() => {}} />
      <WhatsAppButton />
    </div>
  )
}
