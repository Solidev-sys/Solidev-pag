// src/components/Hero.tsx (¡Modificado y más limpio!)
"use client" // <--- OJO: Este "use client" probablemente no sea necesario aquí.
// Tu Hero.tsx original NO usa hooks (useState, etc.), así que
// puedes QUITAR el "use client" de este archivo.

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <header className="bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-8 relative">
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
  )
}