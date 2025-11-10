"use client"

import { useEffect, useState } from "react"
import { apiService } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HomePage() {
  const [apiMessage, setApiMessage] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    apiService
      .getApiTest()
      .then((data) => setApiMessage(data.q))
      .catch((err) => setApiError(err?.message || 'Error de conexión'))
  }, [])

  return (
    <div className="min-h-screen bg-neutral-900 text-teal-100">
      {/* Estado de API */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="p-4 mb-6 rounded-md border bg-white">
          <p className="text-sm">
            {apiError
              ? <span className="text-red-600">Error de API: {apiError}</span>
              : apiMessage
                ? <span className="text-green-600">API conectada: {apiMessage}</span>
                : <span className="text-gray-600">Verificando conexión con la API…</span>}
          </p>
        </div>
      </div>
      {/* Hero */}
      <header className="bg-transparent">
        <div className="max-w-6xl mx-auto px-6 py-8 relative">
          {/* Botones fijos arriba a la derecha: Nosotros, Contacto y Login */}
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/personal">Nosotros</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contacto">Contacto</Link>
            </Button>
            <Button asChild className="bg-gray-900 text-white hover:bg-gray-800">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </div>

          {/* Hero: Desarrollamos la web de tus sueños */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-teal-300">
                DESARROLLAMOS LA WEB DE TUS SUEÑOS
              </h1>
              <p className="mt-2 text-teal-200">
                Páginas web sólidas que se ajustan a tus ideas y tu negocio.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-teal-100">
                <li>• Certificado SSL</li>
                <li>• Diseño moderno</li>
                <li>• Seguridad</li>
              </ul>
              <div className="mt-6">
                <Button asChild className="bg-teal-500 hover:bg-teal-600 text-white">
                  <a href="#planes">Ver Planes</a>
                </Button>
              </div>
            </div>
            <div className="bg-neutral-800 rounded-xl shadow-lg p-4 h-56 md:h-64 flex items-center justify-center">
              <span className="text-teal-200">Imagen de muestra</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* Nuestros Planes */}
        <section id="planes" className="py-12">
          <h2 className="text-2xl font-bold text-teal-300 mb-6">NUESTROS PLANES</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Plan Básico */}
            <div className="rounded-lg border border-teal-500/40 bg-neutral-900 p-5">
              <h3 className="font-bold text-teal-200">PLAN BÁSICO</h3>
              <p className="text-teal-300 mt-1">$50,000 <span className="text-xs text-teal-200">aprox.</span></p>
              <ul className="mt-3 text-sm text-teal-100 space-y-1">
                <li>• Dominio y hosting</li>
                <li>• Diseño responsive</li>
                <li>• 3 secciones</li>
                <li>• Optimización básica</li>
              </ul>
              <div className="mt-4">
                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Contratar</Button>
              </div>
            </div>
            {/* Plan Medio */}
            <div className="rounded-lg border border-teal-500/40 bg-neutral-900 p-5">
              <h3 className="font-bold text-teal-200">PLAN MEDIO</h3>
              <p className="text-teal-300 mt-1">$90,000 <span className="text-xs text-teal-200">aprox.</span></p>
              <ul className="mt-3 text-sm text-teal-100 space-y-1">
                <li>• Todo el básico</li>
                <li>• 6 secciones</li>
                <li>• Integración de formularios</li>
                <li>• SEO inicial</li>
              </ul>
              <div className="mt-4">
                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Contratar</Button>
              </div>
            </div>
            {/* Plan Premium */}
            <div className="rounded-lg border border-teal-500/40 bg-neutral-900 p-5">
              <h3 className="font-bold text-teal-200">PLAN PREMIUM</h3>
              <p className="text-teal-300 mt-1">$150,000 <span className="text-xs text-teal-200">aprox.</span></p>
              <ul className="mt-3 text-sm text-teal-100 space-y-1">
                <li>• Todo el medio</li>
                <li>• Animaciones y mejoras de performance</li>
                <li>• Integraciones avanzadas</li>
                <li>• Soporte prioritario</li>
              </ul>
              <div className="mt-4">
                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Contratar</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Proyectos Destacados */}
        <section className="py-12">
          <h2 className="text-2xl font-bold text-teal-300 mb-6">PROYECTOS DESTACADOS</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map((i) => (
                <div key={i} className="bg-neutral-800 rounded-md h-24 flex items-center justify-center text-teal-200">Web {i}</div>
              ))}
            </div>
            <div className="bg-neutral-800 rounded-md h-56 md:h-64 flex items-center justify-center text-teal-200">Proyecto principal</div>
          </div>
          <div className="mt-6">
            <Button asChild className="bg-teal-500 hover:bg-teal-600 text-white">
              <Link href="/history">Ver Portafolio</Link>
            </Button>
          </div>
        </section>

        {/* Testimonios */}
        <section className="py-12 text-center">
          <h2 className="text-2xl font-bold text-teal-300 mb-6">TESTIMONIOS</h2>
          <p className="text-teal-100 italic">“ES UNA PÁGINA MUY SEGURA, RECOMENDADÍSIMO, ADEMÁS DE FACHEROS”</p>
          <p className="mt-2 text-teal-300 font-semibold">MI MAMI</p>
        </section>
      </main>

      <footer className="bg-neutral-900 border-t border-teal-500/20 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-teal-200">
          © {new Date().getFullYear()} Solidev. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
