// src/components/layout/Header.tsx
"use client"

import Link from "next/link";
import Image from "next/image"; // 1. IMPORTAR Image
import { User, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import logoSVG from "../images/SVG.svg"; // Importar la imagen como módulo 

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  
  // Ocultar el Header en la página de login
  if (pathname === "/login") {
    return null;
  }
  return (
    <header className="w-full bg-neutral-900 border-b border-teal-500/20 sticky top-0 z-50">
      <nav className="w-full mx-auto px-8 md:px-12 h-20 flex items-center justify-between">
        {/* Logo y texto Solidev */}
        <Link href="/" className="flex items-end gap-2 group">
          <Image 
            src={logoSVG}
            alt="Logo de Solidev"
            width={40}
            height={40}
            className="transition-opacity duration-300 group-hover:opacity-80"
          />
          <span className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent transition-all duration-300 group-hover:opacity-80 leading-none">
            Solidev
          </span>
        </Link>
        {/* 2. Navegación (Derecha) */}
        <div className="flex items-center gap-6">
          
          {/* Links de Navegación (Ocultos en móvil) */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="relative text-neutral-200 hover:text-teal-300 transition-colors font-medium text-lg py-2 px-1 group"
            >
              Inicio
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-center rounded-sm"></span>
            </Link>
            {/*<Link 
              href="/portafolio" 
              className="relative text-neutral-200 hover:text-teal-300 transition-colors font-medium text-lg py-2 px-1 group"
            >
              Portafolio
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-center rounded-sm"></span>
            </Link>*/}
            <Link 
              href="/nosotros" 
              className="relative text-neutral-200 hover:text-teal-300 transition-colors font-medium text-lg py-2 px-1 group"
            >
              Nosotros
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-center rounded-sm"></span>
            </Link>
            <Link 
              href="/contacto" 
              className="relative text-neutral-200 hover:text-teal-300 transition-colors font-medium text-lg py-2 px-1 group"
            >
              Contacto
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-center rounded-sm"></span>
            </Link>
          </div>
          
          {/* Icono de Usuario (Login) con animación de desplazamiento y nombre */}
          <div className="relative group flex items-center">
            <Link 
              href="/login"
              className="text-teal-400 hover:text-teal-300 transition-colors"
              title={isAuthenticated ? (user?.name || user?.username || 'Mi cuenta') : 'Iniciar sesión'}
            >
              <User className="w-7 h-7" />
            </Link>
            <span 
              className="absolute left-full ml-2 px-2 py-0.5 rounded text-sm whitespace-nowrap bg-neutral-800 border border-teal-500/40 text-teal-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
            >
              {isAuthenticated ? (user?.name || user?.username) : 'Iniciar sesión'}
            </span>
          </div>

          {/* Botón de Menú Móvil (Visible solo en móvil) */}
          <button 
            className="md:hidden text-teal-400 hover:text-teal-300 transition-colors"
            title="Abrir menú"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>

      </nav>
    </header>
  );
}
