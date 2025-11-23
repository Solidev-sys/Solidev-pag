"use client"
import { useEffect, useState } from "react"
import { Mail, Lock, User, Shield, CheckCircle, XCircle } from "lucide-react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminUsuarios() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/users`, { 
      credentials: 'include' 
    })
      .then(r => r.json())
      .then(x => {
        setList(Array.isArray(x) ? x : [])
        setLoading(false)
      })
      .catch(() => {
        setList([])
        setLoading(false)
      })
  }, [])

  const handleChangePassword = (userId: string, email: string) => {
    console.log(`Cambiar contraseña para usuario ${userId} - ${email}`)
    // Aquí irá la lógica para cambiar contraseña
  }

  const handleChangeEmail = (userId: string, email: string) => {
    console.log(`Cambiar correo para usuario ${userId} - ${email}`)
    // Aquí irá la lógica para cambiar correo
  }

  return (
    <ProtectedRoute requireAdmin>
      <AdminSidebar />
      <div className="min-h-screen p-8 pt-28 bg-home-dark-1">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Gestión de Usuarios
          </h2>
          <p className="text-slate-400">
            Total de usuarios: <span className="text-emerald-300 font-semibold">{list.length}</span>
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div 
              className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" 
              style={{
                borderColor: '#10B981',
                borderTopColor: 'transparent'
              }}
            />
          </div>
        )}

        {/* Users Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {list.map((user: any) => (
              <div
                key={user.id}
                // Ajuste de estilos base de la tarjeta
                className="group relative bg-dark-surface backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  borderColor: 'var(--dark-border-card)', // Usar variable de borde base
                  boxShadow: '0 0 0 rgba(0, 0, 0, 0)'
                }}
                onMouseEnter={(e) => {
                  // Mantenemos hover personalizado para el efecto de brillo acento
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.6)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--dark-border-card)' // Usar variable de borde base
                  e.currentTarget.style.boxShadow = '0 0 0 rgba(0, 0, 0, 0)'
                }}
              >
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #10B981, #00d9ff)',
                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
                      }}
                    >
                      <User className="w-10 h-10 text-white" />
                    </div>
                    {/* Status Badge */}
                    <div className="absolute -bottom-1 -right-1">
                      {user.estado === 'activo' ? (
                        // Usar bg-dark-main para el fondo del badge si está disponible, o un gris oscuro cercano
                        <CheckCircle className="w-6 h-6 text-green-400 bg-home-dark-1 rounded-full" /> 
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400 bg-home-dark-1 rounded-full" />
                      )}
                    </div>
                  </div>

                  {/* Username */}
                  <h3 className="text-xl font-bold text-white text-center mb-1">
                    {user.email.split('@')[0]}
                  </h3>
                  
                  {/* Email */}
                  <p className="text-sm text-slate-400 text-center break-all mb-2">
                    {user.email}
                  </p>
                </div>

                {/* User Info */}
                <div 
                  className="space-y-2 mb-4 pb-4 border-b"
                  style={{ borderColor: 'var(--dark-border-card)' }} // Borde usando la variable
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Rol:</span>
                    <span className="flex items-center gap-1 text-emerald-300 font-medium">
                      <Shield className="w-4 h-4" />
                      {user.rol}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.estado === 'activo' 
                        ? 'bg-home-green-notification/20 text-emerald-300' // Usar clase de color de acento
                        : 'bg-home-error/20 text-dark-error' // Usar clase de color de error
                    }`}>
                      {user.estado}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleChangePassword(user.id, user.email)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group/btn"
                    style={{
                      // Usar background/border oscuro y color de texto acento
                      background: 'var(--dark-surface-secondary)', 
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#10B981'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'
                      e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--dark-surface-secondary)'
                      e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Lock className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                    <span className="font-medium">Cambiar Contraseña</span>
                  </button>

                  <button
                    onClick={() => handleChangeEmail(user.id, user.email)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group/btn"
                    style={{
                      // Usar background/border oscuro y color de texto acento
                      background: 'var(--dark-surface-secondary)', 
                      border: '1px solid rgba(0, 217, 255, 0.3)',
                      color: '#00d9ff'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 217, 255, 0.2)'
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--dark-surface-secondary)'
                      e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)'
                    }}
                  >
                    <Mail className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span className="font-medium">Cambiar Correo</span>
                  </button>
                </div>

                {/* Hover Effect Overlay */}
                <div 
                  className="absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(0, 217, 255, 0.05))'
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && list.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <User className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">No hay usuarios registrados</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}