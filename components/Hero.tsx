import { Button } from "@/components/ui/button"
import Image from "next/image"
import HeroI from "./images/hero.jpg"

type HeroProps = {
  onShowPlans?: () => void
  showPlans?: boolean
}

export function Hero({ onShowPlans, showPlans = false }: HeroProps) {
  return (
    <header className="text-white min-h-screen flex items-center relative overflow-hidden">
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
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-20 py-8 sm:py-12 md:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center">
          
          {/* Columna Izquierda - Texto */}
          <div className="space-y-5 sm:space-y-6 lg:space-y-8">
            {/* Título Principal */}
            <h1 className="text-white leading-[1.1]">
              <span className="block text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] font-bold tracking-tight uppercase">
                DESARROLLAMOS LA
              </span>
              <span className="block text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] font-bold tracking-tight">
                WEB DE{" "}
                <span 
                  className="inline-block bg-clip-text text-transparent uppercase animated-gradient"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #02CC9C 0%, #3AC1F0 100%)',
                    fontWeight: 700,
                  }}
                >
                  TUS SUEÑOS
                </span>
              </span>
            </h1>

            {/* Subtítulo con neuroventas */}
            <p className="text-[16px] md:text-[18px] lg:text-[20px] text-gray-300 leading-relaxed max-w-[520px]">
              Transformamos tu negocio en una <span className="text-teal-400 font-semibold">máquina de ventas digital</span>. Páginas web desarrolladas con React, alojadas en nuestros servidores y diseñadas para convertir visitantes en clientes.
            </p>

            {/* Lista de características mejorada con neuroventas */}
            <ul className="space-y-3 text-[15px] md:text-[17px] text-gray-300">
              <li className="flex items-center gap-3 group">
                <span className="w-2 h-2 bg-[#02CC9C] rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"></span>
                <span><strong className="text-teal-400">Soporte 24/7:</strong> Estamos contigo de 8 AM a 11 PM, todos los días</span>
              </li>
              <li className="flex items-center gap-3 group">
                <span className="w-2 h-2 bg-[#02CC9C] rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"></span>
                <span><strong className="text-teal-400">Alojamiento incluido:</strong> Tu página web ya alojada en nuestros servidores</span>
              </li>
              <li className="flex items-center gap-3 group">
                <span className="w-2 h-2 bg-[#02CC9C] rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"></span>
                <span><strong className="text-teal-400">Tecnología de punta:</strong> Desarrollado con React para máxima velocidad</span>
              </li>
              <li className="flex items-center gap-3 group">
                <span className="w-2 h-2 bg-[#02CC9C] rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"></span>
                <span><strong className="text-teal-400">Sin complicaciones:</strong> Nos encargamos de todo, tú solo disfrutas los resultados</span>
              </li>
            </ul>

            {/* Botones CTA mejorados con neuroventas */}
            <div className="pt-4 lg:pt-6 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  if (onShowPlans) {
                    onShowPlans()
                    if (!showPlans) {
                      setTimeout(() => {
                        const planesSection = document.getElementById('planes')
                        if (planesSection) {
                          planesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      }, 100)
                    }
                  }
                }}
                className="text-white font-bold py-4 lg:py-6 px-8 lg:px-12 text-[16px] lg:text-[18px] rounded-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] active:scale-[0.98] animated-gradient"
                style={{
                  background: 'linear-gradient(90deg, #02CC9C 0%, #3AC1F0 100%)',
                }}
              >
                {showPlans ? 'Ocultar Planes' : '🚀 Comenzar Ahora - Ver Planes'}
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  const contactoSection = document.getElementById('contacto') || document.querySelector('a[href="/contacto"]')
                  if (contactoSection) {
                    if (contactoSection instanceof HTMLElement) {
                      contactoSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    } else {
                      window.location.href = '/contacto'
                    }
                  } else {
                    window.location.href = '/contacto'
                  }
                }}
                className="text-teal-400 font-semibold py-4 lg:py-6 px-8 lg:px-12 text-[16px] lg:text-[18px] rounded-full border-2 border-teal-400/50 bg-transparent hover:bg-teal-400/10 hover:border-teal-400 transition-all duration-300 hover:scale-[1.05] active:scale-[0.98]"
              >
                💬 Hablar con un Experto
              </Button>
            </div>
            
            {/* Badge de confianza móvil */}
            <div className="pt-4 flex items-center gap-3 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <span className="text-teal-400">✓</span>
                <span>Sin compromiso</span>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center gap-1">
                <span className="text-teal-400">✓</span>
                <span>Respuesta en minutos</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Imagen */}
          <div className="relative order-first lg:order-last">
            <div className="relative w-full aspect-[4/3] lg:aspect-[5/4] rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
              {/* Imagen de fondo */}
              <Image 
                src={HeroI}
                alt="Security - Desarrollo web seguro"
                className="absolute inset-0 w-full h-full object-cover"
                priority
              />
              
              {/* Overlay oscuro para mejorar legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/60"></div>
              
              {/* Badge móvil sobre la imagen */}
              <div className="absolute top-4 left-4 right-4 lg:hidden">
                <div className="bg-teal-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full inline-block">
                  ⚡ Desarrollo con React • 🚀 Alojado • 💬 Soporte 8AM-11PM
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}