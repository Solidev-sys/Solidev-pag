"use client"

import { FC, useMemo, useRef, useState } from "react"
import type { BackendPlan } from "@/types/indexNew"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { apiService } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

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

type Props = {
  plans: BackendPlan[]
}

const fadeInUpCard = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any },
  },
}

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
}

const titleAnimation = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any },
  },
}

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
  keepTiltEffect = false,
}) => {
  const disabled = !plan.activo
  const precioFormateado = formatMoneyFromCentavos(plan.precio_centavos, plan.moneda)
  const esAnual = plan.ciclo_fact === "anual"
  const trialDays = Math.max(0, Math.trunc(Number(plan.dias_prueba_gratis || 0)))
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || disabled) return
    if (!keepTiltEffect && isStatic) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    const maxTilt = 10
    const tiltX = (mouseY / (rect.height / 2)) * -maxTilt
    const tiltY = (mouseX / (rect.width / 2)) * maxTilt
    setTilt({ x: tiltX, y: tiltY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    if ((!isStatic || keepTiltEffect) && !disabled) setIsHovered(true)
  }

  const finalOnClick = isStatic || disabled ? () => {} : onClick
  const finalCursor = isStatic || disabled ? "default" : "cursor-pointer"

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
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
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
          z: isHovered && !disabled ? 50 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transformStyle: "preserve-3d",
          willChange: !disabled ? "transform" : "auto",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translateZ(0)",
          boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 206, 209, ${shadowIntensity}), 0 0 ${shadowBlur * 0.5}px rgba(0, 206, 209, ${shadowIntensity * 0.3})`,
        }}
      >
        <h3 className="font-bold text-white uppercase mb-8" style={{ fontSize: "clamp(24px, 5vw, 34px)" }}>
          {plan.nombre}
        </h3>

        {plan.resumen && (
          <p className="text-[#F5F5F5] mb-6" style={{ fontSize: "clamp(14px, 3vw, 16px)" }}>
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
          {trialDays > 0 && (
            <span className="text-xs px-3 py-1 rounded-full bg-[#02CC9C] text-[#1E1E1E]">{trialDays} días gratis</span>
          )}
        </div>

        <div className="mb-10">
          <span
            className="font-bold inline-block bg-clip-text text-transparent animated-gradient"
            style={{
              fontSize: "clamp(36px, 8vw, 52px)",
              backgroundImage: "linear-gradient(90deg, #02CC9C 0%, #3AC1F0 100%)",
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
                backgroundImage: "linear-gradient(90deg, #02CC9C 0%, #3AC1F0 100%)",
              }}
            >
              / ANUAL
            </span>
          )}
        </div>

        {plan.caracteristicas && plan.caracteristicas.length > 0 && (
          <ul
            className="mb-10 list-disc list-inside space-y-2 text-[#F5F5F5] leading-normal"
            style={{ fontSize: "clamp(15px, 3vw, 17px)" }}
          >
            {plan.caracteristicas
              .sort((a, b) => (a.posicion ?? 0) - (b.posicion ?? 0))
              .map((feat) => (
                <li key={feat.id}>{feat.etiqueta}</li>
              ))}
          </ul>
        )}

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
          style={{ fontSize: "clamp(20px, 4vw, 26px)", padding: "14px 40px" }}
        >
          Contratar
        </button>
      </motion.div>
    </div>
  )
}

export const PlansSectionRedirect: FC<Props> = ({ plans }) => {
  const { user } = useAuth()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const [redirectFallbackUrl, setRedirectFallbackUrl] = useState<string | null>(null)
  const redirectStartedRef = useRef(false)

  if (!plans || plans.length === 0) return null

  const ordered = useMemo(() => {
    return [...plans].sort((a, b) => (a.precio_centavos ?? 0) - (b.precio_centavos ?? 0))
  }, [plans])

  const handleSelect = (index: number) => {
    setSelectedIndex(index)
    setError(null)
    setShowCheckout(false)
  }

  const handleNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex + 1) % ordered.length)
    setError(null)
    setShowCheckout(false)
  }

  const handleClose = () => {
    setSelectedIndex(null)
    setShowCheckout(false)
    setError(null)
    setLoading(false)
    setRedirectUrl(null)
    setRedirectFallbackUrl(null)
    redirectStartedRef.current = false
  }

  const pickCheckoutUrl = (resp: { init_point: string | null; init_point_prod?: string | null; init_point_test?: string | null }) => {
    const isProd = process.env.NODE_ENV === "production"
    const candidate = isProd ? (resp.init_point_prod ?? resp.init_point) : (resp.init_point_test ?? resp.init_point)
    return candidate ?? resp.init_point
  }

  const isAllowedMpUrl = (urlStr: string) => {
    try {
      const url = new URL(urlStr)
      const host = url.hostname.toLowerCase()
      return (
        host.endsWith("mercadopago.com") ||
        host.endsWith("mercadopago.com.ar") ||
        host.endsWith("mercadopago.com.br") ||
        host.endsWith("mercadopago.com.mx") ||
        host.endsWith("mercadopago.com.co") ||
        host.endsWith("mercadopago.cl") ||
        host.endsWith("mercadopago.com.uy") ||
        host.endsWith("mercadopago.pe")
      )
    } catch {
      return false
    }
  }

  const tryRedirect = (url: string) => {
    setRedirectUrl(url)
    redirectStartedRef.current = true
    try {
      window.location.assign(url)
    } catch {
      return false
    }
    return true
  }

  const handleConfirm = async () => {
    if (selectedIndex === null) return
    setLoading(true)
    setError(null)
    setRedirectUrl(null)
    setRedirectFallbackUrl(null)
    try {
      const plan = ordered[selectedIndex]
      const suscripcion = await apiService.createSubscription(plan.id)
      const start = await apiService.startSubscriptionCheckout(suscripcion.id)
      const checkoutUrl = pickCheckoutUrl(start)
      if (checkoutUrl) {
        const isProd = process.env.NODE_ENV === "production"
        const alt = isProd ? (start?.init_point_test ?? null) : (start?.init_point_prod ?? null)
        if (alt && alt !== checkoutUrl) setRedirectFallbackUrl(alt)
        if (!isAllowedMpUrl(checkoutUrl)) {
          setError("URL de checkout inválida. Por seguridad no se realizará la redirección.")
          return
        }
        const ok = tryRedirect(checkoutUrl)
        if (!ok) {
          setError("No se pudo iniciar la redirección automáticamente. Usa el enlace manual.")
        }
        setTimeout(() => {
          if (document.visibilityState === "visible" && redirectStartedRef.current) {
            setError((prev) => prev || "La redirección está tardando. Si ves una pantalla en blanco, abre el enlace manual.")
          }
        }, 8000)
        return
      }
      if (start?.preapproval_id) {
        window.location.href = `/payment/pending?preapproval_id=${encodeURIComponent(start.preapproval_id)}`
        return
      }
      setError("No se pudo iniciar el checkout de suscripción.")
    } catch (e: any) {
      setError(e?.message || "Error al iniciar suscripción.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="planes"
      className={`py-12 relative w-full overflow-hidden ${selectedIndex !== null && !showCheckout ? "cursor-pointer" : ""}`}
      onClick={selectedIndex !== null && !showCheckout ? handleClose : undefined}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #3cc1f3 0%, #00cc99 100%)", opacity: 0.15 }}
        />
        <div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(60, 193, 243, 0.4), transparent 50%), radial-gradient(circle at 70% 70%, rgba(0, 204, 153, 0.4), transparent 50%)",
            filter: "blur(60px)",
            animation: "panel-gradient-move 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%]"
          style={{
            background:
              "radial-gradient(circle at 70% 30%, rgba(0, 204, 153, 0.3), transparent 50%), radial-gradient(circle at 30% 70%, rgba(60, 193, 243, 0.3), transparent 50%)",
            filter: "blur(60px)",
            animation: "panel-gradient-move-reverse 10s ease-in-out infinite",
          }}
        />
      </div>

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: showCheckout ? 50 : 10 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={titleAnimation}
          className="text-center mb-8 md:mb-12"
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-[#00CED1] mb-4 uppercase tracking-wider"
            variants={titleAnimation}
          >
            Elige Tu Plan Perfecto
          </motion.h2>
          <motion.p className="text-teal-200 text-lg md:text-xl max-w-2xl mx-auto px-4" variants={titleAnimation}>
            Páginas web desarrolladas con <strong className="text-teal-400">React</strong>,{" "}
            <strong className="text-teal-400"> alojadas en nuestros servidores</strong> y con{" "}
            <strong className="text-teal-400"> soporte incluido de 8 AM a 11 PM</strong>
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
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
                <PlanCard key={plan.id} plan={plan} onClick={() => handleSelect(i)} />
              ))}
            </motion.div>
          )}

          {selectedIndex !== null && (
            <motion.div
              key={`expanded-${selectedIndex}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full relative flex flex-col md:flex-row items-center justify-center gap-8 mt-12"
            >
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
                  onContract={() => setShowCheckout(true)}
                />
              </motion.div>

              {!showCheckout && (
                <motion.div
                  className="w-full md:w-1/2 relative"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const s =
                      ordered[selectedIndex].enlace_imagen ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFNbSjKa1rI8nojhMTjAgdqpDnVaThocgIIA&s"
                    return s.startsWith("http") ? (
                      <img src={s} alt="Vista previa del plan" className="rounded-l-3xl object-cover w-full h-[450px]" />
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
                  {error && <p className="text-red-400 mb-3">{error}</p>}
                  {redirectUrl && (
                    <div className="bg-black/30 rounded-xl p-4 border border-white/10 mb-3">
                      <div className="text-gray-300 text-xs mb-2">Enlace manual (si la redirección falla)</div>
                      <a
                        href={redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00CED1] underline break-all text-sm"
                      >
                        {redirectUrl}
                      </a>
                      {redirectFallbackUrl && (
                        <div className="mt-3">
                          <div className="text-gray-300 text-xs mb-2">Enlace alternativo</div>
                          <a
                            href={redirectFallbackUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00CED1] underline break-all text-sm"
                          >
                            {redirectFallbackUrl}
                          </a>
                        </div>
                      )}
                      <button
                        type="button"
                        className="mt-3 w-full bg-transparent border border-[#00CED1]/60 text-white rounded-full py-2 hover:bg-[#00CED1]/10 transition-all"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(redirectUrl)
                          } catch {}
                        }}
                      >
                        Copiar enlace
                      </button>
                    </div>
                  )}
                  <div className="space-y-3 text-sm text-gray-200">
                    <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                      <div className="text-gray-300 text-xs mb-1">Email</div>
                      <div className="text-white">{user?.email || "No disponible"}</div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                      <div className="text-gray-300 text-xs mb-1">Método de pago</div>
                      <div className="text-white">Serás redirigido a Mercado Pago para pagar con tarjeta.</div>
                    </div>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleConfirm}
                      className="mt-2 w-full bg-[#00CED1] text-[#1E1E1E] font-bold text-lg rounded-full py-3 hover:bg-[#00b8bb] transition-all disabled:opacity-50 shadow-lg shadow-[#00CED1]/20"
                    >
                      {loading ? "Redirigiendo..." : "Continuar a Mercado Pago"}
                    </button>
                  </div>
                </motion.div>
              )}

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
