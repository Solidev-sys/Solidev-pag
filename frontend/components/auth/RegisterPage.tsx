"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { showNotification } from "@/lib/notifications"
import { Eye, EyeOff, UserPlus } from "lucide-react"

const REGIONES_CHILE = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
]

export function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    rut: "",
    phone: "",
    address: "",
    comuna: "",
    region: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { register } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) newErrors.username = "Usuario es requerido"
    if (!formData.name.trim()) newErrors.name = "Nombre completo es requerido"
    if (!formData.email.trim()) newErrors.email = "Correo es requerido"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Correo inválido"
    if (!formData.password.trim()) newErrors.password = "Contraseña es requerida"
    else if (formData.password.length < 6) newErrors.password = "Contraseña debe tener al menos 6 caracteres"
    if (!formData.rut.trim()) newErrors.rut = "RUT es requerido"
    if (!formData.phone.trim()) newErrors.phone = "Teléfono es requerido"
    if (!formData.address.trim()) newErrors.address = "Dirección es requerida"
    if (!formData.comuna.trim()) newErrors.comuna = "Comuna es requerida"
    if (!formData.region) newErrors.region = "Región es requerida"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showNotification("Por favor completa todos los campos correctamente", "error")
      return
    }

    setIsLoading(true)

    try {
      const result = await register({
        username: formData.username,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        rut: formData.rut,
        phone: formData.phone,
        address: formData.address,
        comuna: formData.comuna,
        region: formData.region,
      })

      if (result.success) {
        showNotification("Registro exitoso", "success")
        router.push("/")
      } else {
        showNotification(result.message || "Error al registrar usuario", "error")
      }
    } catch (error) {
      showNotification("Error al registrar usuario", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-main">
      <Card className="w-full max-w-2xl border-dark-card bg-dark-surface shadow-dark-deep">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-dark-primary">Registro de Usuario</CardTitle>
          <p className="text-dark-secondary">Crea tu cuenta</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-dark-labels">Usuario *</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className={`border-dark-card bg-dark-secondary text-dark-primary placeholder:text-dark-secondary focus:bg-dark-focus focus:ring-dark-focus shadow-dark-soft transition-colors ${errors.username ? "ring-1 ring-red-500" : ""}`}
                  disabled={isLoading}
                  placeholder="Nombre de Usuario"
                />
                {errors.username && <p className="text-sm text-dark-error">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-dark-labels">Nombre Completo *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`border-dark-card bg-dark-secondary text-dark-primary placeholder:text-dark-secondary focus:bg-dark-focus focus:ring-dark-focus shadow-dark-soft transition-colors ${errors.name ? "ring-1 ring-red-500" : ""}`}
                  disabled={isLoading}
                  placeholder="Nombre y Apellidos"
                />
                {errors.name && <p className="text-sm text-dark-error">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-dark-labels">Correo *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`border-dark-card bg-dark-secondary text-dark-primary placeholder:text-dark-secondary focus:bg-dark-focus focus:ring-dark-focus shadow-dark-soft transition-colors ${errors.email ? "ring-1 ring-red-500" : ""}`}
                  disabled={isLoading}
                  placeholder="Correo Electrónico"
                />
                {errors.email && <p className="text-sm text-dark-error">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rut" className="text-dark-labels">RUT *</Label>
                <Input
                  id="rut"
                  type="text"
                  placeholder="12.345.678-9"
                  value={formData.rut}
                  onChange={(e) => handleInputChange("rut", e.target.value)}
                  className={`border-dark-card bg-dark-secondary text-dark-primary placeholder:text-dark-secondary focus:bg-dark-focus focus:ring-dark-focus shadow-dark-soft transition-colors ${errors.rut ? "ring-1 ring-red-500" : ""}`}
                  disabled={isLoading}
                />
                {errors.rut && <p className="text-sm text-dark-error">{errors.rut}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-dark-labels">Teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`border-dark-card bg-dark-secondary text-dark-primary placeholder:text-dark-secondary focus:bg-dark-focus focus:ring-dark-focus shadow-dark-soft transition-colors ${errors.phone ? "ring-1 ring-red-500" : ""}`}
                  disabled={isLoading}
                />
                {errors.phone && <p className="text-sm text-dark-error">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-dark-labels">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`border-dark-card bg-dark-secondary text-dark-primary placeholder:text-dark-secondary focus:bg-dark-focus focus:ring-dark-focus shadow-dark-soft transition-colors pr-10 ${errors.password ? "ring-1 ring-red-500" : ""}`}
                    disabled={isLoading}
                    placeholder="Contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-secondary hover:text-dark-hover transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-dark-error">{errors.password}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-dark-labels">Dirección *</Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`border-dark-card bg-dark-secondary text-dark-primary placeholder:text-dark-secondary focus:bg-dark-focus focus:ring-dark-focus shadow-dark-soft transition-colors ${errors.address ? "ring-1 ring-red-500" : ""}`}
                disabled={isLoading}
                placeholder="Dirección de Entrega"
              />
              {errors.address && <p className="text-sm text-dark-error">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="comuna" className="text-dark-labels">Comuna *</Label>
                <Input
                  id="comuna"
                  type="text"
                  value={formData.comuna}
                  onChange={(e) => handleInputChange("comuna", e.target.value)}
                  className={`border-dark-card bg-dark-secondary text-dark-primary placeholder:text-dark-secondary focus:bg-dark-focus focus:ring-dark-focus shadow-dark-soft transition-colors ${errors.comuna ? "ring-1 ring-red-500" : ""}`}
                  disabled={isLoading}
                  placeholder="Comuna"
                />
                {errors.comuna && <p className="text-sm text-dark-error">{errors.comuna}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="region" className="text-dark-labels">Región *</Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => handleInputChange("region", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger 
                    className={`border-dark-card bg-dark-secondary text-dark-primary focus:bg-dark-focus focus:ring-dark-focus shadow-dark-soft transition-colors ${errors.region ? "ring-1 ring-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Selecciona tu Región" className="text-dark-secondary" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-secondary border-dark-card">
                    {REGIONES_CHILE.map((region) => (
                      <SelectItem 
                        key={region} 
                        value={region} 
                        className="text-dark-primary hover:bg-dark-focus transition-colors"
                      >
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && <p className="text-sm text-dark-error">{errors.region}</p>}
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
                  Registrando...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Registrarse
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-dark-secondary">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="font-medium underline text-dark-labels hover:text-dark-hover transition-colors">
                  Inicia Sesión
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
