"use client"
import { useEffect, useState } from "react"
import { Users, Calendar, CreditCard, CheckCircle, Clock, XCircle, Pause, AlertCircle, Sparkles, TrendingUp, Activity } from "lucide-react"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminSuscripciones() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/suscripciones`, { 
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

  const getEstadoConfig = (estado: string) => {
    const configs = {
      activa: {
        icon: CheckCircle,
        color: '#10B981',
        textColor: 'text-[#10B981]',
        gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        bgGradient: 'from-[#10B981]/10 to-[#059669]/5',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        glow: '0 0 20px rgba(16, 185, 129, 0.3)',
        label: 'Activa'
      },
      pendiente: {
        icon: Clock,
        color: '#F59E0B',
        textColor: 'text-[#F59E0B]',
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        bgGradient: 'from-[#F59E0B]/10 to-[#D97706]/5',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        glow: '0 0 20px rgba(245, 158, 11, 0.3)',
        label: 'Pendiente'
      },
      autorizada: {
        icon: CheckCircle,
        color: '#00d9ff',
        textColor: 'text-[#00d9ff]',
        gradient: 'linear-gradient(135deg, #00d9ff 0%, #0891B2 100%)',
        bgGradient: 'from-[#00d9ff]/10 to-[#0891B2]/5',
        borderColor: 'rgba(0, 217, 255, 0.3)',
        glow: '0 0 20px rgba(0, 217, 255, 0.3)',
        label: 'Autorizada'
      },
      pausada: {
        icon: Pause,
        color: '#94A3B8',
        textColor: 'text-[#94A3B8]',
        gradient: 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)',
        bgGradient: 'from-[#94A3B8]/10 to-[#64748B]/5',
        borderColor: 'rgba(148, 163, 184, 0.3)',
        glow: '0 0 20px rgba(148, 163, 184, 0.2)',
        label: 'Pausada'
      },
      cancelada: {
        icon: XCircle,
        color: '#DC3545',
        textColor: 'text-[#DC3545]',
        gradient: 'linear-gradient(135deg, #DC3545 0%, #DC2626 100%)',
        bgGradient: 'from-[#DC3545]/10 to-[#DC2626]/5',
        borderColor: 'rgba(220, 53, 69, 0.3)',
        glow: '0 0 20px rgba(220, 53, 69, 0.3)',
        label: 'Cancelada'
      },
      expirada: {
        icon: AlertCircle,
        color: '#DC2626',
        textColor: 'text-[#DC2626]',
        gradient: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
        bgGradient: 'from-[#DC2626]/10 to-[#991B1B]/5',
        borderColor: 'rgba(220, 38, 38, 0.3)',
        glow: '0 0 20px rgba(220, 38, 38, 0.3)',
        label: 'Expirada'
      }
    }
    return configs[estado as keyof typeof configs] || configs.pendiente
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <div className="min-h-screen bg-home-dark-1 flex items-center justify-center">
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #10B981, #00d9ff)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              <Activity className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-home-white text-lg font-semibold">Cargando suscripciones...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AdminSidebar />
      <div className="min-h-screen bg-home-dark-1 py-8 px-4 sm:px-6 lg:px-8">
      {/* Patrón de fondo sutil */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #10B981 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Premium */}
        <div className="mb-10">
          {/* Glow effect background */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 blur-[120px] opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #10B981, #00d9ff, transparent)',
            }}
          />

          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #00d9ff)',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
              >
                <CreditCard className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 
                  className="text-4xl font-black tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, #10B981, #00d9ff, #059669)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    backgroundSize: '200%',
                    animation: 'gradient-flow 4s ease infinite'
                  }}
                >
                  Suscripciones
                </h1>
                <p className="text-home-gray-ui-1 text-sm font-medium">
                  Gestiona y monitorea todas las suscripciones del sistema
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {/* Total */}
              <div 
                className="relative bg-home-dark-3 rounded-2xl p-5 border backdrop-blur-sm overflow-hidden group hover:scale-105 transition-all duration-500"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(0, 217, 255, 0.05))'
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-home-gray-ui-2 text-sm font-medium mb-1">Total</p>
                    <p className="text-home-white text-3xl font-black">{list.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-home-gray-ui-1" strokeWidth={2} />
                </div>
              </div>

              {/* Activas */}
              <div 
                className="relative rounded-2xl p-5 border backdrop-blur-sm overflow-hidden group hover:scale-105 transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.2)'
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15), transparent 70%)'
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-[#10B981] text-sm font-medium mb-1">Activas</p>
                    <p className="text-home-white text-3xl font-black">
                      {list.filter(s => s.estado === 'activa').length}
                    </p>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Pendientes */}
              <div 
                className="relative rounded-2xl p-5 border backdrop-blur-sm overflow-hidden group hover:scale-105 transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
                  borderColor: 'rgba(245, 158, 11, 0.3)',
                  boxShadow: '0 4px 20px rgba(245, 158, 11, 0.2)'
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.15), transparent 70%)'
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-[#F59E0B] text-sm font-medium mb-1">Pendientes</p>
                    <p className="text-home-white text-3xl font-black">
                      {list.filter(s => s.estado === 'pendiente').length}
                    </p>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)'
                    }}
                  >
                    <Clock className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Suscripciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {list.map((sub: any, index: number) => {
            const estadoConfig = getEstadoConfig(sub.estado)
            const IconoEstado = estadoConfig.icon

            return (
              <div
                key={sub.id}
                className="group relative rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500"
                style={{
                  opacity: 0,
                  animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`
                }}
              >
                {/* Borde animado superior */}
                <div 
                  className="h-1 w-full"
                  style={{
                    background: estadoConfig.gradient,
                    backgroundSize: '200%',
                    animation: 'gradient-flow 3s ease infinite'
                  }}
                />

                {/* Card Container */}
                <div 
                  className="relative backdrop-blur-sm border"
                  style={{
                    background: `linear-gradient(180deg, ${sub.estado === 'activa' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(25, 24, 25, 0.8)'} 0%, rgba(17, 17, 17, 0.95) 100%)`,
                    borderColor: estadoConfig.borderColor,
                    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), ${estadoConfig.glow}`
                  }}
                >
                  {/* Patrón de fondo interno */}
                  <div 
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)',
                      backgroundSize: '32px 32px',
                      color: estadoConfig.color
                    }}
                  />

                  <div className="relative p-6">
                    {/* Header de la tarjeta */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            <Users className="w-5 h-5 text-home-gray-ui-1" strokeWidth={2} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-home-white">
                              {sub.Usuario?.email || 'Usuario desconocido'}
                            </h3>
                            <p className="text-xs text-home-gray-ui-2 font-mono">ID: {sub.id}</p>
                          </div>
                        </div>
                      </div>

                      {/* Badge de estado premium */}
                      <div 
                        className="relative flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-sm"
                        style={{
                          background: `${estadoConfig.gradient}10`,
                          borderColor: estadoConfig.borderColor,
                          boxShadow: `0 4px 16px ${estadoConfig.color}20`
                        }}
                      >
                        <IconoEstado 
                          className={`w-4 h-4 ${estadoConfig.textColor}`} 
                          strokeWidth={2.5}
                        />
                        <span className={`text-sm font-bold ${estadoConfig.textColor}`}>
                          {estadoConfig.label}
                        </span>
                        {sub.estado === 'activa' && (
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: estadoConfig.gradient,
                              boxShadow: `0 0 12px ${estadoConfig.color}`,
                              animation: 'pulse 2s ease-in-out infinite'
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Plan Info Premium */}
                    <div 
                      className="relative rounded-xl p-4 mb-4 border overflow-hidden group/plan"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <div 
                        className="absolute inset-0 opacity-0 group-hover/plan:opacity-100 transition-opacity duration-500"
                        style={{
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(0, 217, 255, 0.05))'
                        }}
                      />
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-home-gray-ui-2 text-xs uppercase tracking-wider mb-1 font-semibold">
                            Plan Contratado
                          </p>
                          <p 
                            className="text-xl font-black"
                            style={{
                              background: 'linear-gradient(135deg, #10B981, #00d9ff)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}
                          >
                            {sub.Plan?.nombre || 'Sin plan'}
                          </p>
                        </div>
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center group-hover/plan:scale-110 transition-transform duration-300"
                          style={{
                            background: 'linear-gradient(135deg, #10B981, #00d9ff)',
                            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          <CreditCard className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>

                    {/* Detalles de fechas */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div 
                        className="rounded-xl p-3 border backdrop-blur-sm"
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          borderColor: 'rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-home-gray-ui-1" strokeWidth={2} />
                          <span className="text-xs text-home-gray-ui-2 uppercase font-semibold">Inicio</span>
                        </div>
                        <p className="text-home-white font-bold text-sm">
                          {formatDate(sub.fecha_inicio)}
                        </p>
                      </div>

                      <div 
                        className="rounded-xl p-3 border backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.02))',
                          borderColor: 'rgba(16, 185, 129, 0.2)'
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-[#10B981]" strokeWidth={2} />
                          <span className="text-xs text-[#10B981] uppercase font-semibold">Próximo Cobro</span>
                        </div>
                        <p className="text-home-white font-bold text-sm">
                          {formatDate(sub.proximo_cobro)}
                        </p>
                      </div>
                    </div>

                    {/* MercadoPago ID */}
                    {sub.mp_preapproval_id && (
                      <div 
                        className="rounded-xl p-3 border backdrop-blur-sm mb-4"
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          borderColor: 'rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-[#00d9ff]" strokeWidth={2} />
                          <p className="text-xs text-home-gray-ui-2 uppercase font-semibold">
                            ID MercadoPago
                          </p>
                        </div>
                        <p className="text-home-white text-xs font-mono break-all">
                          {sub.mp_preapproval_id}
                        </p>
                      </div>
                    )}

                    {/* Información de cancelación */}
                    {(sub.estado === 'cancelada' || sub.estado === 'expirada') && sub.motivo_cancelacion && (
                      <div 
                        className="rounded-xl p-4 border"
                        style={{
                          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(153, 27, 27, 0.05))',
                          borderColor: 'rgba(220, 38, 38, 0.3)'
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-[#DC2626]" strokeWidth={2} />
                          <p className="text-xs text-[#DC2626] uppercase font-semibold">
                            Motivo de cancelación
                          </p>
                        </div>
                        <p className="text-home-white text-sm mb-2">
                          {sub.motivo_cancelacion}
                        </p>
                        {sub.cancelada_en && (
                          <p className="text-xs text-home-gray-ui-2 font-medium">
                            Cancelada el: {formatDate(sub.cancelada_en)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Footer con timestamps */}
                    <div 
                      className="mt-4 pt-4 flex items-center justify-between text-xs text-home-gray-ui-2 font-medium"
                      style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <span>Creada: {formatDate(sub.creado_en)}</span>
                      <span>Actualizada: {formatDate(sub.actualizado_en)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Estado vacío */}
        {list.length === 0 && (
          <div className="text-center py-20">
            <div 
              className="inline-block rounded-3xl p-12 border backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.8), rgba(25, 24, 25, 0.6))',
                borderColor: 'rgba(16, 185, 129, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div 
                className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #00d9ff)',
                  boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)'
                }}
              >
                <CreditCard className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
              <h3 
                className="text-2xl font-black mb-2"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #00d9ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                No hay suscripciones
              </h3>
              <p className="text-home-gray-ui-2 font-medium">
                Las suscripciones aparecerán aquí cuando se creen
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
    </>
  )
}