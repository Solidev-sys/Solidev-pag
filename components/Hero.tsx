import { Button } from "@/components/ui/button"

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
              {/* Fondo oscuro base */}
              <div className="absolute inset-0 bg-[#1a1a1a]"></div>
              
              {/* Patrón de puntos/grid sutil */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              ></div>

              {/* Contenido centrado - Security */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 lg:gap-8">
                {/* Icono de candado superior */}
                <svg className="w-12 h-12 lg:w-16 lg:h-16 text-[#02CC9C]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                
                {/* Texto "Security" */}
                <p 
                  className="text-[48px] md:text-[56px] lg:text-[72px] font-light tracking-[0.2em] text-center"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #02CC9C 0%, #3AC1F0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Security
                </p>
                
                {/* Icono de mano/cursor */}
                <svg className="w-10 h-10 lg:w-14 lg:h-14 text-[#3AC1F0]/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 11V8.99c0-.88-.59-1.64-1.4-1.86v-.67c0-1.1-.9-2-2-2s-2 .9-2 2v.67c-.81.22-1.4.98-1.4 1.86V11c0 1.1.9 2 2 2h2.6c1.1 0 2-.9 2-2zm8.5-1c.83 0 1.5-.67 1.5-1.5v-1c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v1c0 .83.67 1.5 1.5 1.5zm-2.5 6.5V14c0-1.1-.9-2-2-2h-1v1.5c0 1.1-.9 2-2 2H9v4.39c0 .6.4 1.11.98 1.12.34.01.62.28.62.62 0 .34.28.62.62.62h4.76c.34 0 .62-.28.62-.62v-.01c0-.34.28-.62.62-.62.58-.01.98-.52.98-1.12V16.5z"/>
                </svg>
              </div>

              {/* Efecto de brillo/glow sutil */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(2, 204, 156, 0.15) 0%, transparent 70%)'
                }}
              ></div>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}