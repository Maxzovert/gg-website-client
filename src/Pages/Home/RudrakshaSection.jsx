import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import rudrakshaSection from '../../assets/HomePage/HomeImg1.webp'

const RudrakshaSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#FFFAEB] py-10 sm:py-12 md:py-14 lg:py-16">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-14">
          {/* Image left – bordered frame, padding so border doesn’t touch image */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-2xl border-[3px] border-amber-400/90 p-2.5 shadow-xl sm:max-w-lg sm:rounded-3xl sm:border-4 sm:p-3 md:max-w-xl lg:max-w-lg xl:max-w-xl lg:rounded-4xl lg:p-4 xl:p-5 lg:shadow-2xl">
              <img
                src={rudrakshaSection}
                alt="Rudraksha Mala – sacred beads in premium packaging by Gawri Ganga"
                className="mx-auto h-auto w-full max-h-[min(52vh,28rem)] object-contain object-center rounded-2xl sm:max-h-none sm:rounded-3xl lg:rounded-4xl"
              />
            </div>
          </div>

          {/* Text right – scales across breakpoints */}
          <div className="text-center lg:text-left">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-primary/90 sm:mb-4 sm:text-sm md:tracking-[0.32em]">
              Sacred Mala · Premium Packaging
            </p>
            <h2 className="mb-4 font-heading text-3xl font-bold leading-tight tracking-tight text-stone-800 sm:mb-5 sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-[1.1] xl:text-6xl">
              Rudraksha Mala
            </h2>
            <p className="mb-3 font-heading text-base leading-relaxed text-stone-600 sm:mb-4 sm:text-lg md:text-xl lg:text-2xl">
              Handpicked beads, presented with care. Each mala arrives in elegant packaging, worthy of gifting and daily practice.
            </p>
            <p className="mb-8 text-sm text-stone-500 sm:mb-9 sm:text-base md:text-lg">
              Meditation · Yoga · Spiritual wellness
            </p>
            <Link
              to="/rudraksha"
              className="inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg transition-all duration-200 hover:bg-primary/90 hover:shadow-xl group sm:gap-3 sm:px-9 sm:py-4 sm:text-base md:tracking-[0.2em]"
            >
              <span>Discover the collection</span>
              <FaArrowRight className="text-lg shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RudrakshaSection
