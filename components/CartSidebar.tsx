"use client"

import { useEffect } from "react"
import { X, ShoppingCart, Minus, Plus, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { showNotification } from "@/lib/notifications"
import { apiService } from "@/lib/api"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, getTotal, clearCart, loadCart } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Refresh cart when sidebar opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadCart()
    }
  }, [isOpen, isAuthenticated, loadCart])

  // LOG 1/2: Estado general del carrito
  console.log('🔍 [CART-SIDEBAR 1/2] Estado del carrito:', {
    isOpen,
    itemsCount: items.length,
    total: getTotal(),
    items: items.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price }))
  });

  // LOG 2/2: Verificación de hooks y funciones
  console.log('🔍 [CART-SIDEBAR 2/2] Funciones del carrito:', {
    hasUpdateQuantity: typeof updateQuantity === 'function',
    hasRemoveItem: typeof removeItem === 'function',
    hasGetTotal: typeof getTotal === 'function',
    hasClearCart: typeof clearCart === 'function',
    totalValue: getTotal()
  });

  const handleCheckout = async () => {
    try {
      // Verificar que el usuario esté autenticado
      if (!isAuthenticated) {
        showNotification('Debes iniciar sesión para realizar una compra', 'error')
        router.push('/login')
        return
      }

      // Verificar que hay items en el carrito
      if (items.length === 0) {
        showNotification('El carrito está vacío', 'error')
        return
      }

      showNotification('Procesando pago...', 'info')
      
      // Llamar a la API para crear la preferencia de pago
      const response = await apiService.createPayment()
      
      // Redirigir a MercadoPago
      window.location.href = response.init_point
      
    } catch (error) {
      console.error('Error al procesar el pago:', error)
      showNotification('Error al procesar el pago. Inténtalo de nuevo.', 'error')
    }
  }

  const handleRemoveItem = async (productId: number, productName: string) => {
    try {
      console.log('CartSidebar - Removing item:', productId)
      await removeItem(productId)
      showNotification(`${productName} eliminado del carrito`)
    } catch (error) {
      console.error('Error removing item:', error)
      showNotification('Error al eliminar el producto', 'error')
    }
  }

  const handleUpdateQuantity = async (productId: number, newQuantity: number, productName: string) => {
    try {
      console.log('CartSidebar - Updating quantity:', productId, newQuantity)
      await updateQuantity(productId, newQuantity)
      if (newQuantity === 0) {
        showNotification(`${productName} eliminado del carrito`)
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      showNotification('Error al actualizar la cantidad', 'error')
    }
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-600 z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } shadow-xl flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-500 bg-gray-800">
        <h3 className="text-xl font-semibold text-white">Carrito de Compras</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10 p-2">
          <X size={20} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-300">
            <ShoppingCart size={64} className="mb-4 text-gray-400" />
            <p className="text-lg mb-4">Inicia sesión para ver tu carrito</p>
            <Button
              onClick={() => {
                router.push('/login')
                onClose()
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Iniciar Sesión
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-300">
            <ShoppingCart size={64} className="mb-4 text-gray-400" />
            <p className="text-lg">Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              // LOG 1/2: Verificar estructura del item
              console.log('🔍 [CART-SIDEBAR 1/2] Item completo:', item);
              console.log('🔍 [CART-SIDEBAR 2/2] Propiedades del item:', {
                id: item.id,
                name: item.name,
                price: item.price,
                priceType: typeof item.price,
                hasPrice: 'price' in item,
                allKeys: Object.keys(item)
              });

              return (
                <div key={item.id} className="bg-gray-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg flex-shrink-0" style={{ background: item.gradient }} />

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm leading-tight mb-1">{item.name}</h4>
                      <p className="text-gray-300 text-sm mb-2">
                        ${item.price}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.name)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 p-0 bg-gray-400 border-gray-400 hover:bg-gray-300"
                        >
                          <Minus size={12} />
                        </Button>
                        <span className="text-white font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.name)}
                          className="w-8 h-8 p-0 bg-gray-400 border-gray-400 hover:bg-gray-300"
                        >
                          <Plus size={12} />
                        </Button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  
                  {/* View Details Button */}
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        router.push(`/product/${item.id}`)
                        onClose()
                      }}
                      className="text-gray-300 border-gray-400 hover:bg-gray-400 hover:text-white text-xs px-2 py-1"
                    >
                      <Eye size={12} className="mr-1" />
                      Ver detalles
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer with Total and Checkout */}
      {isAuthenticated && items.length > 0 && (
        <div className="border-t border-gray-500 p-6 bg-gray-700">
          <div className="text-center mb-4">
            <span className="text-xl font-bold text-white">Total: ${getTotal().toFixed(2)}</span>
          </div>
          <Button onClick={handleCheckout} className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3">
            Proceder al Pago
          </Button>
        </div>
      )}
    </div>
  )
}
