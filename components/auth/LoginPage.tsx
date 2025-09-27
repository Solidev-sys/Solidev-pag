"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { showNotification } from "@/lib/notifications"
import { Eye, EyeOff, LogIn } from "lucide-react"

export function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Por favor completa todos los campos")
      setIsLoading(false)
      return
    }

    try {
      const result = await login(formData.username, formData.password)

      if (result.success) {
        showNotification("Inicio de sesión exitoso", "success")
        // Usar la URL de redirección proporcionada por el backend
        router.push(result.redirectUrl || "/")
      } else {
        setError("Usuario o contraseña incorrectos")
        showNotification("Credenciales inválidas", "error")
      }
    } catch (error: any) {
      const errorMessage = error.message || "Error al iniciar sesión"
      setError(errorMessage)
      showNotification(errorMessage, "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-main">
      <Card className="w-full max-w-md border-dark-card bg-dark-surface shadow-dark-deep">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-dark-primary">Iniciar Sesión</CardTitle>
          <p className="text-dark-secondary">Accede a tu cuenta</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 rounded-md text-sm text-dark-error">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-dark-labels">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                disabled={isLoading}
                placeholder="Ingresa tu usuario"
                className="border-dark-card bg-dark-secondary text-dark-primary placeholder:text-dark-secondary focus:bg-dark-focus focus:ring-dark-focus shadow-dark-soft transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-dark-labels">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  disabled={isLoading}
                  placeholder="Ingresa tu contraseña"
                  className="border-dark-card bg-dark-secondary text-dark-primary placeholder:text-dark-secondary focus:bg-dark-focus focus:ring-dark-focus shadow-dark-soft transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-secondary hover:text-dark-hover transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full font-medium bg-dark-btn-primary text-dark-button border-0 hover:bg-dark-btn-hover hover:text-dark-btn-hover hover:border-dark-hover transition-all duration-200 shadow-dark-soft" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Ingresar
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-dark-secondary">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="font-medium underline text-dark-labels hover:text-dark-hover transition-colors">
                  Registrarse
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
