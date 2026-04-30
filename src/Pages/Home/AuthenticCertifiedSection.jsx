import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import rdcImage from '../../assets/ProductPage/rdc.webp'

const AuthenticCertifiedSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#FFFAEB] py-10 sm:py-12 md:py-14 lg:py-16">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-14">
          <div className="text-center lg:text-left">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-primary/90 sm:mb-4 sm:text-sm md:tracking-[0.32em]">
              Quality · Clarity · Trust
            </p>
            <h2 className="mb-4 font-heading text-3xl font-bold leading-tight tracking-tight text-stone-800 sm:mb-5 sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-[1.1] xl:text-6xl">
              Spiritual products with clear details
            </h2>
            <p className="mb-3 font-heading text-base leading-relaxed text-stone-600 sm:mb-4 sm:text-lg md:text-xl lg:text-2xl">
              Each item is selected with care and presented with transparent product information to help you make informed choices.
            </p>
            <p className="mb-8 text-sm text-stone-500 sm:mb-9 sm:text-base md:text-lg">
              Quality-focused sourcing · Clear product descriptions · Mindful selection
            </p>
            <Link
              to="/rudraksha"
              className="inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg transition-all duration-200 hover:bg-primary/90 hover:shadow-xl group sm:gap-3 sm:px-9 sm:py-4 sm:text-base md:tracking-[0.2em]"
            >
              <span>Explore collection</span>
              <FaArrowRight className="text-lg shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden />
            </Link>
          </div>

          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-md rounded-2xl border-[3px] border-primary/35 bg-white/60 p-2.5 shadow-xl sm:max-w-lg sm:rounded-3xl sm:border-4 sm:p-3 md:max-w-xl lg:max-w-lg xl:max-w-xl lg:rounded-4xl lg:p-4 xl:p-5 lg:shadow-2xl">
              <img
                src={rdcImage}
                alt="Authentic and certified products — Gawri Ganga quality assurance"
                className="mx-auto h-auto w-full max-h-[min(52vh,28rem)] object-contain object-center rounded-2xl sm:max-h-none sm:rounded-3xl lg:rounded-4xl"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AuthenticCertifiedSection
