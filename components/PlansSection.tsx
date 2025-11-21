"use client"

import { FC, useEffect, useRef, useState } from "react"
import type { BackendPlan } from "@/types/indexNew"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Script from "next/script"
import { apiService } from "@/lib/api"

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
      duration: 0.8, // 👈 Cambia este valor (0.5 = rápido, 1.2 = muy lento)
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
}

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // 👈 Delay entre cada tarjeta (0.2 = rápido, 0.5 = lento)
      delayChildren: 0.2 // 👈 Delay antes de empezar (0.1 = rápido, 0.4 = lento)
    }
  }
}

const titleAnimation = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.7, // 👈 Duración del título
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
}

const PlanCard: FC<PlanCardProps> = ({ plan, onClick, isStatic = false, onContract }) => {
  const disabled = !plan.activo
  const precioFormateado = formatMoneyFromCentavos(plan.precio_centavos, plan.moneda)
  const esAnual = plan.ciclo_fact === "anual"

  const finalOnClick = isStatic || disabled ? () => {} : onClick
  const finalCursor = isStatic || disabled ? "default" : "cursor-pointer"

  return (
    <motion.div
      layout={!isStatic} // Solo aplicar layout cuando no es estático
      variants={isStatic ? undefined : fadeInUpCard} // Solo aplicar variantes cuando no es estático
      onClick={finalOnClick}
      className={`
        w-full h-full bg-[#1E1E1E] border-2 border-[#00CED1] rounded-[18px] p-8
        shadow-[0_4px_20px_rgba(0,206,209,0.15)]
        ${finalCursor}
        ${disabled ? "opacity-60" : ""}
      `}
      whileHover={!isStatic && !disabled ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
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
  )
}


// ===========================================
// COMPONENTE PRINCIPAL: PlansSection
// ===========================================
export const PlansSection: FC<Props> = ({ plans }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const mpReadyRef = useRef(false)
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || ""
  const [sdkReady, setSdkReady] = useState(false)

  if (!plans || plans.length === 0) return null

  const ordered = [...plans].sort(
    (a, b) => (a.precio_centavos ?? 0) - (b.precio_centavos ?? 0)
  )

  const handleSelect = (index: number) => setSelectedIndex(index)
  const handleNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex + 1) % ordered.length)
  }
  const handleClose = () => setSelectedIndex(null)

  useEffect(() => {
    setCheckoutOpen(false)
    setShowCheckout(false)
    setError(null)
    setSuccess(null)
  }, [selectedIndex])

  useEffect(() => {
    if (checkoutOpen) {
      if (!publicKey) { setError('Falta NEXT_PUBLIC_MP_PUBLIC_KEY para inicializar Mercado Pago'); return }
      if (!sdkReady) { setError('SDK de Mercado Pago aún no está listo'); return }
      if (!(window as any).MercadoPago) { setError('SDK de Mercado Pago no cargado'); return }
      if (!formRef.current) { setError('Formulario de tarjeta no disponible'); return }
      if (selectedIndex === null) { setError('Ningún plan seleccionado'); return }
    }
    if (checkoutOpen && sdkReady && (window as any).MercadoPago && formRef.current && selectedIndex !== null) {
      try {
        const mp = new (window as any).MercadoPago(publicKey, { locale: 'es-CL' })
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
            onSubmit: async (event: any) => {
              event.preventDefault()
              if (selectedIndex === null) return
              setLoading(true)
              setError(null)
              try {
                const formData = (mp as any).cardForm.getCardFormData()
                const tokenResult = await (mp as any).cardForm.createCardToken()
                const token = tokenResult?.token || formData?.token
                if (!token) throw new Error('No se pudo generar el token de tarjeta')

                const plan = ordered[selectedIndex]
                // 1) Crear suscripción en backend
                const suscripcion = await apiService.createSubscription(plan.id)
                // 2) Iniciar suscripción con plan asociado y card token
                const start = await apiService.startSubscription(suscripcion.id, token)
                // 3) Confirmar suscripción en backend (actualiza estado y próximas fechas)
                await apiService.confirmSubscription(start.preapproval_id)
                setSuccess('Suscripción creada y autorizada correctamente')
                setCheckoutOpen(false)
              } catch (e: any) {
                setError(e?.message || 'Fallo al procesar la suscripción')
              } finally {
                setLoading(false)
              }
            }
          }
        })
      } catch (e) {
        setError('No se pudo inicializar Mercado Pago')
      }
    }
  }, [checkoutOpen, sdkReady, publicKey, selectedIndex, ordered])

  return (
    <section 
      id="planes" 
      className={`py-12 relative w-full overflow-hidden ${selectedIndex !== null ? 'cursor-pointer' : ''}`}
      style={{ backgroundColor: "#2D2D2D" }}
      onClick={selectedIndex !== null ? handleClose : undefined}
    >
      <Script src="https://sdk.mercadopago.com/js/v2" strategy="afterInteractive" onLoad={() => setSdkReady(true)} />
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        onClick={selectedIndex !== null ? (e) => e.stopPropagation() : undefined}
      >
        
        {/* Título con animación */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }} // 👈 Animación reversible según scroll
          variants={titleAnimation}
          className={`
            text-center text-3xl md:text-4xl font-bold text-[#00CED1] mb-12 uppercase tracking-wider
            ${selectedIndex !== null ? 'transition-opacity hover:opacity-80' : ''}
          `}
        >
          NUESTROS PLANES
        </motion.h2>

        {/* AnimatePresence gestiona el cambio entre la cuadrícula y la vista de detalle aqui*/}
        <AnimatePresence mode="wait">
          
          {/* ================================== */}
          {/* VISTA 1: GRILLA DE PLANES         */}
          {/* ================================== */}
          {selectedIndex === null && (
            <motion.div
              key="grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }} // 👈 Animación reversible según scroll
              variants={staggerContainer} // 👈 Aplica el efecto stagger (1 por 1)
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
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
              {/* Columna Izquierda: Tarjeta estática */}
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
                  const s = ordered[selectedIndex].enlace_imagen || "/images/premium_photo-1664474834472-6c7d1e3198e2.jpeg"
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
                className="w-full md:w-1/2 bg-[#1E1E1E] border-2 border-[#00CED1] rounded-2xl p-6"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="text-white text-xl font-bold mb-4">Contratar suscripción</h4>
                {!publicKey && (
                  <p className="text-red-400 mb-3">Configura NEXT_PUBLIC_MP_PUBLIC_KEY en el entorno para tokenizar la tarjeta.</p>
                )}
                {error && <p className="text-red-400 mb-3">{error}</p>}
                {success && <p className="text-green-400 mb-3">{success}</p>}
                <form id="subscription-card-form" ref={formRef} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input id="form-cardholder-name" placeholder="Nombre del titular" className="p-3 rounded bg-[#2D2D2D] text-white" />
                    <input id="form-cardholder-email" placeholder="Email" className="p-3 rounded bg-[#2D2D2D] text-white" />
                  </div>
                  <input id="form-card-number" placeholder="Número de tarjeta" className="p-3 rounded bg-[#2D2D2D] text-white w-full" />
                  <div className="grid grid-cols-3 gap-3">
                    <input id="form-security-code" placeholder="CVV" className="p-3 rounded bg-[#2D2D2D] text-white" />
                    <input id="form-doc-type" placeholder="Tipo doc (ej: RUT)" className="p-3 rounded bg-[#2D2D2D] text-white" />
                    <input id="form-doc-number" placeholder="N° documento" className="p-3 rounded bg-[#2D2D2D] text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input id="form-card-exp-month" placeholder="MM" className="p-3 rounded bg-[#2D2D2D] text-white" />
                    <input id="form-card-exp-year" placeholder="YYYY" className="p-3 rounded bg-[#2D2D2D] text-white" />
                  </div>
                  <button type="submit" disabled={loading || !publicKey} className="mt-4 w-full bg-[#00CED1] text-[#1E1E1E] font-semibold rounded-full py-3 disabled:opacity-50">
                    {loading ? 'Procesando…' : 'Confirmar y pagar'}
                  </button>
                </form>
              </motion.div>
              )}

              {/* Botón Siguiente (Flecha) */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute -right-4 md:right-0 lg:right-4 text-6xl text-[#00CED1] hover:text-white transition-colors z-10"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
              >
                →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// Load Mercado Pago SDK
export const dynamic = 'force-dynamic'