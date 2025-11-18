"use client"

import { FC } from "react"
import type { BackendPaginaSitio } from "@/types/indexNew"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

type Props = {
  projects: BackendPaginaSitio[]
}

// Variantes de animación
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
}

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
}

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
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
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-teal-300 mb-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }} // 👈 Animación reversible según scroll
          variants={fadeInUp}
        >
          PROYECTOS DESTACADOS
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }} // 👈 Animación reversible según scroll
            variants={staggerContainer}
          >
            {items.map((p) => {
              const img = firstImage(p.imagenes)
              return (
                <motion.div 
                  key={p.id} 
                  className="bg-neutral-800 rounded-md overflow-hidden"
                  variants={fadeInUp}
                >
                  {img ? (
                      <img src={img} alt={p.titulo} className="w-full h-28 object-cover transition-transform duration-300 ease-out hover:scale-105" />
                  ) : (
                    <div className="h-28 flex items-center justify-center text-teal-200">{p.titulo}</div>
                  )}
                  <div className="px-3 py-2">
                    <div className="text-sm font-semibold text-teal-200 truncate">{p.titulo}</div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
          <motion.div 
            className="bg-neutral-800 rounded-md overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }} // 👈 Animación reversible según scroll
            variants={fadeInRight}
          >
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
          </motion.div>
        </div>
        <motion.div 
          className="mt-8 flex justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }} // 👈 Animación reversible según scroll
          variants={fadeInUp}
        >
          <Button asChild className="bg-teal-500 hover:bg-teal-600 text-white">
            <Link href="/history">Ver Portafolio</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}