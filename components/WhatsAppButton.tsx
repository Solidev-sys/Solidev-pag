"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+56934314352", "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={handleWhatsAppClick}
        className="bg-home-green-whatsapp hover:bg-home-green-btn text-home-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 border border-home-light"
        size="lg"
      >
        <MessageCircle size={24} />
        <span className="ml-2 hidden sm:inline">Contáctanos</span>
      </Button>
    </div>
  )
}
