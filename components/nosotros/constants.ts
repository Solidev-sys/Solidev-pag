// Constantes compartidas para la sección Nosotros
export const ANIMATION_CONFIG = {
  spring: {
    stiffness: 60,
    damping: 15,
    mass: 1,
  },
  transitions: {
    smooth: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    fast: { duration: 0.3, ease: "easeOut" },
    medium: { duration: 0.6, ease: "easeInOut" },
  },
  viewport: {
    once: true,
    amount: 0.2,
    margin: "0px",
  },
} as const

export const GRADIENT_COLORS = {
  primary: "linear-gradient(135deg, #06b6d4 0%, #14b8a6 25%, #667eea 50%, #764ba2 75%, #06b6d4 100%)",
  cyan: "from-cyan-400 via-teal-300 to-cyan-500",
  glow: {
    cyan: "0 0 40px rgba(6, 182, 212, 0.4), 0 0 80px rgba(6, 182, 212, 0.2)",
    cyanStrong: "0 0 60px rgba(6, 182, 212, 0.6), 0 0 100px rgba(6, 182, 212, 0.3)",
  },
} as const

export const PARTICLE_CONFIG = {
  hero: { count: 15, opacity: 0.4 },
  team: { count: 12, opacity: 0.3 },
  values: { count: 10, opacity: 0.3 },
} as const

