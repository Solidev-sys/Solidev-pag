"use client"

import { FC } from "react"
import type { BackendPaginaSitio } from "@/types/indexNew"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Props = {
  projects: BackendPaginaSitio[]
}

export const FeaturedProjectsSection: FC<Props> = ({ projects }) => {
  if (!projects || projects.length === 0) return null

  const items = projects.slice(0, 4)
  const firstImage = (arr?: string[] | null) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return null
    const raw = arr.find((s): s is string => typeof s === 'string' && s.trim().length > 0)
    if (!raw) return null
    const cleaned = raw.replace(/[`"']/g, '').trim()
    return cleaned.length > 0 ? cleaned : null
  }

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-teal-300 mb-8 text-center">PROYECTOS DESTACADOS</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="grid grid-cols-2 gap-4">
            {items.map((p) => {
              const img = firstImage(p.imagenes)
              return (
                <div key={p.id} className="bg-neutral-800 rounded-md overflow-hidden">
                  {img ? (
                      <img src={img} alt={p.titulo} className="w-full h-28 object-cover transition-transform duration-300 ease-out hover:scale-105" />
                  ) : (
                    <div className="h-28 flex items-center justify-center text-teal-200">{p.titulo}</div>
                  )}
                  <div className="px-3 py-2">
                    <div className="text-sm font-semibold text-teal-200 truncate">{p.titulo}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="bg-neutral-800 rounded-md overflow-hidden">
            {(() => {
              const hero = projects[0]
              if (!hero) return null
              const heroImg = firstImage(hero.imagenes ?? null)
              return (
                <div className="relative h-64 md:h-72 flex items-center justify-center text-center group">
                  {heroImg && (
                    <img src={heroImg} alt={hero.titulo || "Proyecto principal"} className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-300 ease-out group-hover:scale-105" />
                  )}
                  <div className="relative z-10 px-6">
                    <div className="text-teal-200 text-xl md:text-2xl font-bold">{hero.hero_titulo || hero.titulo || "Proyecto principal"}</div>
                    {hero.hero_texto && (
                      <p className="mt-2 text-teal-100 text-sm md:text-base">{hero.hero_texto}</p>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild className="bg-teal-500 hover:bg-teal-600 text-white">
            <Link href="/history">Ver Portafolio</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}