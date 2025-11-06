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
          {/* Botones fijos arriba a la derecha: Personal, Contacto y Login */}
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/personal">Personal</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contacto">Contáctanos</Link>
            </Button>
            <Button asChild className="bg-gray-900 text-white hover:bg-gray-800">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Creación de Páginas Web</h1>
          <p className="mt-2 text-lg text-gray-600">
            Diseñamos y desarrollamos sitios web modernos, rápidos y optimizados para tu negocio.
          </p>
          {/* CTA bajo el título eliminado para evitar duplicar botones */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* Servicios */}
        <section className="py-12 border-b">
          <h2 className="text-2xl font-semibold">Qué ofrecemos</h2>
          <p className="mt-2 text-gray-600">
            Soluciones completas para tu presencia digital, desde la idea hasta el lanzamiento.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-white rounded-lg border">
              <h3 className="font-medium">Diseño responsive</h3>
              <p className="mt-1 text-sm text-gray-600">Visualización óptima en móviles, tablets y escritorio.</p>
            </div>
            <div className="p-5 bg-white rounded-lg border">
              <h3 className="font-medium">SEO básico</h3>
              <p className="mt-1 text-sm text-gray-600">Buenas prácticas para mejorar tu visibilidad en buscadores.</p>
            </div>
            <div className="p-5 bg-white rounded-lg border">
              <h3 className="font-medium">E-commerce</h3>
              <p className="mt-1 text-sm text-gray-600">Tiendas online con carrito, pagos y gestión de productos.</p>
            </div>
            <div className="p-5 bg-white rounded-lg border">
              <h3 className="font-medium">Landing pages</h3>
              <p className="mt-1 text-sm text-gray-600">Páginas enfocadas en conversión para campañas específicas.</p>
            </div>
          </div>
        </section>

        {/* Proceso */}
        <section className="py-12 border-b">
          <h2 className="text-2xl font-semibold">Nuestro proceso de trabajo</h2>
          <ol className="mt-4 list-decimal list-inside space-y-2 text-gray-700">
            <li>Reunión inicial y definición de objetivos</li>
            <li>Diseño de interfaz y estructura de contenidos</li>
            <li>Desarrollo y pruebas de funcionalidad</li>
            <li>Optimización de rendimiento y lanzamiento</li>
            <li>Soporte y mejoras continuas</li>
          </ol>
        </section>

        {/* Tecnologías */}
        <section className="py-12 border-b">
          <h2 className="text-2xl font-semibold">Tecnologías</h2>
          <p className="mt-2 text-gray-600">Trabajamos con herramientas modernas del ecosistema web.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js'].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-white border rounded-md text-sm">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="py-12">
          <h2 className="text-2xl font-semibold">Contacto</h2>
          <p className="mt-2 text-gray-600">
            ¿Listo para comenzar tu proyecto? Escríbenos y te responderemos pronto.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-white rounded-lg border">
              <h3 className="font-medium">Correo</h3>
              <p className="mt-1 text-sm text-gray-600">contacto@tusitio.com</p>
            </div>
            <div className="p-5 bg-white rounded-lg border">
              <h3 className="font-medium">WhatsApp</h3>
              <p className="mt-1 text-sm text-gray-600">+52 55 1234 5678</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} Tu Agencia Web. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
