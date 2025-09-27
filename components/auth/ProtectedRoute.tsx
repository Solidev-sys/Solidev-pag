"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { showNotification } from "@/lib/notifications"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireAdmin = false 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [adminValidated, setAdminValidated] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || isLoading) return

    if (requireAuth && !isAuthenticated) {
      showNotification("Debes iniciar sesión para acceder a esta página", "error")
      router.push("/login")
      return
    }

    // Si requiere admin, validar con el endpoint del backend
    if (requireAdmin && isAuthenticated && !adminValidated && !adminLoading) {
      setAdminLoading(true)
      const validateAdmin = async () => {
        try {
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
          const response = await fetch(`${API_BASE_URL}/api/admin/ping`, {
            credentials: 'include'
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.ok && data.role === 'admin') {
              setAdminValidated(true)
              return
            }
          }
          
          // Si no es admin o hay error, redirigir
          console.error("Admin validation failed:", response.status)
          showNotification("No tienes permisos para acceder a esta página", "error")
          router.push("/")
        } catch (error) {
          console.error("Error validating admin access:", error)
          showNotification("Error al validar permisos", "error")
          router.push("/")
        } finally {
          setAdminLoading(false)
        }
      }

      validateAdmin()
    }
  }, [isAuthenticated, isLoading, requireAuth, requireAdmin, router, mounted, adminValidated, adminLoading])

  // No renderizar nada hasta que esté montado
  if (!mounted) {
    return null
  }

  // Mostrar loading mientras se valida la autenticación básica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Si requiere admin, mostrar loading mientras se valida
  if (requireAdmin && adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos de administrador...</p>
        </div>
      </div>
    )
  }

  // Si requiere admin y no está validado, no mostrar nada (ya se redirigió)
  if (requireAdmin && !adminValidated) {
    return null
  }

  return <>{children}</>
}