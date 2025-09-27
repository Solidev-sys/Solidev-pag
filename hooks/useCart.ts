"use client"

import { useState, useEffect, useCallback } from "react"
import type { Product, CartItem, BackendCartItem } from "@/types"
import { apiService } from "@/lib/api"
import { useAuth } from "./useAuth"

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  // Convert backend cart item to frontend cart item
  const convertBackendItem = useCallback((backendItem: BackendCartItem): CartItem => {
    return {
      id: backendItem.producto_id,
      name: backendItem.nombre,
      price: backendItem.precio_con_descuento || backendItem.precio,
      originalPrice: backendItem.precio_original,
      discount: backendItem.descuento_aplicado,
      image: backendItem.imagen_url,
      gradient: "from-blue-500 to-purple-600", // Default gradient
      stock: backendItem.stock,
      videoUrl: backendItem.video_url,
      quantity: backendItem.cantidad
    }
  }, [])

  // Load cart from API when user is authenticated
  const loadCart = useCallback(async () => {
    // LOG 1/2: Estado de autenticación y carga del carrito
    console.log('🔍 [CART-HOOK 1/2] Iniciando carga del carrito:', {
      isAuthenticated,
      currentItemsCount: items.length,
      loading,
      timestamp: new Date().toISOString()
    });

    if (!isAuthenticated) {
      console.log('🔍 [CART-HOOK 2/2] Usuario no autenticado - limpiando carrito');
      setItems([])
      return
    }
    
    try {
      setLoading(true)
      const backendItems = await apiService.getCart()
      console.log('Backend cart items:', backendItems) // Debug log
      
      // Convert backend items to frontend format
      const frontendItems = backendItems.map(convertBackendItem)
      setItems(frontendItems)
      console.log('Frontend cart items:', frontendItems) // Debug log
      
      // LOG 2/2: Resultado de la carga del carrito
      console.log('🔍 [CART-HOOK 2/2] Carrito cargado exitosamente:', {
        backendItemsCount: backendItems.length,
        frontendItemsCount: frontendItems.length,
        totalValue: frontendItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemsDetails: frontendItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      });
    } catch (error) {
      console.error("Error loading cart:", error)
      // If there's an error, keep the current items
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, convertBackendItem])

  // Load cart when authentication state changes
  useEffect(() => {
    loadCart()
  }, [loadCart])

  const addItem = useCallback(async (product: Product, quantity = 1) => {
    if (!isAuthenticated) {
      console.warn("User must be authenticated to add items to cart")
      throw new Error("Debes iniciar sesión para agregar productos al carrito")
    }

    try {
      setLoading(true)
      
      // Optimistic update - add item to local state immediately
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.image,
        gradient: product.gradient || "from-blue-500 to-purple-600",
        stock: product.stock,
        videoUrl: product.videoUrl,
        quantity: quantity
      }

      // Update local state immediately for instant feedback
      setItems(currentItems => {
        const existingItemIndex = currentItems.findIndex(item => item.id === product.id)
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const updatedItems = [...currentItems]
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity
          }
          return updatedItems
        } else {
          // Add new item
          return [...currentItems, newItem]
        }
      })

      // Make API call in background
      try {
        await apiService.addToCart(product.id, quantity)
        // Sync with backend after successful API call
        await loadCart()
      } catch (apiError) {
        console.error("API call failed, reverting optimistic update:", apiError)
        // Revert optimistic update by reloading cart from backend
        await loadCart()
        throw apiError
      }
    } catch (error) {
      console.error("Error adding item to cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, loadCart])

  const removeItem = useCallback(async (productId: number) => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      
      // Optimistic update - remove item from local state immediately
      const previousItems = items
      setItems(currentItems => currentItems.filter(item => item.id !== productId))
      
      try {
        // Make API call
        await apiService.removeFromCart(productId)
        // Reload cart to ensure consistency
        await loadCart()
      } catch (apiError) {
        console.error("API call failed, reverting optimistic update:", apiError)
        // Revert optimistic update
        setItems(previousItems)
        throw apiError
      }
    } catch (error) {
      console.error("Error removing item from cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, items, loadCart])

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    if (!isAuthenticated) return

    if (quantity <= 0) {
      await removeItem(productId)
      return
    }

    try {
      setLoading(true)
      
      // Store previous state for potential rollback
      const previousItems = items
      
      // Optimistic update - update quantity in local state immediately
      setItems(currentItems => 
        currentItems.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
      )
      
      try {
        // Make API call
        await apiService.updateCartItem(productId, quantity)
        // Reload cart to ensure consistency
        await loadCart()
      } catch (apiError) {
        console.error("API call failed, reverting optimistic update:", apiError)
        // Revert optimistic update
        setItems(previousItems)
        throw apiError
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, items, removeItem, loadCart])

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      
      // Store previous state for potential rollback
      const previousItems = items
      
      // Optimistic update - clear local state immediately
      setItems([])
      
      try {
        // Make API call
        await apiService.clearCart()
      } catch (apiError) {
        console.error("API call failed, reverting optimistic update:", apiError)
        // Revert optimistic update
        setItems(previousItems)
        throw apiError
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, items])

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [items])

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }, [items])

  return {
    items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getTotalItems,
    loadCart,
  }
}
