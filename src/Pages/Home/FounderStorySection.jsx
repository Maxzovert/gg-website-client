import React from 'react'

const FounderStorySection = () => {
  return (
    <section className="bg-[#FFFAEB] py-10 sm:py-14">
      <div className="mx-auto grid w-[92%] max-w-7xl items-center gap-6 rounded-2xl border border-amber-200/70 bg-white/80 p-5 shadow-sm sm:grid-cols-2 sm:gap-8 sm:p-8">
        <div className="overflow-hidden rounded-xl border border-amber-100 bg-amber-50">
          <div className="flex h-64 items-center justify-center px-6 text-center text-sm text-stone-600 sm:h-80">
            Founder image placeholder
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Founder Story</p>
          <h2 className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl">
            Built with devotion, not just business goals
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-700 sm:text-base">
            Gawri Ganga began from a personal spiritual journey to make authentic Rudraksha and
            sacred products available with honesty, guidance, and trust.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-stone-700 sm:text-base">
            Every product is selected with care so seekers can buy with confidence and feel supported
            in their daily spiritual practice.
          </p>
        </div>
      </div>
    </section>
  )
}

export default FounderStorySection
