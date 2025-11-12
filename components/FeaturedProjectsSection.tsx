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

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-teal-300 mb-6">PROYECTOS DESTACADOS</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-4">
          {items.map((p) => (
            <div key={p.id} className="bg-neutral-800 rounded-md h-24 flex items-center justify-center text-teal-200">
              {p.titulo}
            </div>
          ))}
        </div>
        <div className="bg-neutral-800 rounded-md h-56 md:h-64 flex items-center justify-center text-teal-200">
          {projects[0]?.hero_titulo || "Proyecto principal"}
        </div>
      </div>
      <div className="mt-6">
        <Button asChild className="bg-teal-500 hover:bg-teal-600 text-white">
          <Link href="/history">Ver Portafolio</Link>
        </Button>
      </div>
    </section>
  )
}