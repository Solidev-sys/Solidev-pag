"use client"

import Link from "next/link"

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl font-bold">SoliDev</div>
          
          {/* Center Navigation */}
          <div className="flex space-x-6">
            <Link href="/contacto" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contactanos
            </Link>
            <Link href="/personal" className="text-gray-700 hover:text-blue-600 transition-colors">
              Personal
            </Link>
          </div>
          
          {/* Login Button */}
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            Iniciar sesión
          </Link>
        </div>
      </nav>
    </div>
  )
}
