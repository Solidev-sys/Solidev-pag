"use client"

import { useEffect, useState } from "react"
import { apiService } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import type { BackendPlan, BackendPaginaSitio } from "@/types/indexNew"
import { ApiStatus } from "./ApiStatus"
import { Hero } from "./Hero"
import { PlansSection } from "./PlansSection"
import { FeaturedProjectsSection } from "./FeaturedProjectsSection"

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
          {/* Estado de API (centrado) */}
          <div className="max-w-6xl mx-auto px-6 pt-6">
            <ApiStatus message={apiMessage} error={apiError} />
          </div>
    
          {/* Hero (ancho completo) */}
          <Hero />
    
          {/* ========================================================== */}
          {/* SECCIONES MOVIDAS FUERA DE MAIN */}
          {/* ========================================================== */}
          
          {/* Nuestros Planes (ancho completo) */}
          {/* Esta sección ahora controla su propio fondo y centrado */}
          {plans.length > 0 && <PlansSection plans={plans} />}
    
          {/* Proyectos Destacados (ancho completo) */}
          {/* Esta sección también controla su propio fondo y centrado */}
          {projects.length > 0 && <FeaturedProjectsSection projects={projects} />}
    
          {/* ========================================================== */}
    
          {/* Contenido principal que SÍ va centrado */}
          <main className="max-w-6xl mx-auto px-6">
            
            {/* Testimonios (centrado) */}
            <section className="py-12 text-center">
              <h2 className="text-2xl font-bold text-teal-300 mb-6">TESTIMONIOS</h2>
              <p className="text-teal-100 italic">“ES UNA PÁGINA MUY SEGURA, RECOMENDADÍSIMO, ADEMÁS DE FACHEROS”</p>
              <p className="mt-2 text-teal-300 font-semibold">MI MAMI</p>
            </section>
            
          </main>
    
          {/* Footer (ancho completo, con centrado interno) */}
          <footer className="bg-neutral-900 border-t border-teal-500/20 mt-12">
            <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-teal-200">
              © {new Date().getFullYear()} Solidev. Todos los derechos reservados.
            </div>
          </footer>
        </div>
  )}
