"use client"
import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'

export function ScrollIndicator() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true)
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const section = Math.floor((scrollPosition + windowHeight / 2) / windowHeight)
      setCurrentSection(Math.min(section, 2))
      
      setTimeout(() => setIsScrolling(false), 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionIndex: number) => {
    const windowHeight = window.innerHeight
    window.scrollTo({
      top: sectionIndex * windowHeight,
      behavior: 'smooth'
    })
  }

  const sectionNames = ['Inicio', 'Equipo', 'Valores']

  return (
    <>
      {/* Barra de progreso superior */}
      <motion.div
        className="scroll-progress-bar"
        style={{ scaleX }}
      />

      {/* Indicador lateral con secciones */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 items-center">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => scrollToSection(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Indicador circular */}
            <motion.div
              className={`w-4 h-16 rounded-full transition-all duration-300 relative overflow-hidden ${
                currentSection === index 
                  ? 'bg-gradient-to-b from-cyan-500 via-teal-500 to-cyan-500' 
                  : 'bg-home-gray-ui-1/30'
              }`}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: currentSection === index ? 1.2 : 1,
                opacity: currentSection === index ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Efecto de brillo animado */}
              {currentSection === index && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent"
                  animate={{
                    y: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              )}
            </motion.div>

            {/* Nombre de la sección (aparece cuando está activa) */}
            <AnimatePresence>
              {currentSection === index && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute right-6 flex items-center"
                >
                  <span className="text-xs text-cyan-400 font-semibold whitespace-nowrap transform -rotate-90">
                    {sectionNames[index]}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Indicador de scroll (flecha animada) */}
      {currentSection < 2 && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <motion.span
            className="text-home-gray-ui-2 text-sm font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll
          </motion.span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg
              className="w-6 h-6 text-cyan-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
