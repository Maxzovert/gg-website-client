import React from 'react'
import { Link } from 'react-router-dom'

const ComingSoon = ({
  title = 'Coming Soon',
  subtitle = 'This section is under preparation. We are working to launch it soon.',
  primaryActionLabel = 'Explore Sprays',
  primaryActionTo = '/sprays',
  secondaryActionLabel = 'Go Home',
  secondaryActionTo = '/'
}) => {
  return (
    <section className="relative mx-auto flex min-h-[60vh] w-full max-w-[1920px] items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-10 xl:px-14">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#fff9fc] via-[#fff5fa] to-white" />

      <div className="relative w-full max-w-2xl rounded-3xl border border-primary/20 bg-white/95 p-8 text-center shadow-[0_12px_30px_rgba(201,104,154,0.14)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">Gawri Ganga</p>
        <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-primary/80">{subtitle}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={primaryActionTo}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
          >
            {primaryActionLabel}
          </Link>
          <Link
            to={secondaryActionTo}
            className="rounded-xl border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
          >
            {secondaryActionLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ComingSoon
