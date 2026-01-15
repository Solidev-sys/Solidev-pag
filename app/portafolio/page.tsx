"use client"

import { motion, type Variants, cubicBezier } from "framer-motion"
import { AnimatedBackground } from "@/components/nosotros/AnimatedBackground"
import Link from "next/link"

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: cubicBezier(0.22, 1, 0.36, 1),
    },
  },
}

const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

export default function PortafolioPage() {
  return (
    <main className="min-h-screen bg-home-black text-home-white relative overflow-x-hidden">
      {/* Fondo animado reutilizable */}
      <AnimatedBackground particleCount={12} opacity={0.3} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-teal-300 mb-4">
            Nuestro Portafolio
          </h1>
          <p className="text-teal-200 text-lg md:text-xl max-w-2xl mx-auto">
            Páginas web que{" "}
            <strong className="text-teal-400">transforman negocios</strong> y
            generan resultados reales. Cada proyecto es una historia de éxito.
          </p>
        </motion.div>

        {/* Grid de proyectos */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {[
            {
              id: 1,
              title: "E-commerce Premium",
              desc: "Tienda online con React y pagos integrados",
              category: "E-commerce",
            },
            {
              id: 2,
              title: "Landing Page de Conversión",
              desc: "Página diseñada para maximizar ventas",
              category: "Marketing",
            },
            {
              id: 3,
              title: "Sitio Corporativo",
              desc: "Presencia digital profesional para empresas",
              category: "Corporativo",
            },
            {
              id: 4,
              title: "Plataforma SaaS",
              desc: "Aplicación web con React y backend robusto",
              category: "SaaS",
            },
            {
              id: 5,
              title: "Portfolio Creativo",
              desc: "Showcase interactivo para profesionales",
              category: "Portfolio",
            },
            {
              id: 6,
              title: "Blog Dinámico",
              desc: "Sitio de contenido con CMS personalizado",
              category: "Contenido",
            },
          ].map((proyecto) => (
            <motion.div
              key={proyecto.id}
              className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border-2 border-teal-500/20 hover:border-teal-400/50 transition-all duration-300 group"
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Imagen placeholder */}
              <div className="h-48 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.3)_0%,transparent_70%)]" />
                <div className="relative z-10 text-6xl opacity-30">🚀</div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-teal-500/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {proyecto.category}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-teal-300 mb-2 group-hover:text-teal-400 transition-colors">
                  {proyecto.title}
                </h3>
                <p className="text-teal-200 text-sm mb-4 leading-relaxed">
                  {proyecto.desc}
                </p>
                <div className="flex items-center gap-2 text-xs text-teal-400/70">
                  <span>⚛️ React</span>
                  <span>•</span>
                  <span>🚀 Alojado</span>
                  <span>•</span>
                  <span>💬 Soporte incluido</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-16 md:mt-20 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border-2 border-teal-500/30 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-teal-300 mb-4">
              ¿Listo para Tu Propio Proyecto?
            </h2>
            <p className="text-teal-200 mb-8 text-lg">
              Cada proyecto comienza con una conversación. Hablemos de cómo
              podemos transformar tu negocio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/30"
              >
                💬 Contactar Ahora
              </Link>
              <Link
                href="/#planes"
                className="px-8 py-4 rounded-lg border-2 border-teal-400/50 bg-transparent hover:bg-teal-400/10 hover:border-teal-400 text-teal-300 font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Ver Planes
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
