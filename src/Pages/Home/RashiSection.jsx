import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

const ZODIAC_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

// Load all zodiac sign images from local assets (Client/src/assets/Zodiac)
// File names should match sign names, e.g. Aries.png, Taurus.png, etc.
const zodiacImageModules = import.meta.glob('../../assets/Zodiac/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
})

const ZODIAC_IMAGES = Object.entries(zodiacImageModules).reduce((acc, [path, src]) => {
  const fileName = path.split('/').pop() || ''
  const baseName = fileName.split('.')[0].toLowerCase() // e.g. 'aries'
  acc[baseName] = src
  return acc
}, {})

const RashiSection = ({ hideCta = false }) => {
  // Use local zodiac assets; fall back to first available image if any are missing
  const fallbackImage = Object.values(ZODIAC_IMAGES)[0]

  const zodiacItems = ZODIAC_ORDER.map((key) => ({
    key,
    url: ZODIAC_IMAGES[key.toLowerCase()] || fallbackImage || '',
    label: key
  }))

  return (
    <section className="relative bg-[#FFFAEB] overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-5 sm:py-8 md:px-6 md:py-9 lg:py-10">
        {/* Section header */}
        <div className="mb-5 text-center md:mb-7">
          <h2 className="mb-1 font-heading text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">
            Discover by your Rashi
          </h2>
          <p className="mx-auto max-w-md text-xs text-gray-600 sm:text-sm md:text-base">
            Find the Rudraksha that aligns with your zodiac sign
          </p>
        </div>

        {/* Moving zodiac row with edge fade */}
        <div className="relative py-3 sm:py-4 md:py-5">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-linear-to-r from-[#FFFAEB] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-linear-to-l from-[#FFFAEB] to-transparent z-10" />
          <div className="rashi-scroll-container overflow-hidden">
            <div className="flex animate-zodiac-scroll w-max">
              {[1, 2].map((copy) => (
                <div key={copy} className="flex items-center gap-6 md:gap-10 pr-6 md:pr-10 shrink-0">
                  {zodiacItems.map((item) => (
                    <Link
                      key={`${copy}-${item.key}`}
                      to="/rashi"
                      className="flex flex-col items-center gap-2.5 shrink-0 group group/zodiac"
                    >
                      <div className="size-14 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-white shadow-md ring-2 ring-white transition-all duration-300 group-hover/zodiac:scale-105 group-hover/zodiac:border-primary group-hover/zodiac:shadow-lg sm:size-16 md:size-17 lg:size-20">
                        <img
                          src={item.url}
                          alt={item.key}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-gray-700 group-hover/zodiac:text-primary transition-colors whitespace-nowrap">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {!hideCta && (
          <div className="mt-6 md:mt-8 flex justify-center">
            <Link
              to="/rashi"
              className="inline-flex flex-wrap items-center justify-center gap-2 md:gap-3 py-4 px-6 md:px-8 rounded-2xl bg-primary text-white font-semibold text-sm md:text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
            >
              <span className="font-heading">Find your Rashi Rudraksha beads for your zodiac</span>
              <FaArrowRight className="text-lg shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default RashiSection
