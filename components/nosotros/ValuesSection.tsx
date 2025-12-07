"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Target, Rocket, Heart, Sparkles, X } from 'lucide-react'
import { AnimatedBackground } from './AnimatedBackground'
import { ANIMATION_CONFIG, PARTICLE_CONFIG } from './constants'
import { ShimmerEffect } from './ShimmerEffect'

const values = [
  {
    id: 'mision',
    title: 'Misión',
    icon: Rocket,
    gradient: 'from-emerald-500 to-cyan-500',
    shortDescription: 'Nuestro propósito',
    fullDescription: 'En SOLIDEV, nuestra misión es transformar la presencia digital de cada negocio en una máquina de crecimiento. No solo creamos páginas web; construimos ecosistemas digitales que convierten visitantes en clientes leales y transforman ideas en resultados tangibles. Cada proyecto que desarrollamos está diseñado para impulsar tu negocio hacia el éxito, utilizando las últimas tecnologías y estrategias de conversión probadas.',
    position: { top: '10%', left: '40%', transform: 'translate(-50%, -50%)' },
    angle: 0
  },
  {
    id: 'vision',
    title: 'Visión',
    icon: Target,
    gradient: 'from-cyan-500 to-teal-500',
    shortDescription: 'Nuestro futuro',
    fullDescription: 'Visualizamos un mundo donde cada empresa, sin importar su tamaño, tenga acceso a una presencia digital de clase mundial. Aspiramos a ser el socio tecnológico de confianza que impulsa el crecimiento de miles de negocios, creando experiencias web que no solo se ven increíbles, sino que generan resultados reales. Nuestra visión es liderar la revolución del desarrollo web, estableciendo nuevos estándares de excelencia y transformación digital.',
    position: { bottom: '15%', left: '10%' },
    angle: -25
  },
  {
    id: 'valores',
    title: 'Valores',
    icon: Heart,
    gradient: 'from-violet-500 to-rose-500',
    shortDescription: 'Nuestros principios',
    fullDescription: 'Creemos en la excelencia como estándar, no como excepción. Cada línea de código que escribimos refleja nuestro compromiso con la calidad, la innovación y el éxito de nuestros clientes. Valoramos la transparencia en cada interacción, la pasión por crear soluciones extraordinarias, y la dedicación a superar expectativas. En SOLIDEV, no solo entregamos proyectos; construimos relaciones duraderas basadas en confianza, resultados y crecimiento mutuo.',
    position: { bottom: '15%', right: '0%' },
    angle: 25
  }
]

export function ValuesSection() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const handleCardClick = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  return (
    <motion.section 
      className="values-section snap-start"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={ANIMATION_CONFIG.viewport}
      transition={ANIMATION_CONFIG.transitions.smooth}
    >
      {/* Fondo animado reutilizable */}
      <AnimatedBackground particleCount={PARTICLE_CONFIG.values.count} opacity={PARTICLE_CONFIG.values.opacity} />

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Centro: ¿Qué creemos? */}
          <motion.div
            className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 z-30"
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={ANIMATION_CONFIG.viewport}
            transition={{ 
              ...ANIMATION_CONFIG.transitions.smooth,
              type: "spring", 
              stiffness: 80, 
              damping: 15 
            }}
          >
            <motion.div
              className="values-center-card gpu-accelerated"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={ANIMATION_CONFIG.transitions.fast}
            >
              {/* Fondo con gradiente animado */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-teal-500/20 to-cyan-500/20"
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Patrón decorativo */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:30px_30px]" />

              {/* Contenido del centro */}
              <div className="relative z-10 text-center px-8">
                <motion.div
                  className="inline-block mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-12 w-12 text-cyan-400 mx-auto" />
                </motion.div>
                <motion.h2
                  className="text-3xl md:text-4xl font-black text-home-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={ANIMATION_CONFIG.viewport}
                  transition={{ ...ANIMATION_CONFIG.transitions.fast, delay: 0.3 }}
                >
                  <span className="hero-gradient-text">
                    ¿QUÉ CREEMOS?
                  </span>
                </motion.h2>
                <motion.p
                  className="text-sm md:text-base text-home-gray-ui-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={ANIMATION_CONFIG.viewport}
                  transition={{ ...ANIMATION_CONFIG.transitions.fast, delay: 0.5 }}
                >
                  Nuestros pilares fundamentales
                </motion.p>
              </div>

              {/* Efecto de brillo deslizante */}
              <ShimmerEffect opacity={0.1} duration={3} />
            </motion.div>
          </motion.div>

          {/* Líneas conectoras animadas - optimizado */}
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            {values.map((value, index) => (
              <motion.line
                key={`line-${value.id}`}
                x1="50%"
                y1="50%"
                x2={value.position.left === '50%' ? '50%' : value.position.left === '10%' ? '20%' : '80%'}
                y2={value.position.top ? '20%' : '80%'}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.4 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 1 + index * 0.2 }}
              />
            ))}
          </motion.svg>

          {/* Cartas de valores */}
          {values.map((value, index) => {
            const Icon = value.icon
            const isExpanded = expandedCard === value.id
            const anyExpanded = expandedCard !== null

            return (
              <motion.div
                key={value.id}
                className="absolute z-30"
                style={{
                  ...(value.position as any),
                  zIndex: isExpanded ? 50 : 20,
                  pointerEvents: isExpanded ? 'auto' : anyExpanded ? 'none' : 'auto'
                }}
                animate={!isExpanded && anyExpanded ? { opacity: 0 } : { opacity: 1 }}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: value.angle === 0 ? 0 : value.angle < 0 ? -200 : 200,
                  y: value.angle === 0 ? -200 : 0,
                  rotate: value.angle
                }}
                whileInView={{ 
                  opacity: 1, 
                  scale: 1,
                  x: 0,
                  y: 0,
                  rotate: 0
                }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.5 + index * 0.15,
                  type: "spring",
                  stiffness: 60,
                  damping: 15
                }}
              >
                <motion.div
                  className={`relative cursor-pointer ${
                    isExpanded 
                      ? 'w-[90vw] max-w-2xl md:w-[600px]' 
                      : 'w-72 md:w-80'
                  } transition-all duration-500`}
                  onClick={() => handleCardClick(value.id)}
                  whileHover={!isExpanded ? { scale: 1.05, y: -5 } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    {!isExpanded ? (
                      <motion.div
                        key="collapsed"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="bg-home-dark-3/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-home-light/30 shadow-xl hover:shadow-2xl relative overflow-hidden"
                      >
                        {/* Fondo con gradiente */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-10`}
                          animate={{ opacity: [0.1, 0.2, 0.1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          style={{ willChange: "opacity" }}
                        />

                        {/* Icono */}
                        <motion.div
                          className={`values-icon bg-gradient-to-br ${value.gradient} flex items-center justify-center relative z-10`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={ANIMATION_CONFIG.transitions.medium}
                        >
                          <Icon className="h-10 w-10 text-white" />
                        </motion.div>

                        {/* Título */}
                        <h4 className="text-2xl font-bold text-home-white mb-2 text-center relative z-10">
                          {value.title}
                        </h4>

                        {/* Descripción corta */}
                        <p className="text-home-gray-ui-2 text-sm text-center relative z-10">
                          {value.shortDescription}
                        </p>

                        <motion.div
                          className="mt-3 text-cyan-400 text-xs font-semibold text-center relative z-10"
                          animate={{
                            opacity: [0.5, 1, 0.5],
                            y: [0, -5, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          Click para expandir
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="expanded"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                        className="bg-home-dark-3/95 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border-2 border-cyan-500/50 shadow-2xl relative overflow-hidden"
                      >
                        {/* Botón cerrar */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedCard(null)
                          }}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-all border-2 border-cyan-500/50 z-50"
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="h-5 w-5" />
                        </motion.button>

                        {/* Fondo con gradiente animado */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-20`}
                          animate={{ opacity: [0.2, 0.3, 0.2] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          style={{ willChange: "opacity" }}
                        />

                        {/* Contenido expandido */}
                        <div className="relative z-10">
                          <motion.div
                            className={`w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shadow-xl`}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          >
                            <Icon className="h-12 w-12 text-white" />
                          </motion.div>

                          <motion.h3
                            className="text-3xl md:text-4xl font-black text-home-white mb-6 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <span className={`bg-gradient-to-r ${value.gradient} bg-clip-text text-transparent`}>
                              {value.title}
                            </span>
                          </motion.h3>

                          <motion.p
                            className="text-base md:text-lg text-home-gray-ui-2 leading-relaxed text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            {value.fullDescription}
                          </motion.p>
                        </div>

                        {/* Efecto de brillo */}
                        <ShimmerEffect opacity={0.05} duration={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
