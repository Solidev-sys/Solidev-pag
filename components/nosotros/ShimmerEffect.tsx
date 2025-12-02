"use client"
import { motion } from 'framer-motion'

interface ShimmerEffectProps {
  className?: string
  opacity?: number
  duration?: number
}

export function ShimmerEffect({ className = "", opacity = 0.1, duration = 3 }: ShimmerEffectProps) {
  const opacityValue = Math.floor(opacity * 100)
  return (
    <motion.div
      className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/${opacityValue} to-transparent ${className}`}
      animate={{ x: ["-100%", "100%"] }}
      transition={{ duration, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
      style={{ transform: "skewX(-20deg)", willChange: "transform" }}
    />
  )
}

