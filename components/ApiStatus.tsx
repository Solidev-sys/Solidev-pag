"use client"
import { FC } from "react"

type Props = {
  message?: string | null
  error?: string | null
}

export const ApiStatus: FC<Props> = ({ message, error }) => {
  return (
    <div className="p-4 mb-6 rounded-md border bg-white">
      <p className="text-sm">
        {error
          ? <span className="text-red-600">Error de API: {error}</span>
          : message
            ? <span className="text-green-600">API conectada: {message}</span>
            : <span className="text-gray-600">Verificando conexión con la API…</span>}
      </p>
    </div>
  )
}