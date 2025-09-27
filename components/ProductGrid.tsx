"use client"

import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ShoppingCart, Loader2, Check, Eye, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { showNotification } from "@/lib/notifications"

import type { Product } from "@/types"

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => Promise<void>
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState<Set<number>>(new Set())
  const [successProducts, setSuccessProducts] = useState<Set<number>>(new Set())
  
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(products.length / getVisibleCount()))
    }, 5000)

    return () => clearInterval(interval)
  }, [products.length, isAutoRotating])

  const getVisibleCount = () => {
    if (typeof window === "undefined") return 3
    if (window.innerWidth >= 1024) return 3
    if (window.innerWidth >= 768) return 2
    return 1
  }

  const maxIndex = Math.max(0, Math.ceil(products.length / getVisibleCount()) - 1)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1))
    setIsAutoRotating(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + maxIndex + 1) % (maxIndex + 1))
    setIsAutoRotating(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoRotating(false)
  }

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    try {
      // Add product to loading state
      setLoadingProducts(prev => new Set(prev).add(product.id))
      
      // Call the parent's onAddToCart function
      await onAddToCart(product)
      
      // Show success state
      setSuccessProducts(prev => new Set(prev).add(product.id))
      
      // Remove success state after 2 seconds
      setTimeout(() => {
        setSuccessProducts(prev => {
          const newSet = new Set(prev)
          newSet.delete(product.id)
          return newSet
        })
      }, 2000)
      
    } catch (error) {
      console.error('Error adding to cart:', error)
      showNotification('Error al agregar el producto al carrito', 'error')
    } finally {
      // Remove loading state
      setLoadingProducts(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }
  }

  const getButtonContent = (product: Product) => {
    if (!isAuthenticated) {
      return (
        <>
          <User size={18} className="mr-2" />
          Iniciar Sesión
        </>
      )
    }

    const isLoading = loadingProducts.has(product.id)
    const isSuccess = successProducts.has(product.id)
    
    if (isLoading) {
      return (
        <>
          <Loader2 size={18} className="mr-2 animate-spin" />
          Agregando...
        </>
      )
    }
    
    if (isSuccess) {
      return (
        <>
          <Check size={18} className="mr-2" />
          ¡Agregado!
        </>
      )
    }

    return (
      <>
        <ShoppingCart size={18} className="mr-2" />
        Agregar al Carrito
      </>
    )
  }

  const getButtonStyle = (product: Product) => {
    if (!isAuthenticated) {
      return {
        background: "linear-gradient(135deg, #5e5e5e 0%, #231f27 100%)",
        color: "#FFFFFF",
        border: "none",
        boxShadow: "0 4px 8px rgba(102,126,234,0.3)"
      }
    }

    const isLoading = loadingProducts.has(product.id)
    const isSuccess = successProducts.has(product.id)
    
    if (isLoading) {
      return {
        background: "#434343",
        color: "#FFFFFF",
        border: "none",
        cursor: "not-allowed"
      }
    }
    
    if (isSuccess) {
      return {
        background: "linear-gradient(135deg, #4CAF50 0%, #45A049 100%)",
        color: "#FFFFFF",
        border: "none"
      }
    }

    return {
      background: "linear-gradient(135deg, #5e5e5e 0%, #231f27 100%)",
      color: "#FFFFFF",
      border: "none",
      boxShadow: "0 4px 8px rgba(102,126,234,0.3)"
    }
  }

  return (
    <div 
      className="rounded-3xl p-8 shadow-2xl"
      style={{ 
        backgroundColor: "#3c3c3c",
        border: "1px solid #4a4a4a"
      }}
    >
      {/* Product Grid Container */}
      <div className="relative overflow-hidden">
        <div
          className="product-grid-animated flex transition-transform duration-600 ease-in-out gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / Math.ceil(products.length / getVisibleCount()))}%)`,
          }}
        >
          {products.map((product, index) => (
            <div key={product.id} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3">
              <div 
                className="product-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                style={{ 
                  backgroundColor: "rgb(131,131,131)",
                  border: "2px solid #fff"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderTopWidth = "3px"
                  e.currentTarget.style.borderTopColor = "rgba(169,0,0,0.76)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderTopWidth = "2px"
                  e.currentTarget.style.borderTopColor = "#fff"
                }}
              >
                {/* Product Image */}
                <div
                  className="w-full h-48 rounded-xl mb-4 flex items-center justify-center"
                  style={{ 
                    background: product.gradient || "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                    border: "1px solid #4a4a4a"
                  }}
                >
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        // Fallback to gradient background if image fails to load
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                </div>

                {/* Product Name */}
                <h3 
                  className="font-semibold text-lg mb-4 text-center leading-tight"
                  style={{ color: "#FFFFFF" }}
                >
                  {product.name}
                </h3>

                {/* Pricing */}
                <div className="flex flex-col items-center gap-2 mb-4">
                  {product.originalPrice && (
                    <span 
                      className="line-through text-sm"
                      style={{ color: "#94A3B8" }}
                    >
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span 
                    className="font-bold text-xl"
                    style={{ color: "#FFFFFF" }}
                  >
                    ${product.price.toFixed(2)}
                  </span>
                  {product.discount && (
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        background: "#dc3545",
                        color: "#FFFFFF"
                      }}
                    >
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={loadingProducts.has(product.id)}
                  className="w-full py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                  style={getButtonStyle(product)}
                  onMouseEnter={(e) => {
                    if (!loadingProducts.has(product.id)) {
                      e.currentTarget.style.boxShadow = "0 6px 12px rgba(102,126,234,0.3)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loadingProducts.has(product.id)) {
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(102,126,234,0.3)"
                    }
                  }}
                  onMouseDown={(e) => {
                    if (!loadingProducts.has(product.id)) {
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(181,2,2,0.3)"
                    }
                  }}
                  onMouseUp={(e) => {
                    if (!loadingProducts.has(product.id)) {
                      e.currentTarget.style.boxShadow = "0 6px 12px rgba(102,126,234,0.3)"
                    }
                  }}
                >
                  {getButtonContent(product)}
                </Button>

                {/* View Details Button */}
                <Button
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="w-full py-2 mt-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #4CAF50 0%, #45A049 100%)",
                    color: "#FFFFFF",
                    border: "none"
                  }}
                >
                  <Eye size={16} className="mr-2" />
                  Ver detalles
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="flex justify-center items-center gap-5 mt-10">
        <Button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full transition-all duration-300 hover:scale-110"
          style={{
            background: "linear-gradient(135deg, #2e2e2e 0%, #5f5c5c 100%)",
            color: "#FFFFFF",
            border: "1px solid #4a4a4a"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(102,126,234,0.3)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none"
          }}
        >
          <ChevronLeft size={20} />
        </Button>

        {/* Indicators */}
        <div className="flex gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: index === currentIndex ? "#acd460" : "#cbd5e0",
                transform: index === currentIndex ? "scale(1.25)" : "scale(1)"
              }}
              onMouseEnter={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.backgroundColor = "#FFFFFF"
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.backgroundColor = "#cbd5e0"
                }
              }}
            />
          ))}
        </div>

        <Button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full transition-all duration-300 hover:scale-110"
          style={{
            background: "linear-gradient(135deg, #2e2e2e 0%, #5f5c5c 100%)",
            color: "#FFFFFF",
            border: "1px solid #4a4a4a"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(102,126,234,0.3)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none"
          }}
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Auto-rotation Indicator */}
      <div className="text-center mt-4">
        <span 
          className="text-sm flex items-center justify-center gap-2"
          style={{ color: "#FFFFFF" }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              backgroundColor: isAutoRotating ? "#FFFFFF" : "#434343",
              animation: isAutoRotating ? "pulse 2s infinite" : "none"
            }}
          />
          Auto-rotación cada 5 segundos
        </span>
      </div>
    </div>
  )
}
