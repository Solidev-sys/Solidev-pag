import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Header } from '@/components/layouts/Header' // 1. IMPORTADO EL HEADER DE SOLIDEV

// 2. METADATA ACTUALIZADA
export const metadata = {
  title: 'Solidev - Desarrollo Web',
  description: 'Desarrollamos la web de tus sueños',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      {/* 3. AÑADIDO EL FONDO GLOBAL AL BODY */}
      <body className="bg-neutral-900 text-teal-100">
        <ErrorBoundary>
          <div id="__next">
            
            <Header /> {/* 4. HEADER DE SOLIDEV AÑADIDO AQUÍ */}
            
            {children}
          
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}