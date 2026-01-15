"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Instagram, Linkedin, MessageCircle } from "lucide-react"
import { AnimatedBackground } from "@/components/nosotros/AnimatedBackground"

// Icono TikTok en SVG (blanco) para usar dentro de los círculos
function TikTokIcon({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M16.5 6.5c1.2 1.1 2.7 1.8 4.3 2v3.1c-1.8-.2-3.5-.9-5-2v6.3c0 3.3-2.7 6-6 6s-6-2.7-6-6c0-3.3 2.7-6 6-6 .2 0 .4 0 .6.1v3.2c-.2-.1-.4-.1-.6-.1-1.5 0-2.7 1.2-2.7 2.7S7.3 18.5 8.8 18.5 11.5 17.3 11.5 15.8V3h3.1c.3 1.4 1 2.7 1.9 3.5Z"/>
    </svg>
  )
}

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

// Componente de icono social con efecto 3D tilt
function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const iconRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!iconRef.current) return

    const rect = iconRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    const maxTilt = 10
    const tiltX = (mouseY / (rect.height / 2)) * -maxTilt
    const tiltY = (mouseX / (rect.width / 2)) * maxTilt

    setTilt({ x: tiltX, y: tiltY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const shadowIntensity = isHovered ? 0.4 : 0.15
  const shadowX = Math.round(tilt.y * 1.5)
  const shadowY = Math.round(tilt.x * 1.5) + (isHovered ? 12 : 0)
  const shadowBlur = 20 + Math.abs(shadowY) * 0.5

  return (
    <div
      ref={iconRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-44 h-44 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center cursor-pointer"
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovered ? 1.1 : 1,
          y: isHovered ? -12 : 0,
          z: isHovered ? 50 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.5
        }}
        style={{
          transformStyle: "preserve-3d",
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 206, 209, ${shadowIntensity}), 0 0 ${shadowBlur * 0.5}px rgba(0, 206, 209, ${shadowIntensity * 0.3})`
        }}
      >
        {icon}
      </motion.a>
    </div>
  )
}

export default function ContactoPage() {
  return (
    <main className="bg-home-black text-home-white relative overflow-x-hidden snap-container">
      {/* Fondo animado reutilizable */}
      <AnimatedBackground particleCount={12} opacity={0.3} />

      {/* Contenido principal */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <motion.h1 
            className="text-3xl md:text-5xl font-bold text-teal-300 tracking-wide text-center mb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={fadeInUp}
          >
            Hablemos de Tu Proyecto
          </motion.h1>
          <motion.p 
            className="text-teal-200 text-center text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={fadeInUp}
          >
            Estamos aquí para convertir tu idea en una <strong className="text-teal-400">página web que vende</strong>. Respuesta garantizada en menos de 1 hora.
          </motion.p>
          
          {/* Badge de disponibilidad */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={fadeInUp}
          >
            <div className="bg-teal-500/20 border border-teal-400/50 rounded-full px-4 py-2 text-sm text-teal-300">
              🕐 Disponible 8 AM - 11 PM
            </div>
            <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-full px-4 py-2 text-sm text-cyan-300">
              ⚡ Respuesta en minutos
            </div>
            <div className="bg-emerald-500/20 border border-emerald-400/50 rounded-full px-4 py-2 text-sm text-emerald-300">
              💬 Soporte incluido
            </div>
          </motion.div>

          <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Formulario mejorado */}
            <motion.form 
              className="rounded-2xl p-6 md:p-8 border-2 border-teal-400/60 bg-neutral-900/30 backdrop-blur-xl shadow-2xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={fadeInUp}
            >
              <h2 className="text-2xl font-bold text-teal-300 mb-6">Cuéntanos Tu Idea</h2>
              
              <label className="block text-teal-200 mb-2 font-semibold">Nombre Completo</label>
              <input
                type="text"
                className="w-full mb-4 px-4 py-3 rounded-lg bg-neutral-900/40 backdrop-blur-md text-teal-100 placeholder-teal-400/50 border-2 border-teal-400/30 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 transition-all"
                placeholder="¿Cómo te llamas?"
                required
              />

              <label className="block text-teal-200 mb-2 font-semibold">Correo Electrónico</label>
              <input
                type="email"
                className="w-full mb-4 px-4 py-3 rounded-lg bg-neutral-900/40 backdrop-blur-md text-teal-100 placeholder-teal-400/50 border-2 border-teal-400/30 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 transition-all"
                placeholder="tu@correo.com"
                required
              />

              <label className="block text-teal-200 mb-2 font-semibold">Teléfono / WhatsApp</label>
              <input
                type="tel"
                className="w-full mb-4 px-4 py-3 rounded-lg bg-neutral-900/40 backdrop-blur-md text-teal-100 placeholder-teal-400/50 border-2 border-teal-400/30 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 transition-all"
                placeholder="+56 9 1234 5678"
                required
              />

              <label className="block text-teal-200 mb-2 font-semibold">Cuéntanos Sobre Tu Proyecto</label>
              <textarea
                rows={5}
                className="w-full mb-6 px-4 py-3 rounded-lg bg-neutral-900/40 backdrop-blur-md text-teal-100 placeholder-teal-400/50 border-2 border-teal-400/30 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 transition-all resize-none"
                placeholder="¿Qué tipo de página web necesitas? ¿Tienes alguna idea específica? Cuéntanos todo..."
                required
              />

              <button
                type="submit"
                className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/30"
              >
                🚀 Enviar Solicitud - Te Respondemos en Minutos
              </button>
              
              <p className="text-xs text-teal-300/70 mt-4 text-center">
                Al enviar, aceptas que nos contactemos contigo. Sin spam, solo soluciones.
              </p>
            </motion.form>

            {/* Redes sociales mejoradas */}
            <motion.div 
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={fadeInUp}
            >
              <div>
                <h3 className="text-2xl font-bold text-teal-300 mb-4">Conéctate Con Nosotros</h3>
                <p className="text-teal-200 mb-6">
                  Elige el canal que prefieras. Estamos disponibles en todas nuestras redes sociales y respondemos rápido.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <motion.a
                  href="https://wa.me/+56976506320"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-6 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/50 hover:border-emerald-400 hover:bg-emerald-500/30 transition-all duration-300 group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle className="w-16 h-16 md:w-20 md:h-20 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="mt-3 text-emerald-300 font-semibold text-sm md:text-base">WhatsApp</span>
                  <span className="text-emerald-400/70 text-xs mt-1">Respuesta inmediata</span>
                </motion.a>
                
                <motion.a
                  href="https://instagram.com/solidev_cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-6 rounded-2xl bg-pink-500/20 border-2 border-pink-400/50 hover:border-pink-400 hover:bg-pink-500/30 transition-all duration-300 group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram className="w-16 h-16 md:w-20 md:h-20 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span className="mt-3 text-pink-300 font-semibold text-sm md:text-base">Instagram</span>
                  <span className="text-pink-400/70 text-xs mt-1">@solidev_cl</span>
                </motion.a>
                
                <motion.a
                  href="https://www.tiktok.com/@solidev_cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border-2 border-white/30 hover:border-white/50 hover:bg-black/50 transition-all duration-300 group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <TikTokIcon className="w-16 h-16 md:w-20 md:h-20 text-white group-hover:scale-110 transition-transform" />
                  <span className="mt-3 text-white font-semibold text-sm md:text-base">TikTok</span>
                  <span className="text-white/70 text-xs mt-1">@solidev_cl</span>
                </motion.a>
                
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-6 rounded-2xl bg-blue-500/20 border-2 border-blue-400/50 hover:border-blue-400 hover:bg-blue-500/30 transition-all duration-300 group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="w-16 h-16 md:w-20 md:h-20 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="mt-3 text-blue-300 font-semibold text-sm md:text-base">LinkedIn</span>
                  <span className="text-blue-400/70 text-xs mt-1">Conecta con nosotros</span>
                </motion.a>
              </div>
              
              {/* Información adicional */}
              <div className="mt-8 p-6 rounded-xl bg-teal-500/10 border border-teal-400/30">
                <h4 className="text-teal-300 font-bold mb-3">💡 ¿Sabías que?</h4>
                <ul className="space-y-2 text-sm text-teal-200">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">✓</span>
                    <span>Desarrollamos tu página web con <strong>React</strong> para máxima velocidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">✓</span>
                    <span>Tu sitio web ya viene <strong>alojado en nuestros servidores</strong> - sin complicaciones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">✓</span>
                    <span>Soporte disponible de <strong>8 AM a 11 PM</strong>, todos los días</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}