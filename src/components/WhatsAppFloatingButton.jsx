import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'

const WHATSAPP_NUMBER = String(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')

const WhatsAppFloatingButton = () => {
  const href = `https://wa.me/${WHATSAPP_NUMBER || '919717568740'}?text=${encodeURIComponent('Hi, I need help choosing the right Rudraksha.')}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp for product help"
      className="fixed bottom-5 right-4 z-120 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-all duration-300 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
    >
      <FaWhatsapp className="text-2xl" aria-hidden />
      <span className="hidden text-sm font-semibold sm:inline">Need help?</span>
    </a>
  )
}

export default WhatsAppFloatingButton
