"use client"
import { motion } from 'framer-motion'

interface PulsingGlowProps {
  color: string
  intensity?: number
  className?: string
}

export function PulsingGlow({ color, intensity = 0.4, className = "" }: PulsingGlowProps) {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 ${40 * intensity}px ${color}${Math.floor(40 * intensity)}, 0 0 ${80 * intensity}px ${color}${Math.floor(20 * intensity)}`,
          `0 0 ${60 * intensity}px ${color}${Math.floor(60 * intensity)}, 0 0 ${100 * intensity}px ${color}${Math.floor(30 * intensity)}`,
          `0 0 ${40 * intensity}px ${color}${Math.floor(40 * intensity)}, 0 0 ${80 * intensity}px ${color}${Math.floor(20 * intensity)}`,
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

