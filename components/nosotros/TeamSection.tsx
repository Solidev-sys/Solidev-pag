"use client"
import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MessageCircle, Github, ChevronLeft, ChevronRight, X, Sparkles, Linkedin } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { team, TeamMember } from './types'
import { AnimatedBackground } from './AnimatedBackground'
import { ANIMATION_CONFIG, PARTICLE_CONFIG } from './constants'
import { ShimmerEffect } from './ShimmerEffect'

// Componente de carrusel de imágenes
const ImageCarousel = ({ images, memberColor }: { images: string[], memberColor: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-home-dark-4 rounded-xl border-2 border-home-light">
        <p className="text-home-gray-ui-2">No hay imágenes disponibles</p>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-home-light/20 shadow-2xl">
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Imagen ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Controles del carrusel mejorados */}
        {images.length > 1 && (
          <>
            {[
              { Icon: ChevronLeft, onClick: prevImage, x: -5, position: 'left-4' },
              { Icon: ChevronRight, onClick: nextImage, x: 5, position: 'right-4' }
            ].map(({ Icon, onClick, x, position }) => (
              <motion.button
                key={position}
                onClick={onClick}
                className={`absolute ${position} top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-all z-10 border-2 shadow-lg`}
                style={{ borderColor: memberColor }}
                whileHover={{ scale: 1.1, x }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  boxShadow: [
                    `0 0 20px ${memberColor}60`,
                    `0 0 30px ${memberColor}80`,
                    `0 0 20px ${memberColor}60`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon className="h-6 w-6" />
              </motion.button>
            ))}

            {/* Indicadores mejorados */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
              {images.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="rounded-full transition-all"
                  style={{
                    backgroundColor: index === currentIndex ? memberColor : 'rgba(255, 255, 255, 0.3)',
                    width: index === currentIndex ? 32 : 8,
                    height: 8,
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={index === currentIndex ? {
                    boxShadow: [
                      `0 0 10px ${memberColor}80`,
                      `0 0 20px ${memberColor}`,
                      `0 0 10px ${memberColor}80`,
                    ],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: index === currentIndex ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Modal expandido para mostrar la tarjeta con carrusel
const ExpandedMemberModal = ({ 
  member, 
  isOpen, 
  onClose 
}: { 
  member: TeamMember | null, 
  isOpen: boolean, 
  onClose: () => void 
}) => {
  const [isContactExpanded, setIsContactExpanded] = useState(false)
  const scrollYRef = useRef(0)

  useEffect(() => {
    if (isOpen) {
      const y = window.scrollY || window.pageYOffset
      scrollYRef.current = y
      const bodyStyle = document.body.style
      const htmlStyle = document.documentElement.style
      bodyStyle.position = 'fixed'
      bodyStyle.top = `-${y}px`
      bodyStyle.left = '0'
      bodyStyle.right = '0'
      bodyStyle.width = '100%'
      bodyStyle.overflow = 'hidden'
      htmlStyle.overflow = 'hidden'
      htmlStyle.overscrollBehavior = 'none'
    } else {
      const bodyStyle = document.body.style
      const htmlStyle = document.documentElement.style
      bodyStyle.position = ''
      bodyStyle.top = ''
      bodyStyle.left = ''
      bodyStyle.right = ''
      bodyStyle.width = ''
      bodyStyle.overflow = ''
      htmlStyle.overflow = ''
      htmlStyle.overscrollBehavior = ''
      window.scrollTo(0, scrollYRef.current)
      setIsContactExpanded(false)
    }
    return () => {
      const bodyStyle = document.body.style
      const htmlStyle = document.documentElement.style
      bodyStyle.position = ''
      bodyStyle.top = ''
      bodyStyle.left = ''
      bodyStyle.right = ''
      bodyStyle.width = ''
      bodyStyle.overflow = ''
      htmlStyle.overflow = ''
      htmlStyle.overscrollBehavior = ''
    }
  }, [isOpen])

  // URLs hardcodeadas - puedes cambiarlas aquí
  const getLinkedInUrl = (memberName: string) => {
    // Ejemplo: puedes mapear nombres a URLs específicas
    const linkedInMap: Record<string, string> = {
      'Matías': 'https://www.linkedin.com/in/matias-ejemplo',
      'Daniel': 'https://www.linkedin.com/in/daniel-ejemplo',
      'Raúl': 'https://www.linkedin.com/in/raul-ejemplo',
      'Cristian': 'https://www.linkedin.com/in/cristian-ejemplo',
    }
    return linkedInMap[memberName] || 'https://www.linkedin.com'
  }

  const getWhatsAppUrl = (memberName: string) => {
    // Ejemplo: puedes mapear nombres a números específicos
    const whatsappMap: Record<string, string> = {
      'Matías': '5491234567890', // Formato: código país + número sin +
      'Daniel': '5491234567891',
      'Raúl': '5491234567892',
      'Cristian': '5491234567893',
    }
    const number = whatsappMap[memberName] || '5491234567890'
    return `https://wa.me/${number}`
  }

  if (!member || !isOpen) return null

  return (
    typeof window !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                  onClick={onClose}
                >
                  <motion.div
                    className="absolute inset-0 bg-home-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
              <motion.div
                className="absolute inset-0 opacity-40 animated-gradient"
                style={{
                  background: "linear-gradient(135deg, #06b6d4 0%, #14b8a6 25%, #667eea 50%, #764ba2 75%, #06b6d4 100%)",
                  backgroundSize: "400% 400%",
                }}
              />
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at center, ${member.bgOverlay} 0%, rgba(0, 0, 0, 0.95) 70%)`,
                }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            {/* Backdrop blur */}
            <div 
              className="absolute inset-0 backdrop-blur-xl"
              style={{
                background: 'rgba(0, 0, 0, 0.7)'
              }}
            />
            {/* Contenido del modal mejorado */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 50, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 50, rotateX: 15 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-6xl bg-home-dark-3/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border-2"
              style={{ 
                borderColor: member.shadowColor,
                boxShadow: `0 25px 100px ${member.shadowColor}40, 0 0 60px ${member.shadowColor}20`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Efecto de brillo en el borde */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: `linear-gradient(135deg, ${member.shadowColor}20, transparent, ${member.shadowColor}20)`,
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              {/* Botón de cerrar mejorado */}
              <motion.button
                onClick={onClose}
                className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-all border-2 shadow-lg cursor-pointer"
                style={{ borderColor: member.shadowColor }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  boxShadow: [
                    `0 0 20px ${member.shadowColor}60`,
                    `0 0 30px ${member.shadowColor}80`,
                    `0 0 20px ${member.shadowColor}60`,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <X className="h-6 w-6" />
              </motion.button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full relative z-10">
                {/* Tarjeta del miembro (izquierda) mejorada */}
                <div className="p-8 lg:p-12 flex flex-col justify-center items-center bg-home-dark-4/80 backdrop-blur-sm relative overflow-hidden">
                  {/* Fondo con gradiente animado */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${member.gradient}`}
                    animate={{
                      opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Patrón decorativo */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:30px_30px]" />

                  <div className="relative z-10 w-full max-w-sm">
                    {/* Imagen del miembro mejorada */}
                    <motion.div 
                      className="w-72 h-72 mx-auto mb-8 flex items-center justify-center relative"
                      initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                    >
                      {/* Anillos decorativos animados */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-4"
                        style={{ borderColor: member.shadowColor }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2"
                        style={{ borderColor: member.shadowColor }}
                        animate={{
                          scale: [1.1, 1.3, 1.1],
                          opacity: [0.2, 0.4, 0.2],
                          rotate: [360, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-white bg-home-dark-3 shadow-2xl relative z-10" style={{ borderColor: '#ffffff' }}>
                        <img 
                          src={member.img} 
                          alt={member.name} 
                          className="w-full h-full object-contain bg-home-dark-3" 
                        />
                        <motion.div 
                          className={`absolute inset-0 bg-gradient-to-br ${member.gradient} rounded-3xl`}
                          animate={{
                            opacity: [0.2, 0.4, 0.2],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                    </motion.div>

                    {/* Nombre mejorado */}
                    <motion.h2 
                      className="text-4xl md:text-5xl font-black text-home-white mb-4 text-center"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="bg-gradient-to-r from-cyan-300 via-white to-teal-300 bg-clip-text text-transparent">
                        {member.name}
                      </span>
                    </motion.h2>

                    {/* Rol mejorado */}
                    <motion.p 
                      className="text-lg md:text-xl text-home-gray-ui-2 mb-8 text-center leading-relaxed font-medium"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      style={{
                        color: member.shadowColor,
                        textShadow: `0 0 20px ${member.shadowColor}40`
                      }}
                    >
                      {member.role}
                    </motion.p>

                    {/* Botón de contacto con efecto explosión */}
                    <div className="w-full relative">
                      <AnimatePresence mode="wait">
                        {!isContactExpanded ? (
                          <motion.button
                            key="contact-button"
                            className="w-full py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer"
                            style={{
                              background: member.buttonGradient,
                              color: '#FFFFFF',
                            }}
                            initial={{ opacity: 0, scale: 0.85, y: 50, rotateX: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 50, rotateX: 15 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsContactExpanded(true)}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: '200%' }}
                              transition={{ duration: 0.6 }}
                            />
                            <MessageCircle className="h-5 w-5 relative z-10" />
                            <span className="relative z-10">Contáctame</span>
                          </motion.button>
                        ) : (
                          <motion.div
                            key="contact-buttons"
                            className="flex flex-col gap-4 cursor-pointer"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                          >
                            {/* Botón LinkedIn */}
                            <motion.a
                              href={getLinkedInUrl(member.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-3 relative overflow-hidden group"
                              style={{
                                background: 'linear-gradient(135deg, #0077b5 0%, #00a0dc 100%)',
                                color: '#FFFFFF',
                              }}
                              initial={{ x: -100, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '200%' }}
                                transition={{ duration: 0.6 }}
                              />
                              <Linkedin className="h-6 w-6 relative z-10" />
                              <span className="relative z-10">LinkedIn</span>
                              <motion.div
                                className="absolute inset-0 rounded-xl"
                                style={{
                                  boxShadow: `0 0 30px rgba(0, 119, 181, 0.6)`,
                                }}
                                animate={{
                                  boxShadow: [
                                    '0 0 30px rgba(0, 119, 181, 0.6)',
                                    '0 0 50px rgba(0, 119, 181, 0.8)',
                                    '0 0 30px rgba(0, 119, 181, 0.6)',
                                  ],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            </motion.a>

                            {/* Botón WhatsApp */}
                            <motion.a
                              href={getWhatsAppUrl(member.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-3 relative overflow-hidden group"
                              style={{
                                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                color: '#FFFFFF',
                              }}
                              initial={{ x: 100, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '200%' }}
                                transition={{ duration: 0.6 }}
                              />
                              <MessageCircle className="h-6 w-6 relative z-10" />
                              <span className="relative z-10">WhatsApp</span>
                              <motion.div
                                className="absolute inset-0 rounded-xl"
                                style={{
                                  boxShadow: `0 0 30px rgba(37, 211, 102, 0.6)`,
                                }}
                                animate={{
                                  boxShadow: [
                                    '0 0 30px rgba(37, 211, 102, 0.6)',
                                    '0 0 50px rgba(37, 211, 102, 0.8)',
                                    '0 0 30px rgba(37, 211, 102, 0.6)',
                                  ],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            </motion.a>

                            {/* Botón para volver */}
                            <motion.button
                              onClick={() => setIsContactExpanded(false)}
                              className="w-full py-2 rounded-lg font-semibold text-home-gray-ui-2 hover:text-home-white border-2 border-home-light/30 hover:border-home-light/50 transition-all duration-300 backdrop-blur-sm cursor-pointer"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Volver
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Carrusel de imágenes (derecha) mejorado */}
                <div className="p-8 lg:p-12 bg-home-dark-3/80 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                  {/* Fondo decorativo */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]" />
                  
                  <div className="w-full h-96 lg:h-full max-h-[600px] relative z-10">
                    <ImageCarousel 
                      images={member.images || []} 
                      memberColor={member.shadowColor}
                    />
                  </div>
                </div>
              </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    ) : null
  )
}

// Componente de tarjeta de miembro con efectos 3D
const MemberCard = ({ 
  member, 
  index,
  onCardClick,
  onHoverChange
}: { 
  member: TeamMember, 
  index: number,
  onCardClick: (member: TeamMember) => void,
  onHoverChange?: (isHovered: boolean, color?: string) => void
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [hoverTime, setHoverTime] = useState(0)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

  // Rastrear el tiempo de hover para el efecto gradual
  useEffect(() => {
    if (isHovered) {
      hoverTimerRef.current = setInterval(() => {
        setHoverTime((prev) => Math.min(prev + 0.1, 1)) // Máximo 1 después de 1 segundo
      }, 100)
    } else {
      if (hoverTimerRef.current) {
        clearInterval(hoverTimerRef.current)
      }
      setHoverTime(0)
    }
    
    return () => {
      if (hoverTimerRef.current) {
        clearInterval(hoverTimerRef.current)
      }
    }
  }, [isHovered])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    setHoverTime(0)
    onHoverChange?.(true, member.shadowColor)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
    setHoverTime(0)
    onHoverChange?.(false)
  }

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={() => onCardClick(member)}
      className="team-card gpu-accelerated"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ 
        opacity: 0, 
        y: 100, 
        scale: 0.8,
        rotateY: index % 4 === 0 ? -20 : index % 4 === 1 ? 20 : index % 4 === 2 ? -10 : 10,
        rotateX: index % 3 === 0 ? 15 : index % 3 === 1 ? -15 : 10,
        x: index % 2 === 0 ? -30 : 30
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotateY: 0,
        rotateX: 0,
        x: 0
      }}
      viewport={{ once: true, margin: "0px", amount: 0.2 }}
      transition={{ 
        duration: 1.4, 
        delay: index * 0.08,
        type: "spring", 
        stiffness: 50,
        damping: 18,
        mass: 1
      }}
      whileHover={{ 
        scale: 1.05,
        y: -12,
        rotateY: index % 2 === 0 ? 2 : -2,
        transition: { duration: 0.4, type: "spring", stiffness: 300 }
      }}
    >
      {/* Borde animado mejorado */}
      <motion.div 
        className="absolute inset-0 rounded-3xl border-2 transition-all duration-500"
        style={{
          borderColor: isHovered ? member.shadowColor : 'rgba(255, 255, 255, 0.1)',
          boxShadow: isHovered 
            ? `0 0 40px ${member.shadowColor}80, 0 0 80px ${member.shadowColor}40, inset 0 0 40px ${member.shadowColor}20`
            : '0 0 20px rgba(0, 0, 0, 0.3)',
          willChange: isHovered ? "box-shadow" : "auto"
        }}
        animate={isHovered ? {
          boxShadow: [
            `0 0 40px ${member.shadowColor}80, 0 0 80px ${member.shadowColor}40`,
            `0 0 60px ${member.shadowColor}, 0 0 100px ${member.shadowColor}60`,
            `0 0 40px ${member.shadowColor}80, 0 0 80px ${member.shadowColor}40`,
          ],
        } : {}}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
      />
      
      {/* Fondo con gradiente animado - aumenta gradualmente según tiempo de hover */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${member.gradient} rounded-3xl`}
        animate={{
          opacity: isHovered ? 0.05 + (hoverTime * 0.4) : 0.05, // De 0.05 a 0.45 según tiempo
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
      />

      {/* Efecto de ondas de agua optimizado */}
      {isHovered && [1, 1.2, 1.4].map((baseScale, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `radial-gradient(circle, ${member.shadowColor}${Math.floor((20 - i * 5) * hoverTime)} 0%, transparent ${70 - i * 10}%)`,
          }}
          animate={{
            scale: [baseScale, baseScale * 1.3, baseScale],
            opacity: [(0.3 - i * 0.1) * hoverTime, (0.6 - i * 0.1) * hoverTime, (0.3 - i * 0.1) * hoverTime],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}

      {/* Efecto de brillo deslizante */}
      {isHovered && <ShimmerEffect opacity={0.1} duration={1.5} />}

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center text-center flex-1">
        {/* Icono GitHub mejorado */}
        <motion.div
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 backdrop-blur-md flex items-center justify-center border-2 border-cyan-500/30 shadow-lg"
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.5 }}
          animate={isHovered ? {
            boxShadow: [
              "0 0 20px rgba(6, 182, 212, 0.4)",
              "0 0 30px rgba(6, 182, 212, 0.6)",
              "0 0 20px rgba(6, 182, 212, 0.4)",
            ],
          } : {}}
        >
          <Github className="h-6 w-6 text-cyan-400" />
        </motion.div>

        {/* Imagen del miembro mejorada */}
        <motion.div 
          className="w-44 h-44 md:w-48 md:h-48 mb-6 flex items-center justify-center flex-shrink-0 relative"
          whileHover={{ scale: 1.15, rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5, type: "tween", ease: "easeInOut" }}
        >
          {/* Anillo decorativo animado */}
          <motion.div
            className="absolute inset-0 rounded-full border-4"
            style={{ borderColor: member.shadowColor }}
            animate={isHovered ? {
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 360],
            } : {
              scale: 1,
              opacity: 0.2,
            }}
            transition={{
              duration: 3,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          
          <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-white bg-home-dark-4 shadow-2xl relative z-10" style={{ borderColor: '#ffffff' }}>
            <img 
              src={member.img} 
              alt={member.name} 
              className="w-full h-full object-contain bg-home-dark-4" 
            />
            {/* Overlay con gradiente animado */}
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-br ${member.gradient} rounded-2xl`}
              animate={{
                opacity: isHovered ? [0.2, 0.4, 0.2] : 0,
              }}
              transition={{
                duration: 2,
                repeat: isHovered ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        {/* Nombre mejorado */}
        <motion.h4 
          className="text-xl md:text-2xl font-black text-home-white mb-3 flex-shrink-0"
          whileHover={{ scale: 1.1 }}
          style={{
            textShadow: isHovered ? `0 0 20px ${member.shadowColor}` : 'none'
          }}
        >
          <span className="bg-gradient-to-r from-cyan-300 via-white to-teal-300 bg-clip-text text-transparent">
            {member.name}
          </span>
        </motion.h4>

        {/* Rol mejorado */}
        <motion.p 
          className="text-sm md:text-base text-home-gray-ui-2 mb-6 px-3 leading-relaxed flex-grow flex items-center font-medium"
          animate={isHovered ? {
            color: ['#9CA3AF', member.shadowColor, '#9CA3AF'],
          } : {}}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {member.role}
        </motion.p>

        {/* Botón de contacto mejorado */}
       
      </div>
    </motion.article>
  )
}

export function TeamSection() {
  const [expandedMember, setExpandedMember] = useState<TeamMember | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredCardColor, setHoveredCardColor] = useState<string | null>(null)
  const [hoverIntensity, setHoverIntensity] = useState(0)
  const intensityIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleCardClick = (member: TeamMember) => {
    setExpandedMember(member)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setExpandedMember(null), 300)
  }

  const handleHoverChange = (isHovered: boolean, color?: string) => {
    // Limpiar intervalo anterior
    if (intensityIntervalRef.current) {
      clearInterval(intensityIntervalRef.current)
      intensityIntervalRef.current = null
    }

    if (isHovered && color) {
      setHoveredCardColor(color)
      // Aumentar intensidad gradualmente
      intensityIntervalRef.current = setInterval(() => {
        setHoverIntensity((prev) => {
          const newValue = Math.min(prev + 0.05, 1)
          if (newValue >= 1 && intensityIntervalRef.current) {
            clearInterval(intensityIntervalRef.current)
            intensityIntervalRef.current = null
          }
          return newValue
        })
      }, 50)
    } else {
      // Disminuir intensidad gradualmente
      intensityIntervalRef.current = setInterval(() => {
        setHoverIntensity((prev) => {
          const newValue = prev - 0.1
          if (newValue <= 0) {
            if (intensityIntervalRef.current) {
              clearInterval(intensityIntervalRef.current)
              intensityIntervalRef.current = null
            }
            setHoveredCardColor(null)
            return 0
          }
          return newValue
        })
      }, 50)
    }
  }

  // Limpiar intervalos al desmontar
  useEffect(() => {
    return () => {
      if (intensityIntervalRef.current) {
        clearInterval(intensityIntervalRef.current)
      }
    }
  }, [])

  return (
    <>
      <motion.section 
        className="team-section snap-start"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={ANIMATION_CONFIG.viewport}
        transition={ANIMATION_CONFIG.transitions.smooth}
      >
        {/* Fondo animado reutilizable */}
        <AnimatedBackground particleCount={PARTICLE_CONFIG.team.count} opacity={PARTICLE_CONFIG.team.opacity} />

        {/* Overlay del color de la tarjeta hovered - efecto de agua optimizado */}
        {hoveredCardColor && [1, 1.1, 1.2].map((scale, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${hoveredCardColor}${Math.floor((30 - i * 10) * hoverIntensity)} 0%, transparent ${60 + i * 10}%)`,
            }}
            animate={{
              scale: [scale, scale * 1.2, scale],
              opacity: [(0.3 - i * 0.1) * hoverIntensity, (0.6 - i * 0.1) * hoverIntensity, (0.3 - i * 0.1) * hoverIntensity],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}

        {/* Contenido principal */}
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {/* Título mejorado */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h3 
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-4"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.2,
                type: "spring",
                stiffness: 80,
                damping: 12
              }}
            >
              <motion.span
                className="block bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500 bg-clip-text text-transparent animated-gradient-text"
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                EQUIPO SOLIDEV-TECH
              </motion.span>
            </motion.h3>

            <motion.p
              className="text-lg md:text-xl text-home-gray-ui-2 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 1, 
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              Profesionales apasionados que transforman ideas en experiencias digitales extraordinarias
            </motion.p>
          </motion.div>

          {/* Grid de tarjetas mejorado */}
          <motion.div 
            className="team-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={ANIMATION_CONFIG.viewport}
            transition={{ ...ANIMATION_CONFIG.transitions.smooth, delay: 0.2 }}
          >
            {team.map((member, index) => (
              <MemberCard 
                key={member.id} 
                member={member} 
                index={index}
                onCardClick={handleCardClick}
                onHoverChange={handleHoverChange}
              />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Modal expandido */}
      <ExpandedMemberModal 
        member={expandedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}
