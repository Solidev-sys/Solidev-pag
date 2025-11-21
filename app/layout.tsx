import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Header } from '@/components/layouts/Header' // 1. IMPORTADO EL HEADER DE SOLIDEV
import { Raleway, Inter } from 'next/font/google'

// Configurar la fuente Raleway
const raleway = Raleway({
  weight: '700',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
})

// Configurar la fuente Inter para componentes modernos
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// 2. METADATA ACTUALIZADA
export const metadata = {
  title: 'Solidev - Desarrollo Web',
  description: 'Desarrollamos la web de tus sueños',
  // El icono se detecta automáticamente desde app/icon.ico en Next.js 13+
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${raleway.variable} ${inter.variable}`}>
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