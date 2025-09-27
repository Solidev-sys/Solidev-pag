import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const metadata = {
  title: 'El Despertar - Fungi',
  description: 'Tienda online de productos naturales',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <div id="__next">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}
