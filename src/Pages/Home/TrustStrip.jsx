import React from 'react'
import { FaCheckCircle, FaFlask, FaTruck, FaLock } from 'react-icons/fa'

const trustItems = [
  { label: 'Authentic', Icon: FaCheckCircle },
  { label: 'Lab-Tested', Icon: FaFlask },
  { label: 'Pan-India Delivery', Icon: FaTruck },
  { label: 'Secure Payment', Icon: FaLock },
]

const TrustStrip = () => {
  return (
    <section className="bg-[#FFF6DE] py-4 sm:py-5" aria-label="Store trust highlights">
      <div className="mx-auto grid w-[92%] max-w-7xl grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {trustItems.map(({ label, Icon }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-xl border border-amber-200/80 bg-white/80 px-3 py-2.5"
          >
            <Icon className="shrink-0 text-primary" aria-hidden />
            <span className="text-xs font-semibold text-stone-700 sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrustStrip
