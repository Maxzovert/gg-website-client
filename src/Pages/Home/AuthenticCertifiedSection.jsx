import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import rdcImage from '../../assets/ProductPage/rdc.webp'

const AuthenticCertifiedSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#FFFAEB]">
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
          <div className="text-center lg:text-left">
            <p className="text-sm md:text-base font-medium tracking-[0.35em] uppercase text-primary/90 mb-4">
              Trust · Authenticity · Certification
            </p>
            <h2 className="font-heading font-bold text-stone-800 text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl tracking-tight mb-6 leading-tight">
              Authentic &amp; certified
            </h2>
            <p className="text-stone-600 text-xl md:text-2xl lg:text-3xl leading-relaxed font-heading mb-4">
              Every item we offer is sourced with care and backed by proper checks, so you receive genuine spiritual goods, not imitations.
            </p>
            <p className="text-stone-500 text-lg md:text-xl mb-10">
              Lab-verified where applicable · Ethical sourcing · Transparent quality
            </p>
            <Link
              to="/rudraksha"
              className="inline-flex items-center gap-3 py-4 px-10 rounded-full bg-primary text-white font-semibold text-base md:text-lg tracking-[0.2em] uppercase hover:bg-primary/90 transition-all duration-200 group shadow-lg hover:shadow-xl"
            >
              <span>Explore the collection</span>
              <FaArrowRight className="text-lg shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden />
            </Link>
          </div>

          <div className="flex justify-center lg:justify-start">
            <div className="rounded-3xl lg:rounded-4xl border-4 border-primary/35 p-3 sm:p-4 lg:p-5 shadow-2xl bg-white/60">
              <img
                src={rdcImage}
                alt="Authentic and certified products — Gawri Ganga quality assurance"
                className="w-full max-w-2xl lg:max-w-none lg:w-2xl xl:w-3xl h-auto object-contain object-center rounded-2xl lg:rounded-3xl"
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
