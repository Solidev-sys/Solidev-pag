"use client"

import { useMemo, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Instagram, Linkedin, MessageCircle } from "lucide-react"

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
  // Generar partículas de fondo de forma determinística (igual a nosotros)
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const seed = i * 7.3
      return {
        id: i,
        left: ((seed * 13.7) % 100),
        top: ((seed * 19.3) % 100),
        delay: ((seed * 2.1) % 6),
      }
    })
  }, [])

  // Generar partículas animadas (como AnimatedBackground de nosotros)
  const animatedParticles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      width: 40 + (i * 4),
      height: 40 + (i * 4),
      left: (i * (100 / 12)) % 100,
      top: (i * (100 / (12 * 0.9))) % 100,
      color: i % 3 === 0 ? '6, 182, 212' : i % 3 === 1 ? '20, 184, 166' : '102, 126, 234',
      opacity: 0.1 + (i % 3) * 0.05,
      delay: i * 0.15,
      duration: 5 + (i % 4),
    }))
  }, [])

  return (
    <main className="bg-home-black text-home-white relative overflow-x-hidden snap-container">
      {/* Fondo animado - igual a nosotros */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradiente principal animado */}
        <div
          className="absolute inset-0 gradient-animated"
          style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #14b8a6 25%, #667eea 50%, #764ba2 75%, #06b6d4 100%)",
            opacity: 0.3,
          }}
        />
        
        {/* Gradiente secundario con blur */}
        <motion.div
          className="absolute inset-0 blur-3xl"
          style={{
            background: "radial-gradient(circle at 30% 50%, #4facfe 0%, transparent 50%), radial-gradient(circle at 70% 50%, #00f2fe 0%, transparent 50%)",
            opacity: 0.21,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Partículas flotantes optimizadas */}
        {animatedParticles.map((particle) => (
          <div
            key={particle.id}
            className="particle-optimized absolute rounded-full"
            style={{
              width: particle.width,
              height: particle.height,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              background: `radial-gradient(circle, rgba(${particle.color}, ${particle.opacity}) 0%, transparent 70%)`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}

        {/* Partículas pequeñas decorativas */}
        {particles.map((particle) => (
          <motion.div
            key={`small-${particle.id}`}
            className="absolute w-2 h-2 rounded-full bg-cyan-500/20 floating-particle"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-teal-300 tracking-wide text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={fadeInUp}
          >
            CONTÁCTANOS
          </motion.h1>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Formulario */}
            <motion.form 
              className="rounded-xl p-6 border-2 border-teal-400/60 bg-neutral-900/20 backdrop-blur-lg shadow-lg"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={fadeInUp}
            >
              <label className="block text-teal-200 mb-2">Nombre</label>
              <input
                type="text"
                className="w-full mb-4 px-4 py-2 rounded-md bg-neutral-900/20 backdrop-blur-md text-teal-100 placeholder-teal-300 border-2 border-teal-400/30 focus:outline-none focus:border-teal-300"
                placeholder="Tu nombre"
              />

              <label className="block text-teal-200 mb-2">Correo</label>
              <input
                type="email"
                className="w-full mb-4 px-4 py-2 rounded-md bg-neutral-900/20 backdrop-blur-md text-teal-100 placeholder-teal-300 border-2 border-teal-400/30 focus:outline-none focus:border-teal-300"
                placeholder="tucorreo@ejemplo.com"
              />

              <label className="block text-teal-200 mb-2">Teléfono</label>
              <input
                type="tel"
                className="w-full mb-4 px-4 py-2 rounded-md bg-neutral-900/20 backdrop-blur-md text-teal-100 placeholder-teal-300 border-2 border-teal-400/30 focus:outline-none focus:border-teal-300"
                placeholder="+00 000 000 000"
              />

              <label className="block text-teal-200 mb-2">Mensaje</label>
              <textarea
                rows={5}
                className="w-full mb-6 px-4 py-2 rounded-md bg-neutral-900/20 backdrop-blur-md text-teal-100 placeholder-teal-300 border-2 border-teal-400/30 focus:outline-none focus:border-teal-300"
                placeholder="Cuéntanos sobre tu proyecto"
              />

              <button
                type="submit"
                className="w-full px-5 py-2 rounded-md bg-teal-500 hover:bg-teal-600 text-white font-medium transition-colors"
              >
                Enviar
              </button>
            </motion.form>

            {/* Iconos sociales */}
            <motion.div 
              className="grid grid-cols-2 gap-8 place-items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={fadeInUp}
            >
              <SocialIcon
                href="https://instagram.com/solidev_cl"
                icon={<Instagram className="w-20 h-20 text-white" />}
              />
              <SocialIcon
                href="https://wa.me/+56976506320"
                icon={<MessageCircle className="w-20 h-20 text-white" />}
              />
              <SocialIcon
                href="https://www.tiktok.com/@solidev_cl"
                icon={<TikTokIcon className="w-20 h-20 text-white" />}
              />
              <SocialIcon
                href="https://linkedin.com"
                icon={<Linkedin className="w-20 h-20 text-white" />}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}