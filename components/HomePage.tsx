"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { apiService } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
    <div className="min-h-screen bg-neutral-900 text-teal-100">
      
      {/* Hero con ApiStatus superpuesto */}
      <div className="relative">
        <Hero />
        
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
      {plans.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
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
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInScale}
        >
          <FeaturedProjectsSection projects={projects} />
        </motion.div>
      )}

      {/* Contenido principal centrado */}
      <main className="max-w-6xl mx-auto px-6">
        
        {/* Testimonios con animación stagger (elementos aparecen uno tras otro) */}
        <motion.section 
          className="py-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
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
        </motion.section>
        
      </main>

      {/* Footer con animación sutil */}
      <motion.footer 
        className="bg-neutral-900 border-t border-teal-500/20 mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-teal-200">
          © {new Date().getFullYear()} Solidev. Todos los derechos reservados.
        </div>
      </motion.footer>
    </div>
  )
}