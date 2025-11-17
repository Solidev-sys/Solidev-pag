import { Instagram, Linkedin, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Icono TikTok en SVG (blanco) para usar dentro de los círculos
function TikTokIcon({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M16.5 6.5c1.2 1.1 2.7 1.8 4.3 2v3.1c-1.8-.2-3.5-.9-5-2v6.3c0 3.3-2.7 6-6 6s-6-2.7-6-6c0-3.3 2.7-6 6-6 .2 0 .4 0 .6.1v3.2c-.2-.1-.4-.1-.6-.1-1.5 0-2.7 1.2-2.7 2.7S7.3 18.5 8.8 18.5 11.5 17.3 11.5 15.8V3h3.1c.3 1.4 1 2.7 1.9 3.5Z"/>
    </svg>
  )
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-teal-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-teal-300 tracking-wide text-center">CONTÁCTANOS</h1>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Formulario */}
          <form className="rounded-xl p-6 border-2 border-teal-400/60 bg-neutral-900/70 shadow-lg">
            <label className="block text-teal-200 mb-2">Nombre</label>
            <input
              type="text"
              className="w-full mb-4 px-4 py-2 rounded-md bg-neutral-900 text-teal-100 placeholder-teal-300 border-2 border-teal-400 focus:outline-none focus:border-teal-300"
              placeholder="Tu nombre"
            />

            <label className="block text-teal-200 mb-2">Correo</label>
            <input
              type="email"
              className="w-full mb-4 px-4 py-2 rounded-md bg-neutral-900 text-teal-100 placeholder-teal-300 border-2 border-teal-400 focus:outline-none focus:border-teal-300"
              placeholder="tucorreo@ejemplo.com"
            />

            <label className="block text-teal-200 mb-2">Teléfono</label>
            <input
              type="tel"
              className="w-full mb-4 px-4 py-2 rounded-md bg-neutral-900 text-teal-100 placeholder-teal-300 border-2 border-teal-400 focus:outline-none focus:border-teal-300"
              placeholder="+00 000 000 000"
            />

            <label className="block text-teal-200 mb-2">Mensaje</label>
            <textarea
              rows={5}
              className="w-full mb-6 px-4 py-2 rounded-md bg-neutral-900 text-teal-100 placeholder-teal-300 border-2 border-teal-400 focus:outline-none focus:border-teal-300"
              placeholder="Cuéntanos sobre tu proyecto"
            />

            <button
              type="submit"
              className="w-full px-5 py-2 rounded-md bg-teal-500 hover:bg-teal-600 text-white font-medium transition-colors"
            >
              Enviar
            </button>
          </form>

          {/* Iconos sociales */}
          <div className="grid grid-cols-2 gap-8 place-items-center">
            <a
              href="https://instagram.com/solidev_cl"
              target="_blank"
              rel="noopener noreferrer"
              className="w-44 h-44 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-xl"
            >
              <Instagram className="w-20 h-20 text-white" />
            </a>
            <a
              href="https://wa.me/+56976506320"
              target="_blank"
              rel="noopener noreferrer"
              className="w-44 h-44 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-xl"
            >
              <MessageCircle className="w-20 h-20 text-white" />
            </a>
            <a
              href="https://www.tiktok.com/@solidev_cl"
              target="_blank"
              rel="noopener noreferrer"
              className="w-44 h-44 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-xl"
            >
              <TikTokIcon className="w-20 h-20 text-white" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-44 h-44 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-xl"
            >
              <Linkedin className="w-20 h-20 text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}