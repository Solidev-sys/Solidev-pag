"use client"

import { FC } from "react"
import type { BackendPlan } from "@/types/indexNew"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Props = {
  plans: BackendPlan[]
}

function formatMoneyFromCentavos(value: number, currency: string) {
  const amount = (value ?? 0) / 100
  try {
    const isCLP = (currency || 'CLP').toUpperCase() === 'CLP'
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: currency || 'CLP',
      maximumFractionDigits: isCLP ? 0 : 2
    }).format(amount)
  } catch {
    return `$${Math.round(amount).toLocaleString('es-CL')}`
  }
}

export const PlansSection: FC<Props> = ({ plans }) => {
  if (!plans || plans.length === 0) return null

  const ordered = [...plans].sort((a, b) => (a.precio_centavos ?? 0) - (b.precio_centavos ?? 0))

  return (
    <section id="planes" className="py-12">
      <h2 className="text-2xl font-bold text-teal-300 mb-6">NUESTROS PLANES</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {ordered.map((plan) => {
          const disabled = !plan.activo
          return (
            <div
              key={plan.id}
              className={`rounded-lg border border-teal-500/40 bg-neutral-900 p-5 ${disabled ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-teal-200">{plan.nombre}</h3>
                <span className="text-xs text-teal-300">{plan.codigo}</span>
              </div>

              <p className="text-teal-300 mt-1">
                {formatMoneyFromCentavos(plan.precio_centavos, plan.moneda)}{" "}
                <span className="text-xs text-teal-200">
                  {plan.ciclo_fact === "anual" ? "anual" : "mensual"}
                </span>
              </p>

              {plan.resumen && (
                <p className="mt-2 text-sm text-teal-100">{plan.resumen}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {plan.mensaje_rapido && (
                  <Badge variant="secondary" className="bg-teal-700/60 text-white">Entrega rápida</Badge>
                )}
                {plan.mensaje_seguro && (
                  <Badge variant="secondary" className="bg-teal-700/60 text-white">Pago seguro</Badge>
                )}
                {plan.moneda && (
                  <Badge variant="outline" className="border-teal-500/40 text-teal-200">{plan.moneda}</Badge>
                )}
                {!plan.activo && (
                  <Badge variant="outline" className="border-red-500/40 text-red-300">No disponible</Badge>
                )}
              </div>

              {Array.isArray(plan.caracteristicas) && plan.caracteristicas.length > 0 && (
                <ul className="mt-3 text-sm text-teal-100 space-y-1">
                  {plan.caracteristicas
                    .sort((a, b) => (a.posicion ?? 0) - (b.posicion ?? 0))
                    .map((feat) => (
                      <li key={feat.id}>• {feat.etiqueta}</li>
                    ))}
                </ul>
              )}

              <div className="mt-4">
                <Button
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                  disabled={disabled}
                  aria-disabled={disabled}
                >
                  {disabled ? "No disponible" : "Contratar"}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}