"use client"
import { HeroPage } from '@/components/nosotros/HeroPage'
import { TeamSection } from '@/components/nosotros/TeamSection'
import { ValuesSection } from '@/components/nosotros/ValuesSection'
import './nosotros.css'

export default function NosotrosPage() {
  return (
    <main className="bg-home-black text-home-white relative overflow-x-hidden snap-container">

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