"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { apiService } from "@/lib/api"

import type { BackendPlan, BackendPaginaSitio } from "@/types/indexNew"
import { ApiStatus } from "./ApiStatus"
import { Hero } from "./Hero"
import { PlansSection } from "./PlansSection"
import { FeaturedProjectsSection } from "./FeaturedProjectsSection"

const fadeInUp: any = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const fadeInScale: any = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

export function HomePage() {
  const [apiMessage, setApiMessage] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [plans, setPlans] = useState<import('@/types/indexNew').BackendPlan[]>([])
  const [projects, setProjects] = useState<import('@/types/indexNew').BackendPaginaSitio[]>([])
  const [showPlans, setShowPlans] = useState(false)

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

  useEffect(() => {
    apiService
      .getApiTest()
      .then((data) => setApiMessage(data.q))
      .catch((err) => setApiError(err?.message || 'Error de conexión'))

    apiService
      .getPlans()
      .then((list) => setPlans(Array.isArray(list) ? list : []))
      .catch(() => setPlans([]))

    apiService
      .getPages()
      .then((list) => setProjects(Array.isArray(list) ? list : []))
      .catch(() => setProjects([]))
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
        {/* Hero y ApiStatus */}
        <div className="relative">
          <Hero onShowPlans={() => setShowPlans(!showPlans)} showPlans={showPlans} />
          
          {/* ApiStatus animado con fade in desde arriba */}
          <motion.div 
            className="absolute top-0 left-0 right-0 z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="max-w-6xl mx-auto px-6 pt-6">
              <ApiStatus message={apiMessage} error={apiError} />
            </div>
          </motion.div>
        </div>

        {/* Sección de Planes con animación de entrada */}
        {showPlans && plans.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <PlansSection plans={plans} />
          </motion.div>
        )}

        {/* Sección de Proyectos con animación de escala */}
        {projects.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            variants={fadeInScale}
          >
            <FeaturedProjectsSection projects={projects} />
          </motion.div>
        )}

        {/* Testimonios */}
        <motion.section 
          className="py-12 text-center relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={staggerContainer}
        >
          {/* Fondo azul-verde con difuminado animado */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div 
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, #3cc1f3 0%, #00cc99 100%)",
                opacity: 0.15,
              }}
            />
            {/* Gradientes difuminados animados */}
            <div 
              className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(60, 193, 243, 0.4), transparent 50%), radial-gradient(circle at 70% 70%, rgba(0, 204, 153, 0.4), transparent 50%)",
                filter: "blur(60px)",
                animation: "panel-gradient-move 8s ease-in-out infinite",
              }}
            />
            <div 
              className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%]"
              style={{
                background: "radial-gradient(circle at 70% 30%, rgba(0, 204, 153, 0.3), transparent 50%), radial-gradient(circle at 30% 70%, rgba(60, 193, 243, 0.3), transparent 50%)",
                filter: "blur(60px)",
                animation: "panel-gradient-move-reverse 10s ease-in-out infinite",
              }}
            />
          </div>
          <div className="relative z-10">
          <motion.h2 
            className="text-2xl font-bold text-teal-300 mb-6"
            variants={fadeInUp}
          >
            TESTIMONIOS
          </motion.h2>
          <motion.p 
            className="text-teal-100 italic"
            variants={fadeInUp}
          >
            "ES UNA PÁGINA MUY SEGURA, RECOMENDADÍSIMO, ADEMÁS DE FACHEROS"
          </motion.p>
          <motion.p 
            className="mt-2 text-teal-300 font-semibold"
            variants={fadeInUp}
          >
            MI MAMI
          </motion.p>
          </div>
        </motion.section>
        
        {/* Footer con animación sutil */}
        <motion.footer 
          className="bg-neutral-900/20 backdrop-blur-lg border-t border-teal-500/20 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-teal-200">
            © {new Date().getFullYear()} Solidev. Todos los derechos reservados.
          </div>
        </motion.footer>
      </div>
    </main>
  )
}