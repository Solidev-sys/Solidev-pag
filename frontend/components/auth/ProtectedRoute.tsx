"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.replace("/login")
      return
    }

    if (requireAdmin) {
      const isAdmin = user?.rol === "admin" || user?.username === "admin"
      if (!isAdmin) {
        router.replace("/")
      }
    }
  }, [isLoading, isAuthenticated, requireAdmin, user, router])

  if (isLoading) return null
  if (!isAuthenticated) return null
  if (requireAdmin && !(user?.rol === "admin" || user?.username === "admin")) return null

  return <>{children}</>
}

export default ProtectedRoute