"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, X, Menu } from "lucide-react"
import { CartSidebar } from "./CartSidebar"
import { UserDropdown } from "./UserDropdown"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/hooks/useAuth"

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartCountAnimation, setCartCountAnimation] = useState(false)
  const { items, getTotalItems, loadCart } = useCart()
  const { user, isAuthenticated } = useAuth()

  const totalItems = getTotalItems()

  // Animate cart count when it changes
  useEffect(() => {
    if (totalItems > 0) {
      setCartCountAnimation(true)
      const timer = setTimeout(() => setCartCountAnimation(false), 600)
      return () => clearTimeout(timer)
    }
  }, [totalItems])

  // Handle cart opening - refresh cart data
  const handleCartOpen = async () => {
    setIsCartOpen(true)
    // Refresh cart data when opening
    if (isAuthenticated) {
      try {
        await loadCart()
      } catch (error) {
        console.error('Error refreshing cart:', error)
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(".user-dropdown") && !target.closest("#user-btn")) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <>
      <header 
        className="text-white p-4 sticky top-0 z-50"
        style={{ 
          background: 'linear-gradient(to right, #222222, #000000)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.10)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/images/ElDespertarLogo.png"
                  alt="Logo el despertar"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <Image
                  src="/images/Fungi.png"
                  alt="El Despertar - Fungi"
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white p-2"
                style={{ 
                  '--tw-bg-opacity': '0',
                  backgroundColor: 'transparent'
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>

            {/* Navigation */}
            <nav
              className={`${isMobileMenuOpen ? "flex" : "hidden"} lg:flex flex-col lg:flex-row gap-4 lg:gap-8 pt-4 lg:pt-0`}
              style={{
                borderTop: isMobileMenuOpen ? '1px solid rgba(255, 255, 255, 0.20)' : 'none'
              }}
            >
              <Link
                href="/"
                className="nav-link text-white transition-colors font-medium py-2 lg:py-0"
                style={{
                  borderBottom: '2px solid rgba(255, 255, 255, 0.10)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ccfbf1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#FFFFFF'
                }}
              >
                Inicio
              </Link>
              <Link
                href="/portafolio"
                className="nav-link text-white transition-colors font-medium py-2 lg:py-0"
                style={{
                  borderBottom: '2px solid rgba(255, 255, 255, 0.10)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ccfbf1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#FFFFFF'
                }}
              >
                Portafolio
              </Link>
              <Link
                href="/personal"
                className="nav-link text-white transition-colors font-medium py-2 lg:py-0"
                style={{
                  borderBottom: '2px solid rgba(255, 255, 255, 0.10)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ccfbf1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#FFFFFF'
                }}
              >
                Nosotros
              </Link>
              <Link
                href="/contacto"
                className="nav-link text-white transition-colors font-medium py-2 lg:py-0"
                style={{
                  borderBottom: '2px solid rgba(255, 255, 255, 0.10)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ccfbf1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#FFFFFF'
                }}
              >
                Contacto
              </Link>
            </nav>

            {/* User Actions */}
            <div className={`${isMobileMenuOpen ? "flex" : "hidden"} lg:flex items-center gap-4`}>
              {/* User Button */}
              <div className="relative">
                <Button
                  id="user-btn"
                  variant="ghost"
                  size="sm"
                  className="text-white p-2"
                  style={{ 
                    '--tw-bg-opacity': '0',
                    backgroundColor: 'transparent'
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <User size={20} />
                </Button>

                <UserDropdown
                  isOpen={isUserDropdownOpen}
                  onClose={() => setIsUserDropdownOpen(false)}
                  user={user}
                  isAuthenticated={isAuthenticated}
                />
              </div>

              {/* Cart Button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white p-2 relative"
                style={{ 
                  '--tw-bg-opacity': '0',
                  backgroundColor: 'transparent'
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                onClick={handleCartOpen}
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span 
                    className={`cart-count absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold transition-all duration-300 ${
                      cartCountAnimation ? 'scale-125' : 'scale-100'
                    }`}
                    style={{
                      backgroundColor: '#2d2323',
                      border: '1px solid #6e7a79'
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Overlays */}
      {isCartOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsCartOpen(false)} />}
    </>
  )
}
