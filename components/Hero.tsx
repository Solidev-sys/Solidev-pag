import { Button } from "@/components/ui/button"
import Image from "next/image"
import HeroI from "./images/hero.jpg"

export function Hero() {
  return (
    <header className="bg-[#2A2A2A] text-white min-h-screen flex items-center">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-16 xl:px-20 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Columna Izquierda - Texto */}
          <div className="space-y-6 lg:space-y-8">
            {/* Título Principal */}
            <h1 className="text-white leading-[1.1]">
              <span className="block text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] font-bold tracking-tight uppercase">
                DESARROLLAMOS LA
              </span>
              <span className="block text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] font-bold tracking-tight">
                WEB DE{" "}
                <span 
                  className="inline-block bg-clip-text text-transparent uppercase"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #02CC9C 0%, #3AC1F0 100%)',
                    fontWeight: 700,
                  }}
                >
                  TUS SUEÑOS
                </span>
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-[16px] md:text-[18px] lg:text-[20px] text-gray-300 leading-relaxed max-w-[520px]">
              Páginas webs sólidas que se ajustan a tus ideas y a tu negocio.
            </p>

            {/* Lista de características */}
            <ul className="space-y-3 text-[16px] md:text-[18px] text-gray-300">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-[#02CC9C] rounded-full flex-shrink-0"></span>
                Precios claros
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-[#02CC9C] rounded-full flex-shrink-0"></span>
                Soporte
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-[#02CC9C] rounded-full flex-shrink-0"></span>
                Seguridad
              </li>
            </ul>

            {/* Botón CTA */}
            <div className="pt-2 lg:pt-4">
              <Button
                asChild
                className="text-white font-semibold py-5 lg:py-6 px-8 lg:px-10 text-[16px] lg:text-[18px] rounded-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(90deg, #02CC9C 0%, #3AC1F0 100%)',
                }}
              >
                <a href="#planes">Ver Planes</a>
              </Button>
            </div>
          </div>

          {/* Columna Derecha - Imagen */}
          <div className="relative">
            <div className="relative w-full aspect-[4/3] lg:aspect-[5/4] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
              {/* Imagen de fondo */}
              <Image 
                src={HeroI}
                alt="Security - Desarrollo web seguro"
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Overlay oscuro para mejorar legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/60"></div>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}