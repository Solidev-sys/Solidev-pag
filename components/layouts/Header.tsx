// src/components/layout/Header.tsx
import Link from "next/link";
import Image from "next/image"; // 1. IMPORTAR Image
import { User, Menu } from "lucide-react";
import logoSVG from "../images/SVG.svg"; // Importar la imagen como módulo 

export function Header() {
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
              className="text-neutral-200 hover:text-teal-300 transition-colors font-medium text-lg"
            >
              Inicio
            </Link>
            <Link 
              href="/portafolio" 
              className="text-neutral-200 hover:text-teal-300 transition-colors font-medium text-lg"
            >
              Portafolio
            </Link>
            <Link 
              href="/personal" 
              className="text-neutral-200 hover:text-teal-300 transition-colors font-medium text-lg"
            >
              Nosotros
            </Link>
            <Link 
              href="/contacto" 
              className="text-neutral-200 hover:text-teal-300 transition-colors font-medium text-lg"
            >
              Contacto
            </Link>
          </div>
          
          {/* Icono de Usuario (Login) */}
          <Link 
            href="/login"
            className="text-teal-400 hover:text-teal-300 transition-colors"
            title="Iniciar sesión"
          >
            <User className="w-7 h-7" />
          </Link>

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