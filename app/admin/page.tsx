"use client"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminHome() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminSidebar />
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          {/* Título principal con efectos */}
          <div className="relative">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-400 to-emerald-300 bg-clip-text text-transparent animate-pulse">
              Bienvenidos a
            </h1>
            <h2 className="text-5xl md:text-6xl font-black mt-4 bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-500 bg-clip-text text-transparent">
              SoliDev Page Admin
            </h2>
            
            {/* Línea decorativa animada */}
            <div className="mt-8 flex justify-center">
              <div 
                className="w-64 h-1 rounded-full animate-pulse"
                style={{
                  background: 'linear-gradient(90deg, transparent, #10B981, #00d9ff, #10B981, transparent)'
                }}
              />
            </div>
          </div>

          {/* Texto descriptivo */}
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mt-8">
            Panel de control y gestión administrativa
          </p>

          {/* Elementos decorativos flotantes */}
          <div className="relative w-full h-32 mt-12">
            <div 
              className="absolute top-0 left-1/4 w-20 h-20 rounded-full blur-xl animate-bounce" 
              style={{ 
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent)',
                animationDuration: '3s' 
              }} 
            />
            <div 
              className="absolute top-4 right-1/4 w-16 h-16 rounded-full blur-xl animate-bounce" 
              style={{ 
                background: 'radial-gradient(circle, rgba(0, 217, 255, 0.3), transparent)',
                animationDuration: '2.5s', 
                animationDelay: '0.5s' 
              }} 
            />
            <div 
              className="absolute bottom-0 left-1/2 w-24 h-24 rounded-full blur-xl animate-bounce" 
              style={{ 
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent)',
                animationDuration: '3.5s', 
                animationDelay: '1s' 
              }} 
            />
          </div>

          {/* Badge de estado */}
          <div 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-sm mt-8"
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}
          >
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{
                background: 'linear-gradient(135deg, #10B981, #00d9ff)',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)'
              }}
            />
            <span className="text-emerald-300 font-medium">Sistema Operativo</span>
          </div>

          {/* Cards de acceso rápido */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            <div 
              className="p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 cursor-pointer group"
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                borderColor: 'rgba(16, 185, 129, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="text-3xl font-bold text-emerald-400 mb-2">{/* Número dinámico */}--</div>
              <div className="text-sm text-slate-400">Planes</div>
            </div>

            <div 
              className="p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 cursor-pointer group"
              style={{
                background: 'rgba(0, 217, 255, 0.05)',
                borderColor: 'rgba(0, 217, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 217, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="text-3xl font-bold text-cyan-400 mb-2">--</div>
              <div className="text-sm text-slate-400">Suscripciones</div>
            </div>

            <div 
              className="p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 cursor-pointer group"
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                borderColor: 'rgba(16, 185, 129, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="text-3xl font-bold text-emerald-400 mb-2">--</div>
              <div className="text-sm text-slate-400">Facturas</div>
            </div>

            <div 
              className="p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 cursor-pointer group"
              style={{
                background: 'rgba(0, 217, 255, 0.05)',
                borderColor: 'rgba(0, 217, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.5)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 217, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="text-3xl font-bold text-cyan-400 mb-2">--</div>
              <div className="text-sm text-slate-400">Usuarios</div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}