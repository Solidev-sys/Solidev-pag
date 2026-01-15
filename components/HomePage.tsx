"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { apiService } from "@/lib/api"

import type { BackendPlan, BackendPaginaSitio } from "@/types/indexNew"
import { ApiStatus } from "./ApiStatus"
import { Hero } from "./Hero"
import { PlansSection } from "./PlansSection"
import { FeaturedProjectsSection } from "./FeaturedProjectsSection"
import { AnimatedBackground } from "./nosotros/AnimatedBackground"

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

  // Importar AnimatedBackground para evitar duplicación de código

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
      {/* Fondo animado reutilizable */}
      <AnimatedBackground particleCount={12} opacity={0.3} />

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

        {/* Sección de Beneficios con neuroventas */}
        <motion.section 
          className="py-16 md:py-20 text-center relative overflow-hidden"
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
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-teal-300 mb-4"
              variants={fadeInUp}
            >
              ¿Por Qué Elegirnos?
            </motion.h2>
            <motion.p 
              className="text-teal-200 text-lg md:text-xl mb-12 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              No solo creamos páginas web. Construimos <strong className="text-teal-400">ecosistemas digitales</strong> que generan resultados reales para tu negocio.
            </motion.p>
            
            {/* Grid de beneficios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  icon: "⚡",
                  title: "Velocidad Extrema",
                  desc: "Páginas desarrolladas con React que cargan en menos de 2 segundos"
                },
                {
                  icon: "🛡️",
                  title: "Alojamiento Incluido",
                  desc: "Tu sitio web ya alojado en nuestros servidores de alta performance"
                },
                {
                  icon: "💬",
                  title: "Soporte 8 AM - 11 PM",
                  desc: "Estamos disponibles cuando lo necesites, todos los días de la semana"
                },
                {
                  icon: "🎯",
                  title: "Enfocados en Ventas",
                  desc: "Cada elemento diseñado para convertir visitantes en clientes"
                }
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-teal-500/20 hover:border-teal-400/50 transition-all duration-300 hover:scale-105"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-teal-300 mb-2">{benefit.title}</h3>
                  <p className="text-teal-100 text-sm leading-relaxed">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        
        {/* Testimonios mejorados */}
        <motion.section 
          className="py-12 md:py-16 text-center relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={staggerContainer}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div 
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, #3cc1f3 0%, #00cc99 100%)",
                opacity: 0.1,
              }}
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-teal-300 mb-8"
              variants={fadeInUp}
            >
              Lo Que Dicen Nuestros Clientes
            </motion.h2>
            <motion.div 
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-teal-500/20"
              variants={fadeInUp}
            >
              <div className="text-4xl mb-4">⭐</div>
              <motion.p 
                className="text-teal-100 italic text-lg md:text-xl mb-4 leading-relaxed"
                variants={fadeInUp}
              >
                "ES UNA PÁGINA MUY SEGURA, RECOMENDADÍSIMO, ADEMÁS DE FACHEROS. El soporte es increíble, siempre están disponibles cuando los necesito."
              </motion.p>
              <motion.p 
                className="text-teal-300 font-semibold text-lg"
                variants={fadeInUp}
              >
                - Cliente Satisfecho
              </motion.p>
            </motion.div>
          </div>
        </motion.section>
        
        {/* Footer mejorado con información de contacto */}
        <motion.footer 
          className="bg-neutral-900/30 backdrop-blur-lg border-t border-teal-500/20 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-teal-400 font-bold text-lg mb-4">Soporte</h3>
                <p className="text-teal-200 text-sm mb-2">🕐 Disponible de 8 AM a 11 PM</p>
                <p className="text-teal-200 text-sm">Todos los días de la semana</p>
              </div>
              <div>
                <h3 className="text-teal-400 font-bold text-lg mb-4">Tecnología</h3>
                <p className="text-teal-200 text-sm mb-2">⚛️ Desarrollado con React</p>
                <p className="text-teal-200 text-sm">🚀 Alojado en nuestros servidores</p>
              </div>
              <div>
                <h3 className="text-teal-400 font-bold text-lg mb-4">Contacto</h3>
                <p className="text-teal-200 text-sm mb-2">💬 WhatsApp disponible</p>
                <p className="text-teal-200 text-sm">📧 Email: contacto@solidev.cl</p>
              </div>
            </div>
            <div className="border-t border-teal-500/20 pt-6 text-center">
              <p className="text-sm text-teal-200">
                © {new Date().getFullYear()} Solidev. Todos los derechos reservados.
              </p>
              <p className="text-xs text-teal-300/70 mt-2">
                Transformando ideas en páginas web que venden
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </main>
  )
}
