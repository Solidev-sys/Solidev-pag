"use client"
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { HeroPage } from '@/components/nosotros/HeroPage'
import { TeamSection } from '@/components/nosotros/TeamSection'
import { ValuesSection } from '@/components/nosotros/ValuesSection'
import './nosotros.css'

export default function NosotrosPage() {
  // Generar partículas de forma determinística para evitar errores de hidratación
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      // Usar valores determinísticos basados en el índice
      const seed = i * 7.3 // Multiplicador para distribuir valores
      return {
        id: i,
        left: ((seed * 13.7) % 100),
        top: ((seed * 19.3) % 100),
        delay: ((seed * 2.1) % 6),
      }
    })
  }, [])

  return (
    <main className="bg-home-black text-home-white relative overflow-x-hidden snap-container">

      {/* Partículas de fondo decorativas */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-cyan-500/20 floating-particle"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Sección: ¿Qué es SOLIDEV? */}
      <div className="relative z-10">
        <HeroPage />
      </div>

      {/* Sección: Equipo Solidev */}
      <div className="relative z-10">
        <TeamSection />
      </div>

      {/* Sección: Lo que creemos */}
      <div className="relative z-10">
        <ValuesSection />
      </div>
    </main>
  )
}