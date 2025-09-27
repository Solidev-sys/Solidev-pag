"use client"

import { User, UserPlus, LogIn, Settings, ShoppingBag, Heart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { showNotification } from "@/lib/notifications"
import type { User as UserType } from "@/types"

interface UserDropdownProps {
  isOpen: boolean
  onClose: () => void
  user: UserType | null
  isAuthenticated: boolean
}

export function UserDropdown({ isOpen, onClose, user, isAuthenticated }: UserDropdownProps) {
  const router = useRouter()
  const { logout } = useAuth()

  if (!isOpen) return null

  const handleNavigation = (path: string) => {
    router.push(path)
    onClose()
  }

  const handleLogout = async () => {
    try {
      const success = await logout()
      if (success) {
        showNotification("Sesión cerrada correctamente", "success")
      } else {
        showNotification("Error al cerrar sesión", "error")
      }
    } catch (error) {
      showNotification("Error al cerrar sesión", "error")
    }
    onClose()
  }

  return (
    <div 
      className="user-dropdown absolute top-full right-0 mt-2 w-64 rounded-lg shadow-lg z-50"
      style={{
        backgroundColor: '#000000',
        border: '1px solid #e5e7eb'
      }}
    >
      {!isAuthenticated ? (
        // Guest dropdown
        <div className="p-4">
          <div 
            className="flex items-center gap-3 mb-4 pb-3"
            style={{ borderBottom: '1px solid #e5e7eb' }}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>
            <span className="font-medium text-white">Mi Cuenta</span>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => handleNavigation("/login")}
              className="w-full justify-start gap-2 text-white font-medium transition-all duration-200"
              style={{
                backgroundColor: '#222222'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF'
                e.currentTarget.style.color = '#000000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#222222'
                e.currentTarget.style.color = '#FFFFFF'
              }}
            >
              <LogIn size={16} />
              Iniciar Sesión
            </Button>
            <Button
              onClick={() => handleNavigation("/register")}
              className="w-full justify-start gap-2 text-white font-medium transition-all duration-200"
              style={{
                backgroundColor: '#191819'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF'
                e.currentTarget.style.color = '#000000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#191819'
                e.currentTarget.style.color = '#FFFFFF'
              }}
            >
              <UserPlus size={16} />
              Registrarse
            </Button>
          </div>
        </div>
      ) : (
        // Authenticated user dropdown
        <div className="p-4">
          <div 
            className="flex items-center gap-3 mb-4 pb-3"
            style={{ borderBottom: '1px solid #e5e7eb' }}
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">{user?.name}</div>
              <div 
                className="text-sm truncate"
                style={{ color: '#989898' }}
              >
                {user?.email}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Button
              onClick={() => handleNavigation("/history")}
              variant="ghost"
              className="w-full justify-start gap-2 text-white hover:bg-gray-50"
            >
              <ShoppingBag size={16} />
              Historial de Pedidos
            </Button>
            {user?.username === "admin" && (
              <Button
                onClick={() => handleNavigation("/admin")}
                variant="ghost"
                className="w-full justify-start gap-2 text-white hover:bg-gray-50"
              >
                <Settings size={16} />
                Panel de Admin
              </Button>
            )}
            <hr 
              className="my-2" 
              style={{ borderColor: '#e5e7eb' }}
            />
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-2 transition-all duration-200"
              style={{
                color: '#DC2626',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DC2626'
                e.currentTarget.style.color = '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#DC2626'
              }}
            >
              <LogOut size={16} />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
