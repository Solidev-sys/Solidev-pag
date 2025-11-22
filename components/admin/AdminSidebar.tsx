"use client"
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, CreditCard, FileText, Users, Sparkles, Shield } from 'lucide-react'

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const menuItems = [
        { href: '/admin/planes', label: 'Planes', icon: LayoutDashboard },
        { href: '/admin/suscripciones', label: 'Suscripciones', icon: CreditCard },
        { href: '/admin/facturas', label: 'Facturas', icon: FileText },
        { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
    ]

    return (
        <>
            {/* Botón de menú con gradiente premium */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed top-24 left-6 z-50 p-3.5 rounded-2xl shadow-2xl transition-all duration-500 group overflow-hidden backdrop-blur-sm ${
                    isOpen ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 pointer-events-auto hover:scale-110'
                }`}
                style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #00d9ff 50%, #059669 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'gradient-flow 4s ease infinite',
                    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                }}
                aria-label="Toggle menu"
            >
                <div className="relative w-6 h-6">
                    <Menu 
                        className={`absolute inset-0 text-white transition-all duration-500 ${
                            isOpen ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
                        }`}
                        strokeWidth={2.5}
                    />
                    <X 
                        className={`absolute inset-0 text-white transition-all duration-500 ${
                            isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'
                        }`}
                        strokeWidth={2.5}
                    />
                </div>
                
                {/* Resplandor animado */}
                <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.3), transparent 70%)',
                        animation: 'pulse 2s ease-in-out infinite'
                    }}
                />
            </button>

            {/* Overlay con blur */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-500 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Premium */}
            <aside
                className={`fixed top-0 left-0 h-full border-r shadow-2xl z-40 transition-all duration-700 ease-out ${
                    isOpen ? 'w-80 translate-x-0' : 'w-80 -translate-x-full'
                }`}
                style={{
                    background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    boxShadow: isOpen ? '0 0 80px rgba(16, 185, 129, 0.3), inset 0 0 80px rgba(16, 185, 129, 0.05)' : 'none'
                }}
            >
                {/* Patrón de fondo sutil */}
                <div 
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, #10B981 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="relative p-6 pt-24 h-full flex flex-col">
                    {/* Header Premium */}
                    <div className="mb-10 relative">
                        {/* Glow effect background */}
                        <div 
                            className="absolute -inset-4 blur-2xl opacity-30 rounded-3xl"
                            style={{
                                background: 'linear-gradient(135deg, #10B981, #00d9ff, #059669)',
                                animation: 'gradient-flow 6s ease infinite',
                                backgroundSize: '200% 200%'
                            }}
                        />
                        
                        {/* Logo/Title container */}
                        <Link 
                            href="/admin"
                            onClick={() => setIsOpen(false)}
                            className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer group/logo block"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div 
                                    className="w-10 h-10 rounded-xl flex items-center justify-center group-hover/logo:scale-110 transition-transform duration-300"
                                    style={{
                                        background: 'linear-gradient(135deg, #10B981, #00d9ff)',
                                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
                                    }}
                                >
                                    <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 
                                        className="text-xl font-black tracking-tight group-hover/logo:tracking-wide transition-all duration-300"
                                        style={{
                                            background: 'linear-gradient(135deg, #10B981, #00d9ff, #059669)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        SOLIDEV
                                    </h2>
                                    <p className="text-xs text-slate-400 font-medium group-hover/logo:text-slate-300 transition-colors duration-300">Admin Panel</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2 flex-1">
                        {menuItems.map((item, index) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group overflow-hidden ${
                                        isActive ? 'text-white' : 'text-slate-400'
                                    }`}
                                    style={{
                                        transitionDelay: isOpen ? `${index * 80}ms` : '0ms',
                                        opacity: isOpen ? 1 : 0,
                                        transform: isOpen ? 'translateX(0)' : 'translateX(-30px)',
                                        background: isActive 
                                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(0, 217, 255, 0.15))'
                                            : 'transparent',
                                        border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`,
                                        boxShadow: isActive ? '0 4px 20px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)' : 'none'
                                    }}
                                >
                                    {/* Fondo hover animado */}
                                    {!isActive && (
                                        <div 
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(0, 217, 255, 0.08))'
                                            }}
                                        />
                                    )}
                                    
                                    {/* Borde brillante en hover */}
                                    <div 
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl pointer-events-none"
                                        style={{
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                            boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
                                        }}
                                    />
                                    
                                    {/* Icono con efecto */}
                                    <div 
                                        className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${
                                            isActive ? 'scale-110' : 'group-hover:scale-110'
                                        }`}
                                        style={{
                                            background: isActive 
                                                ? 'linear-gradient(135deg, #10B981, #00d9ff)'
                                                : 'rgba(255, 255, 255, 0.03)',
                                            boxShadow: isActive 
                                                ? '0 4px 16px rgba(16, 185, 129, 0.4)'
                                                : '0 2px 8px rgba(0, 0, 0, 0.2)'
                                        }}
                                    >
                                        <Icon 
                                            className={`w-5 h-5 transition-all duration-500 ${
                                                isActive ? 'text-white' : 'text-emerald-400'
                                            } group-hover:rotate-3`}
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                    
                                    <span className={`relative font-semibold text-[15px] transition-all duration-300 ${
                                        isActive ? 'text-white' : 'group-hover:text-white'
                                    }`}>
                                        {item.label}
                                    </span>
                                    
                                    {/* Indicador activo */}
                                    {isActive && (
                                        <div 
                                            className="relative ml-auto w-2 h-2 rounded-full"
                                            style={{
                                                background: 'linear-gradient(135deg, #10B981, #00d9ff)',
                                                boxShadow: '0 0 12px rgba(16, 185, 129, 1), 0 0 24px rgba(16, 185, 129, 0.6)',
                                                animation: 'pulse 2s ease-in-out infinite'
                                            }}
                                        />
                                    )}
                                    
                                    {/* Flecha en hover */}
                                    {!isActive && (
                                        <div className="relative ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M6 4L10 8L6 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer Premium */}
                    <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(16, 185, 129, 0.15)' }}>
                        {/* Status indicator */}
                        <div className="flex items-center justify-between mb-4 px-4 py-3 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-emerald-500/10">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div 
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            background: 'linear-gradient(135deg, #10B981, #00d9ff)',
                                            boxShadow: '0 0 16px rgba(16, 185, 129, 0.8)',
                                            animation: 'pulse 2s ease-in-out infinite'
                                        }}
                                    />
                                    <div 
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent 70%)',
                                            animation: 'ping 2s ease-in-out infinite'
                                        }}
                                    />
                                </div>
                                <span className="text-sm font-medium text-slate-300">Sistema Activo</span>
                            </div>
                            <Sparkles className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                        </div>
                        
                        {/* Progress bar */}
                        <div className="relative h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                            <div 
                                className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(90deg, #10B981 0%, #00d9ff 50%, #059669 100%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'gradient-flow 3s ease infinite',
                                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
                                }}
                            />
                        </div>
                        
                        {/* Version */}
                        <div className="mt-4 text-center text-xs text-slate-600 font-medium">
                            v2.0.1 • Professional
                        </div>
                    </div>
                </div>

                {/* Borde brillante derecho */}
                <div 
                    className="absolute top-0 right-0 w-[2px] h-full"
                    style={{
                        background: 'linear-gradient(180deg, transparent, #10B981 20%, #00d9ff 50%, #059669 80%, transparent)',
                        backgroundSize: '100% 200%',
                        animation: 'gradient-flow 5s ease infinite',
                        opacity: 0.6
                    }}
                />
            </aside>

            <style jsx>{`
                @keyframes gradient-flow {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                
                @keyframes ping {
                    0% { transform: scale(1); opacity: 1; }
                    75%, 100% { transform: scale(2); opacity: 0; }
                }
            `}</style>
        </>
    )
}