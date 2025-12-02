// Tipos y constantes para la página Nosotros

export interface MemberConfig {
  name: string
  role: string
  gradient: string
  gradientHover: string
  glowClass: string
  borderClass: string
  buttonGradient: string
  shadowColor: string
  bgOverlay: string
  images: string[]
}

export interface TeamMember extends MemberConfig {
  id: string
  img: string
  whatsapp: string
}

export const memberConfig = {
  matias: {
    name: 'Matías',
    role: 'Socio fundador de Solidev. Titulado en Ingeniería en Informática.',
    gradient: 'from-cyan-500 via-cyan-400 to-cyan-300',
    gradientHover: 'from-cyan-400 via-cyan-300 to-cyan-200',
    glowClass: 'member-card-active-cyan',
    borderClass: 'member-card-border-cyan',
    buttonGradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 50%, #67e8f9 100%)',
    shadowColor: 'rgba(6, 182, 212, 0.5)',
    bgOverlay: 'rgba(6, 182, 212, 0.15)',
    images: [] as string[]
  },
  raul: {
    name: 'Raúl',
    role: 'Socio fundador de Solidev. Titulado en Ingeniería en Informática.',
    gradient: 'from-emerald-500 via-emerald-400 to-emerald-300',
    gradientHover: 'from-emerald-400 via-emerald-300 to-emerald-200',
    glowClass: 'member-card-active-emerald',
    borderClass: 'member-card-border-emerald',
    buttonGradient: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
    shadowColor: 'rgba(16, 185, 129, 0.5)',
    bgOverlay: 'rgba(16, 185, 129, 0.15)',
    images: [] as string[]
  },
  cris: {
    name: 'Cris',
    role: 'Socio fundador de Solidev. Titulado en Ingeniería en Informática.',
    gradient: 'from-violet-500 via-violet-400 to-violet-300',
    gradientHover: 'from-violet-400 via-violet-300 to-violet-200',
    glowClass: 'member-card-active-violet',
    borderClass: 'member-card-border-violet',
    buttonGradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)',
    shadowColor: 'rgba(139, 92, 246, 0.5)',
    bgOverlay: 'rgba(139, 92, 246, 0.15)',
    images: [] as string[]
  },
  daniel: {
    name: 'Daniel',
    role: 'Socio fundador de Solidev. Titulado en Ingeniería en Informática.',
    gradient: 'from-rose-500 via-rose-400 to-rose-300',
    gradientHover: 'from-rose-400 via-rose-300 to-rose-200',
    glowClass: 'member-card-active-rose',
    borderClass: 'member-card-border-rose',
    buttonGradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 50%, #fda4af 100%)',
    shadowColor: 'rgba(244, 63, 94, 0.5)',
    bgOverlay: 'rgba(244, 63, 94, 0.15)',
    images: [] as string[]
  }
}

export const team: TeamMember[] = [
  {
    id: 'matias',
    ...memberConfig.matias,
    img: '/images/matias.png',
    whatsapp: '+56 9 1234 5678'
  },
  {
    id: 'raul',
    ...memberConfig.raul,
    img: '/images/raul.png',
    whatsapp: '+56 9 2345 6789'
  },
  {
    id: 'cris',
    ...memberConfig.cris,
    img: '/images/cris.png',
    whatsapp: '+56 9 3456 7890'
  },
  {
    id: 'daniel',
    ...memberConfig.daniel,
    img: '/images/daniel.png',
    whatsapp: '+56 9 4567 8901'
  }
]
