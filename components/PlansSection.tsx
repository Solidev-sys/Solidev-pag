"use client"

import { FC, useState } from "react"
import type { BackendPlan } from "@/types/indexNew"
import { Button } from "@/components/ui/button" // (No se usa en la vista principal, pero sí en la modal antigua)
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

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
// SUB-COMPONENTE REUTILIZABLE: PlanCard
// ===========================================
type PlanCardProps = {
  plan: BackendPlan
  onClick: () => void
  isStatic?: boolean // Para deshabilitar clics y hovers en la vista de detalle
}

const PlanCard: FC<PlanCardProps> = ({ plan, onClick, isStatic = false }) => {
  const disabled = !plan.activo
  const precioFormateado = formatMoneyFromCentavos(plan.precio_centavos, plan.moneda)
  const esAnual = plan.ciclo_fact === "anual"

  const finalOnClick = isStatic || disabled ? () => {} : onClick
  const finalCursor = isStatic || disabled ? "default" : "cursor-pointer"

  return (
    // La prop "layout" aquí es la que hace la magia de la animación
    <motion.div
      layout
      onClick={finalOnClick}
      className={`
        w-full h-full bg-[#1E1E1E] border-2 border-[#00CED1] rounded-[18px] p-8
        shadow-[0_4px_20px_rgba(0,206,209,0.15)]
        ${finalCursor}
        ${disabled ? "opacity-60" : ""}
      `}
      whileHover={!isStatic && !disabled ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
    >
      {/* Título del plan */}
      <h3 
        className="font-bold text-white uppercase mb-8"
        style={{ fontSize: "clamp(24px, 5vw, 34px)" }}
      >
        {plan.nombre}
      </h3>

      {/* Precio */}
      <div className="mb-10">
        <span
          className="font-bold inline-block text-[#00CED1]"
          style={{ fontSize: "clamp(36px, 8vw, 52px)" }}
        >
          {precioFormateado}
        </span>
        {esAnual && (
          <span
            className="ml-2 align-middle font-normal text-[#00CED1]"
            style={{ fontSize: "clamp(14px, 3vw, 19px)" }}
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
          e.stopPropagation() // Evita que el clic en el botón active el onClick de la tarjeta
          if (!isStatic) finalOnClick()
          // Aquí puedes agregar la lógica de "Contratar"
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

  return (
    <section 
      id="planes" 
      className="py-12 relative w-full overflow-hidden" // Añadido overflow-hidden
      style={{ backgroundColor: "#2D2D2D" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título (ahora es un botón de cerrar) */}
        <h2 
          className={`
            text-center text-3xl md:text-4xl font-bold text-[#00CED1] mb-12 uppercase tracking-wider
            ${selectedIndex !== null ? 'cursor-pointer transition-opacity hover:opacity-80' : ''}
          `}
          onClick={selectedIndex !== null ? handleClose : undefined}
        >
          NUESTROS PLANES
        </h2>

        {/* AnimatePresence gestiona el cambio entre la cuadrícula y la vista de detalle */}
        <AnimatePresence mode="wait">
          
          {/* ================================== */}
          {/* VISTA 1: GRILLA DE PLANES         */}
          {/* ================================== */}
          {selectedIndex === null && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
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
              key="expanded"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full relative flex flex-col md:flex-row items-center justify-center gap-8 mt-12"
            >
              {/* Columna Izquierda: Tarjeta estática */}
              <div className="w-full max-w-sm flex-shrink-0">
                <PlanCard 
                  plan={ordered[selectedIndex]} 
                  onClick={() => {}} // No hace nada al hacer clic
                  isStatic={true} 
                />
              </div>

              {/* Columna Derecha: Imagen */}
              <motion.div 
                className="w-full md:w-1/2 relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                <Image
                  src="/images/premium_photo-1664474834472-6c7d1e3198e2.jpeg" 
                  alt="Vista previa del plan"
                  width={600}
                  height={450} 
                  className="rounded-l-3xl object-cover w-full h-[450px]"
                />
              </motion.div>

              {/* Botón Siguiente (Flecha) */}
              <motion.button
                onClick={handleNext}
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