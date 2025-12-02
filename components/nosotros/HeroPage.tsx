"use client"
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { AnimatedBackground } from './AnimatedBackground'
import { ShimmerEffect } from './ShimmerEffect'
import { PulsingGlow } from './PulsingGlow'
import { ANIMATION_CONFIG, PARTICLE_CONFIG, GRADIENT_COLORS } from './constants'

export function HeroPage() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <section 
      ref={ref}
      className="hero-section snap-start"
    >
      {/* Fondo animado reutilizable */}
      <AnimatedBackground particleCount={PARTICLE_CONFIG.hero.count} opacity={PARTICLE_CONFIG.hero.opacity} />

      {/* Contenido principal con parallax */}
      <motion.div
        className="hero-content gpu-accelerated"
        style={{ y, opacity, scale }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Columna de texto */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={ANIMATION_CONFIG.viewport}
            transition={ANIMATION_CONFIG.transitions.smooth}
            className="space-y-8"
          >
            {/* Badge animado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block"
            >
              <motion.span
                className="px-6 py-2 rounded-full text-sm font-semibold text-home-white bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-cyan-500/20 border border-cyan-500/30 backdrop-blur-sm relative"
              >
                <PulsingGlow 
                  color="rgba(6, 182, 212," 
                  intensity={0.3} 
                  className="absolute inset-0 rounded-full"
                />
                <span className="relative z-10">✨ Transformamos Ideas en Realidad Digital</span>
              </motion.span>
            </motion.div>

            {/* Título principal con efecto reveal */}
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={ANIMATION_CONFIG.viewport}
              transition={{ ...ANIMATION_CONFIG.transitions.smooth, delay: 0.3 }}
            >
              <span className="block hero-gradient-text">
                ¿QUÉ ES
              </span>
              <motion.span
                className="block text-home-white mt-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                SOLIDEV?
              </motion.span>
            </motion.h1>

            {/* Texto de neuroventas */}
            <motion.div
              className="space-y-4 text-lg md:text-xl text-home-gray-ui-2 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.p
                className="text-2xl md:text-3xl font-bold text-home-white mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Somos el <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">futuro del desarrollo web</span> que tu negocio necesita.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                En <strong className="text-home-white">SOLIDEV</strong>, no solo creamos páginas web. 
                <strong className="text-cyan-400"> Construimos experiencias digitales</strong> que convierten visitantes en clientes 
                y transforman tu presencia online en una máquina de crecimiento.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                Cada línea de código que escribimos está diseñada para <strong className="text-teal-400">impulsar tu negocio</strong>, 
                aumentar tus conversiones y posicionarte como líder en tu industria.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Link href="/#planes">
                <motion.button
                  className="hero-button hero-button-primary relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PulsingGlow color="rgba(6, 182, 212," intensity={0.5} className="absolute inset-0 rounded-lg" />
                  <ShimmerEffect className="rounded-lg" opacity={0.2} />
                  <span className="relative z-10">Comienza tu Proyecto</span>
                </motion.button>
              </Link>
              
              <Link href="/portafolio">
                <motion.button
                  className="hero-button px-8 py-4 rounded-lg font-bold text-home-white border-2 border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver Portafolio
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Columna visual con efectos 3D */}
          <motion.div
            className="relative h-[500px] lg:h-[600px]"
            initial={{ opacity: 0, x: 100, rotateY: -15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            {/* Contenedor 3D */}
            <div className="relative w-full h-full perspective-1000">
              <motion.div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
                whileHover={{ rotateY: 5, rotateX: 5 }}
                transition={{ duration: 0.5 }}
              >
                {/* Gradiente animado de fondo */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "linear-gradient(135deg, #06b6d4 0%, #14b8a6 50%, #667eea 100%)",
                      "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #06b6d4 100%)",
                      "linear-gradient(135deg, #06b6d4 0%, #14b8a6 50%, #667eea 100%)",
                    ],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Overlay con patrón */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px] opacity-30" />
                
                {/* Contenido visual central */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-center space-y-6 p-8"
                    animate={{
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.div
                      className="text-8xl font-black bg-gradient-to-r from-cyan-300 via-white to-teal-300 bg-clip-text text-transparent"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      SOLIDEV
                    </motion.div>
                    <motion.p
                      className="text-xl text-home-gray-ui-2 font-semibold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      Desarrollo Web de Clase Mundial
                    </motion.p>
                  </motion.div>
                </div>

                {/* Efectos de brillo animados */}
                <ShimmerEffect className="rounded-2xl" opacity={0.2} duration={3} />
              </motion.div>

              {/* Partículas decorativas alrededor - optimizado */}
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-cyan-400/60 particle-optimized"
                  style={{
                    top: `${20 + (i * 10)}%`,
                    left: i % 2 === 0 ? "10%" : "90%",
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: `${2 + (i % 3)}s`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-cyan-500/50 flex items-start justify-center p-2"
          whileHover={{ borderColor: "rgba(6, 182, 212, 1)" }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
