"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import type { Product } from "@/types"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { User } from "lucide-react"

interface ProductSummaryProps {
  product: Product
  quantity: number
  onQuantityChange: (quantity: number) => void
  onAddToCart: () => void
}

export function ProductSummary({ product, quantity, onQuantityChange, onAddToCart }: ProductSummaryProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleButtonClick = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    onAddToCart()
  }

  return (
    <div className="space-y-6">
      {/* Title and Price */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-2xl font-semibold text-primary">${product.price}</p>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="h-10 w-10 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuantityChange(quantity + 1)}
                disabled={quantity >= (product.stock ?? 0)}
                className="h-10 w-10 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button 
            onClick={handleButtonClick} 
            className="flex-1" 
            disabled={product.stock === 0}
          >
            {!isAuthenticated ? (
              <>
                <User className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </>
            ) : (
              "Agregar al Carrito"
            )}
          </Button>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${(product.stock ?? 0) > 0 ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-muted-foreground">{(product.stock ?? 0) > 0 ? "En Stock" : "Sin Stock"}</span>
        </div>
      </div>
    </div>
  )
}
