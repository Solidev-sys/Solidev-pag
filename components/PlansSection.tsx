"use client"

import { FC, useEffect, useRef, useState } from "react"
import type { BackendPlan } from "@/types/indexNew"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Script from "next/script"
import { apiService } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

// --- Función de ayuda (sin cambios) ---
function formatMoneyFromCentavos(value: number, currency: string) {
  const amount = (value ?? 0) / 100
  try {
    const isCLP = (currency || "CLP").toUpperCase() === "CLP"
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: currency || "CLP",
      maximumFractionDigits: isCLP ? 0 : 2,
    }).format(amount)
  } catch {
    return `$${Math.round(amount).toLocaleString("es-CL")}`
  }
}

// --- Props (sin cambios) ---
type Props = {
  plans: BackendPlan[]
}

// ===========================================
// VARIANTES DE ANIMACIÓN PARA SCROLL
// ===========================================

// 🎨 AJUSTA AQUÍ LA DURACIÓN Y VELOCIDAD DE LAS ANIMACIONES
const fadeInUpCard = {
  hidden: { opacity: 0, y: 80 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
}

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
}

const titleAnimation = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
}

// ===========================================
// SUB-COMPONENTE REUTILIZABLE: PlanCard
// ===========================================
type PlanCardProps = {
  plan: BackendPlan
  onClick: () => void
  isStatic?: boolean
  onContract?: () => void
  keepTiltEffect?: boolean
}

const PlanCard: FC<PlanCardProps> = ({ 
  plan, 
  onClick, 
  isStatic = false, 
  onContract,
  keepTiltEffect = false 
}) => {
  const disabled = !plan.activo
  const precioFormateado = formatMoneyFromCentavos(plan.precio_centavos, plan.moneda)
  const esAnual = plan.ciclo_fact === "anual"

  // Estados para el efecto 3D tilt
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  /**
   * Calcula el efecto tilt basado en la posición del mouse
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || disabled) return
    // Permitir tilt si keepTiltEffect está activo o no es estático
    if (!keepTiltEffect && isStatic) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // Calcula el ángulo de inclinación (máximo 10 grados para suavidad)
    const maxTilt = 10
    const tiltX = (mouseY / (rect.height / 2)) * -maxTilt
    const tiltY = (mouseX / (rect.width / 2)) * maxTilt

    setTilt({ x: tiltX, y: tiltY })
  }

  /**
   * Resetea el tilt cuando el mouse sale de la tarjeta
   */
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  /**
   * Maneja el hover
   */
  const handleMouseEnter = () => {
    if ((!isStatic || keepTiltEffect) && !disabled) {
      setIsHovered(true)
    }
  }

  const finalOnClick = isStatic || disabled ? () => {} : onClick
  const finalCursor = isStatic || disabled ? "default" : "cursor-pointer"

  // Calcula la sombra dinámica basada en el tilt
  const shadowIntensity = isHovered ? 0.4 : 0.15
  const shadowX = Math.round(tilt.y * 1.5)
  const shadowY = Math.round(tilt.x * 1.5) + (isHovered ? 12 : 0)
  const shadowBlur = 20 + Math.abs(shadowY) * 0.5

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      <motion.div
        layout={!isStatic}
        variants={isStatic ? undefined : fadeInUpCard}
        onClick={finalOnClick}
        className={`
          w-full h-full border-2 border-white/30 rounded-[18px] p-8
          ${finalCursor}
          ${disabled ? "opacity-60" : ""}
        `}
        animate={{
          rotateX: disabled ? 0 : tilt.x,
          rotateY: disabled ? 0 : tilt.y,
          scale: isHovered && !disabled ? 1.05 : 1,
          y: isHovered && !disabled ? -12 : 0,
          z: isHovered && !disabled ? 50 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.5
        }}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transformStyle: "preserve-3d",
          willChange: !disabled ? 'transform' : 'auto',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 206, 209, ${shadowIntensity}), 0 0 ${shadowBlur * 0.5}px rgba(0, 206, 209, ${shadowIntensity * 0.3})`
        }}
      >
      <h3 
        className="font-bold text-white uppercase mb-8"
        style={{ fontSize: "clamp(24px, 5vw, 34px)" }}
      >
        {plan.nombre}
      </h3>

      {plan.resumen && (
        <p
          className="text-[#F5F5F5] mb-6"
          style={{ fontSize: "clamp(14px, 3vw, 16px)" }}
        >
          {plan.resumen}
        </p>
      )}

      <div className="flex gap-2 mb-6">
        {plan.mensaje_rapido && (
          <span className="text-xs px-3 py-1 rounded-full bg-[#00CED1] text-[#1E1E1E]">rápido</span>
        )}
        {plan.mensaje_seguro && (
          <span className="text-xs px-3 py-1 rounded-full bg-[#00CED1] text-[#1E1E1E]">seguro</span>
        )}
      </div>

      {/* Precio */}
      <div className="mb-10">
        <span
          className="font-bold inline-block bg-clip-text text-transparent animated-gradient"
          style={{ 
            fontSize: "clamp(36px, 8vw, 52px)",
            backgroundImage: 'linear-gradient(90deg, #02CC9C 0%, #3AC1F0 100%)',
            fontWeight: 700,
          }}
        >
          {precioFormateado}
        </span>
        {esAnual && (
          <span
            className="ml-2 align-middle font-normal bg-clip-text text-transparent animated-gradient"
            style={{ 
              fontSize: "clamp(14px, 3vw, 19px)",
              backgroundImage: 'linear-gradient(90deg, #02CC9C 0%, #3AC1F0 100%)',
            }}
          >
            / ANUAL
          </span>
        )}
      </div>

      {/* Lista de características */}
      {plan.caracteristicas && plan.caracteristicas.length > 0 && (
        <ul
          className="mb-10 list-disc list-inside space-y-2 text-[#F5F5F5] leading-normal"
          style={{ fontSize: "clamp(15px, 3vw, 17px)" }}
        >
          {plan.caracteristicas
            .sort((a, b) => (a.posicion ?? 0) - (b.posicion ?? 0))
            .map((feat) => (
              <li key={feat.id}>
                {feat.etiqueta}
              </li>
            ))}
        </ul>
      )}

      {/* Botón Contratar */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (onContract) onContract()
          else if (!isStatic) finalOnClick()
        }}
        disabled={disabled}
        className="
          w-full transition-all duration-300 
          bg-transparent border-2 border-[#00CED1] text-white
          rounded-full mt-10 font-semibold
          hover:bg-[#00CED1] hover:text-[#1E1E1E]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white
        "
        style={{
          fontSize: "clamp(20px, 4vw, 26px)",
          padding: "14px 40px",
        }}
      >
        Contratar
      </button>
      </motion.div>
    </div>
  )
}


const CardIcons = {
  visa: (active: boolean) => (
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
      alt="Visa" 
      className={`h-6 w-auto object-contain transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-30 grayscale'}`}
    />
  ),
  mastercard: (active: boolean) => (
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
      alt="Mastercard" 
      className={`h-6 w-auto object-contain transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-30 grayscale'}`}
    />
  ),
  amex: (active: boolean) => (
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" 
      alt="Amex" 
      className={`h-6 w-auto object-contain transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-30 grayscale'}`}
    />
  )
}

// Función para formatear RUT (XXXXXXXX-Y)
const formatRUT = (value: string) => {
  // Limpiar todo lo que no sea número o K
  let clean = value.replace(/[^0-9kK]/g, '').toUpperCase()
  if (clean.length <= 1) return clean
  // Separar cuerpo y DV
  const body = clean.slice(0, -1)
  const dv = clean.slice(-1)
  return `${body}-${dv}`
}

const detectCardType = (number: string) => {
  const clean = number.replace(/\D/g, '')
  if (/^4/.test(clean)) return 'visa'
  if (/^5[1-5]|^2[2-7]/.test(clean)) return 'mastercard' // Mastercard BINs 51-55 & 2221-2720
  if (/^3[47]/.test(clean)) return 'amex'
  return null
}

// ===========================================
// COMPONENTE PRINCIPAL: PlansSection
// ===========================================
export const PlansSection: FC<Props> = ({ plans }) => {
  const { user } = useAuth()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [cardType, setCardType] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement | null>(null)
  const mpReadyRef = useRef(false)
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || ""
  const [sdkReady, setSdkReady] = useState(false)

  // Refs para auto-focus
  const cardNumRef = useRef<HTMLInputElement>(null)
  const expMonthRef = useRef<HTMLInputElement>(null)
  const expYearRef = useRef<HTMLInputElement>(null)
  const cvvRef = useRef<HTMLInputElement>(null)
  const docRef = useRef<HTMLInputElement>(null)

  if (!plans || plans.length === 0) return null

  const ordered = [...plans].sort(
    (a, b) => (a.precio_centavos ?? 0) - (b.precio_centavos ?? 0)
  )

  const handleSelect = (index: number) => setSelectedIndex(index)
  const handleNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex + 1) % ordered.length)
  }
  const handleClose = () => {
    setSelectedIndex(null)
    setShowCheckout(false)
    setCheckoutOpen(false)
  }

  useEffect(() => {
    setCheckoutOpen(false)
    setShowCheckout(false)
    setError(null)
    setSuccess(null)
  }, [selectedIndex])

  const mpRef = useRef<any>(null)

  useEffect(() => {
    if (checkoutOpen) {
      if (!publicKey) { return }
      if (!sdkReady) { return }
      if (!(window as any).MercadoPago) { return }
      if (!formRef.current) { return }
      if (selectedIndex === null) { return }
    }
    if (checkoutOpen && sdkReady && (window as any).MercadoPago && formRef.current && selectedIndex !== null) {
      try {
        const mp = new (window as any).MercadoPago(publicKey, { locale: 'es-CL' })
        mpRef.current = mp // Guardar referencia para uso manual
        
        mp.cardForm({
          amount: String((ordered[selectedIndex].precio_centavos ?? 0) / 100),
          autoMount: true,
          form: {
            id: '#subscription-card-form',
            cardholderName: { id: 'form-cardholder-name' },
            cardNumber: { id: 'form-card-number' },
            cardExpirationMonth: { id: 'form-card-exp-month' },
            cardExpirationYear: { id: 'form-card-exp-year' },
            securityCode: { id: 'form-security-code' },
            identificationType: { id: 'form-doc-type' },
            identificationNumber: { id: 'form-doc-number' },
            cardholderEmail: { id: 'form-cardholder-email' }
          },
          callbacks: {
            onFormMounted: (error: any) => {
              if (error) setError('Error al montar el formulario de tarjeta')
              else mpReadyRef.current = true
            },
            // Eliminamos onSubmit del SDK para manejarlo manualmente
            onSubmit: (e: any) => { e.preventDefault() } 
          }
        })
      } catch (e) {
        console.warn('MP SDK init warning:', e)
      }
    }
  }, [checkoutOpen, sdkReady, publicKey, selectedIndex, ordered])

  const handleManualPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedIndex === null) return
    if (!mpRef.current) {
        setError('El sistema de pagos no está listo. Intenta recargar.')
        return
    }

    setLoading(true)
    setError(null)

    try {
        // Usamos la instancia guardada para crear el token
        const tokenResult = await mpRef.current.cardForm.createCardToken()
        const token = tokenResult?.token
        
        if (!token) {
            // Si falla createCardToken, a veces devuelve error en el objeto, o simplemente null
            // Intentamos obtener datos del form por si acaso
            const formData = mpRef.current.cardForm.getCardFormData()
            if (formData?.token) {
                 // Recuperación exitosa
            } else {
                 throw new Error('No se pudo generar el token. Revisa los datos de la tarjeta.')
            }
        }
        
        const finalToken = token || mpRef.current.cardForm.getCardFormData()?.token

        if (!finalToken) throw new Error('Token de tarjeta inválido')

        const plan = ordered[selectedIndex]
        
        try {
            const suscripcion = await apiService.createSubscription(plan.id)
            const start = await apiService.startSubscription(suscripcion.id, finalToken)
            await apiService.confirmSubscription(start.preapproval_id)
            
            setSuccess('Suscripción creada y autorizada correctamente')
            setTimeout(() => {
            setCheckoutOpen(false)
            setShowCheckout(false)
            setSelectedIndex(null)
            window.location.href = "/payment/success"
            }, 1500)
            
        } catch (backendError: any) {
            console.error('Error de procesamiento:', backendError)
            const reason = backendError?.message || 'Error al procesar el pago'
            window.location.href = `/payment/failed?reason=${encodeURIComponent(reason)}`
            return
        }

    } catch (e: any) {
        console.error("Error manual payment:", e)
        setError(e?.message || 'Fallo al procesar la solicitud. Revisa los datos.')
    } finally {
        if (!success) setLoading(false)
    }
  }


  return (
    <section 
      id="planes" 
      className={`py-12 relative w-full overflow-hidden ${selectedIndex !== null && !showCheckout ? 'cursor-pointer' : ''}`}
      onClick={selectedIndex !== null && !showCheckout ? handleClose : undefined}
    >
      {/* Fondo azul-verde con difuminado animado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #3cc1f3 0%, #00cc99 100%)",
            opacity: 0.15,
          }}
        />
        {/* Gradientes difuminados animados */}
        <div 
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(60, 193, 243, 0.4), transparent 50%), radial-gradient(circle at 70% 70%, rgba(0, 204, 153, 0.4), transparent 50%)",
            filter: "blur(60px)",
            animation: "panel-gradient-move 8s ease-in-out infinite",
          }}
        />
        <div 
          className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%]"
          style={{
            background: "radial-gradient(circle at 70% 30%, rgba(0, 204, 153, 0.3), transparent 50%), radial-gradient(circle at 30% 70%, rgba(60, 193, 243, 0.3), transparent 50%)",
            filter: "blur(60px)",
            animation: "panel-gradient-move-reverse 10s ease-in-out infinite",
          }}
        />
      </div>
      <Script src="https://sdk.mercadopago.com/js/v2" strategy="afterInteractive" onLoad={() => setSdkReady(true)} />
      
      {/* Backdrop blur cuando showCheckout está activo */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
        style={{ zIndex: showCheckout ? 50 : 10 }}
        onClick={selectedIndex !== null && !showCheckout ? (e) => e.stopPropagation() : undefined}
      >
        
        {/* Título con animación mejorado */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={titleAnimation}
          className={`text-center mb-8 md:mb-12 ${selectedIndex !== null && !showCheckout ? 'transition-opacity hover:opacity-80' : ''}`}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-[#00CED1] mb-4 uppercase tracking-wider"
            variants={titleAnimation}
          >
            Elige Tu Plan Perfecto
          </motion.h2>
          <motion.p
            className="text-teal-200 text-lg md:text-xl max-w-2xl mx-auto px-4"
            variants={titleAnimation}
          >
            Páginas web desarrolladas con <strong className="text-teal-400">React</strong>, 
            <strong className="text-teal-400"> alojadas en nuestros servidores</strong> y con 
            <strong className="text-teal-400"> soporte incluido de 8 AM a 11 PM</strong>
          </motion.p>
        </motion.div>

        {/* AnimatePresence gestiona el cambio entre la cuadrícula y la vista de detalle */}
        <AnimatePresence mode="wait">
          
          {/* ================================== */}
          {/* VISTA 1: GRILLA DE PLANES         */}
          {/* ================================== */}
          {selectedIndex === null && (
            <motion.div
              key="grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {ordered.map((plan, i) => (
                <PlanCard 
                  key={plan.id}
                  plan={plan} 
                  onClick={() => handleSelect(i)} 
                />
              ))}
            </motion.div>
          )}

          {/* ================================== */}
          {/* VISTA 2: PLAN SELECCIONADO (NUEVA) */}
          {/* ================================== */}
          {selectedIndex !== null && (
            <motion.div
              key={`expanded-${selectedIndex}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full relative flex flex-col md:flex-row items-center justify-center gap-8 mt-12"
            >
              {/* Columna Izquierda: Tarjeta con efecto tilt continuo */}
              <motion.div 
                className="w-full max-w-sm flex-shrink-0"
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <PlanCard 
                  plan={ordered[selectedIndex]} 
                  onClick={() => {}}
                  isStatic={true}
                  keepTiltEffect={true}
                  onContract={() => { setShowCheckout(true); setCheckoutOpen(true) }}
                />
              </motion.div>

              {/* Columna Derecha: Imagen */}
              {!showCheckout && (
              <motion.div 
                className="w-full md:w-1/2 relative"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const s = ordered[selectedIndex].enlace_imagen || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFNbSjKa1rI8nojhMTjAgdqpDnVaThocgIIA&s"
                  return s.startsWith("http")
                    ? (
                      <img
                        src={s}
                        alt="Vista previa del plan"
                        className="rounded-l-3xl object-cover w-full h-[450px]"
                      />
                    ) : (
                      <Image
                        src={s}
                        alt="Vista previa del plan"
                        width={600}
                        height={450}
                        className="rounded-l-3xl object-cover w-full h-[450px]"
                      />
                    )
                })()}
              </motion.div>
              )}

              {/* Checkout Suscripción */}
              {showCheckout && (
              <motion.div
                className="w-full md:w-1/2 bg-[#1E1E1E]/60 backdrop-blur-md border-2 border-[#00CED1]/50 rounded-2xl p-6 relative"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                style={{ zIndex: 51 }}
              >
                <h4 className="text-white text-xl font-bold mb-4">Contratar suscripción</h4>
                {!publicKey && (
                  <p className="text-red-400 mb-3">Configura NEXT_PUBLIC_MP_PUBLIC_KEY en el entorno para tokenizar la tarjeta.</p>
                )}
                {error && <p className="text-red-400 mb-3">{error}</p>}
                {success && <p className="text-green-400 mb-3">{success}</p>}
                <form id="subscription-card-form" ref={formRef} className="space-y-4" onSubmit={handleManualPayment}>
                  {/* Nombre y Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 ml-1">Titular de la tarjeta</label>
                      <input 
                        id="form-cardholder-name" 
                        placeholder="Como aparece en la tarjeta" 
                        className="w-full p-3 rounded bg-[#2D2D2D] text-white border border-transparent focus:border-[#00CED1] outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 ml-1">Email</label>
                      <input 
                        id="form-cardholder-email" 
                        placeholder="Email" 
                        className="w-full p-3 rounded bg-[#2D2D2D] text-white/70 border border-transparent outline-none cursor-not-allowed"
                        defaultValue={user?.email || ''}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Número de Tarjeta */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 ml-1">Número de tarjeta</label>
                    <div className="relative">
                      <input 
                        id="form-card-number" 
                        ref={cardNumRef}
                        placeholder="0000 0000 0000 0000" 
                        className="w-full p-3 rounded bg-[#2D2D2D] text-white border border-transparent focus:border-[#00CED1] outline-none transition-colors pr-28"
                        maxLength={19}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '')
                          // Detectar tipo
                          setCardType(detectCardType(val))
                          // Formato visual
                          val = val.replace(/(\d{4})/g, '$1 ').trim()
                          e.target.value = val
                          
                          // Auto-focus: si tiene 16 dígitos (19 caracteres con espacios)
                          if (val.length >= 19) {
                            expMonthRef.current?.focus()
                          }
                        }}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                        {CardIcons.visa(cardType === 'visa')}
                        {CardIcons.mastercard(cardType === 'mastercard')}
                        {CardIcons.amex(cardType === 'amex')}
                      </div>
                    </div>
                  </div>

                  {/* Fecha y CVV en una fila */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 ml-1">Vencimiento</label>
                      <div className="flex gap-2">
                        <input 
                          id="form-card-exp-month" 
                          ref={expMonthRef}
                          placeholder="MM" 
                          className="w-full p-3 rounded bg-[#2D2D2D] text-center text-white border border-transparent focus:border-[#00CED1] outline-none transition-colors"
                          maxLength={2}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '')
                            e.target.value = val
                            if (val.length >= 2) expYearRef.current?.focus()
                          }}
                        />
                        <span className="text-white/50 py-3">/</span>
                        <input 
                          id="form-card-exp-year" 
                          ref={expYearRef}
                          placeholder="AA" 
                          className="w-full p-3 rounded bg-[#2D2D2D] text-center text-white border border-transparent focus:border-[#00CED1] outline-none transition-colors"
                          maxLength={2}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '')
                            e.target.value = val
                            if (val.length >= 2) cvvRef.current?.focus()
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 ml-1">CVV / CVC</label>
                      <input 
                        id="form-security-code" 
                        ref={cvvRef}
                        placeholder="123" 
                        className="w-full p-3 rounded bg-[#2D2D2D] text-white border border-transparent focus:border-[#00CED1] outline-none transition-colors"
                        maxLength={4}
                        type="password"
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '')
                          e.target.value = val
                          // Si es Amex son 4 dígitos, otros son 3. 
                          // Auto-focus opcional al documento si completa 3 o 4
                          if (val.length >= (cardType === 'amex' ? 4 : 3)) {
                             // Opcional: docRef.current?.focus()
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Documento (Simplificado/Oculto si es posible, pero requerido por MP) */}
                  {/* Lo mantenemos visualmente discreto pero accesible */}
                  <div className="grid grid-cols-3 gap-3 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="col-span-1 space-y-1">
                      <label className="text-[10px] text-gray-500 ml-1">Tipo Doc</label>
                      <select 
                        id="form-doc-type" 
                        className="w-full p-3 rounded bg-[#2D2D2D] text-white border border-transparent text-sm outline-none"
                      >
                         <option value="RUT">RUT</option>
                         <option value="CI">CI</option>
                         <option value="DNI">DNI</option>
                         <option value="PASAPORTE">Pasaporte</option>
                         <option value="CC">CC</option>
                      </select>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] text-gray-500 ml-1">Número Documento</label>
                      <input 
                        id="form-doc-number" 
                        placeholder="Ej: 12345678-9" 
                        className="w-full p-3 rounded bg-[#2D2D2D] text-white border border-transparent outline-none text-sm"
                        onBlur={(e) => {
                          e.target.value = formatRUT(e.target.value)
                        }}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading || !publicKey} className="mt-6 w-full bg-[#00CED1] text-[#1E1E1E] font-bold text-lg rounded-full py-3 hover:bg-[#00b8bb] transition-all disabled:opacity-50 shadow-lg shadow-[#00CED1]/20">
                    {loading ? 'Procesando pago...' : 'Confirmar suscripción'}
                  </button>
                </form>
              </motion.div>
              )}

              {/* Botón Siguiente (Flecha) - Solo visible cuando NO está el checkout - Mejorado para mobile */}
              {!showCheckout && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                  className="absolute -right-2 md:right-0 lg:right-4 text-4xl md:text-6xl text-[#00CED1] hover:text-white transition-colors z-10 p-2 md:p-0"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Siguiente plan"
                >
                  →
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// Load Mercado Pago SDK
export const dynamic = 'force-dynamic'
