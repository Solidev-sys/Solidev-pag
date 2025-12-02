"use client"
import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface AnimatedBackgroundProps {
  particleCount?: number
  opacity?: number
}

export function AnimatedBackground({ particleCount = 12, opacity = 0.3 }: AnimatedBackgroundProps) {
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      width: 40 + (i * 4),
      height: 40 + (i * 4),
      left: (i * (100 / particleCount)) % 100,
      top: (i * (100 / (particleCount * 0.9))) % 100,
      color: i % 3 === 0 ? '6, 182, 212' : i % 3 === 1 ? '20, 184, 166' : '102, 126, 234',
      opacity: 0.1 + (i % 3) * 0.05,
      delay: i * 0.15,
      duration: 5 + (i % 4),
    }))
  }, [particleCount])

  return (
    <div className="absolute inset-0 bg-home-black">
      {/* Gradiente principal animado - optimizado con CSS */}
      <div
        className="absolute inset-0 gradient-animated"
        style={{
          background: "linear-gradient(135deg, #06b6d4 0%, #14b8a6 25%, #667eea 50%, #764ba2 75%, #06b6d4 100%)",
          opacity,
        }}
      />
      
      {/* Gradiente secundario con blur */}
      <motion.div
        className="absolute inset-0 blur-3xl"
        style={{
          background: "radial-gradient(circle at 30% 50%, #4facfe 0%, transparent 50%), radial-gradient(circle at 70% 50%, #00f2fe 0%, transparent 50%)",
          opacity: opacity * 0.7,
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Partículas flotantes optimizadas con CSS */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle-optimized absolute rounded-full"
          style={{
            width: particle.width,
            height: particle.height,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            background: `radial-gradient(circle, rgba(${particle.color}, ${particle.opacity}) 0%, transparent 70%)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

