"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"
import type { User, AuthState } from "@/types"

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Verificar sesión al cargar
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      setIsLoading(true)
      const userResponse = await apiService.getCurrentUser()
      
      // El backend devuelve directamente el usuario, no envuelto en { user: ... }
      if (userResponse && userResponse.id) {
        setAuthState({ 
          user: {
            id: userResponse.id,
            name: userResponse.nombreCompleto || userResponse.username,
            email: userResponse.email || `${userResponse.username}@email.com`,
            username: userResponse.username,
            rol: userResponse.rol,
          }, 
          isAuthenticated: true 
        })
      } else {
        setAuthState({ user: null, isAuthenticated: false })
      }
    } catch (error) {
      // Manejo silencioso de errores de sesión - es normal no tener sesión activa
      setAuthState({ user: null, isAuthenticated: false })
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<{ success: boolean; redirectUrl?: string }> => {
    try {
      const response = await apiService.login({ username, password })
      if (response.user) {
        const user: User = {
          id: response.user.id,
          name: response.user.nombreCompleto || response.user.username,
          email: response.user.email || `${response.user.username}@email.com`,
          username: response.user.username,
          rol: response.user.rol,
        }
        setAuthState({ user, isAuthenticated: true })
        return { 
          success: true, 
          redirectUrl: response.redirectUrl || '/' 
        }
      }
      return { success: false }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false }
    }
  }

  const register = async (userData: {
    username: string;
    name: string;
    email: string;
    password: string;
    rut: string;
    phone: string;
    address: string;
    comuna: string;
    region: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const registerData = {
        username: userData.username,
        nombreCompleto: userData.name,
        email: userData.email,
        password: userData.password,
        rut: userData.rut,
        telefono: userData.phone,
        direccion: userData.address,
        ciudad: userData.comuna,
        region: userData.region,
      }

      const response = await apiService.register(registerData)
      
      if (response.user) {
        // Después del registro exitoso, hacer login automático
        const loginResult = await login(userData.username, userData.password)
        return { success: loginResult.success }
      }
      
      return { success: true }
    } catch (error: any) {
      console.error("Registration error:", error)
      return { 
        success: false, 
        message: error.message || "Error al registrar usuario" 
      }
    }
  }

  const logout = async (): Promise<boolean> => {
    try {
      await apiService.logout()
      setAuthState({ user: null, isAuthenticated: false })
      // Recargar la página después de cerrar sesión
      window.location.reload()
      return true
    } catch (error) {
      // Incluso si hay error en el servidor, limpiar estado local
      setAuthState({ user: null, isAuthenticated: false })
      // Recargar la página incluso si hay error
      window.location.reload()
      return false
    }
  }

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkSession,
  }
}
