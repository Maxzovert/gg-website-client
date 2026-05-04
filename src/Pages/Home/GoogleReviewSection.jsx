import React from 'react';
import { FaGoogle, FaStar } from 'react-icons/fa';
import googleReviewQr from '../../assets/gc.png';

const GoogleReviewSection = () => {
  return (
    <section
      className="w-full overflow-x-hidden bg-[#FFFAEB] py-10 sm:py-14 md:py-16 lg:py-20"
      aria-labelledby="google-review-heading"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 xl:gap-16">
          <div className="min-w-0 flex-1 text-center lg:max-w-xl lg:text-left">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5 lg:justify-start">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-stone-200/80 sm:h-16 sm:w-16"
                aria-hidden
              >
                <FaGoogle className="text-3xl text-[#4285F4] sm:text-4xl" />
              </span>
              <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-amber-700 lg:justify-start">
                <FaStar className="text-amber-500" aria-hidden />
                <span>Google reviews</span>
              </p>
            </div>
            <h2
              id="google-review-heading"
              className="mt-5 font-heading text-[clamp(1.375rem,4.5vw,2rem)] font-bold leading-tight tracking-tight text-stone-900 sm:text-3xl md:text-[2rem]"
            >
              Share how Gawri Ganga worked for you
            </h2>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-stone-600 sm:text-base">
              If our Rudraksha, malas, or other products have been part of your journey, we&apos;d be grateful
              for a short review on Google. It helps new devotees choose with confidence—and tells us what
              we&apos;re getting right.
            </p>
            <p className="mt-3 text-pretty text-sm font-medium text-stone-700 sm:text-base">
              Scan the code with your phone camera to leave a review on our Google Business profile.
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col items-center justify-center lg:w-auto lg:max-w-[min(100%,320px)]">
            <figure className="w-full max-w-[260px] sm:max-w-[280px]">
              <div className="overflow-hidden rounded-2xl border-2 border-amber-300/85 bg-white p-3 shadow-[0_8px_24px_-6px_rgba(62,47,28,0.18)] sm:p-4">
                <img
                  src={googleReviewQr}
                  alt="QR code: scan with your phone to open Google and leave a review for Gawri Ganga"
                  className="mx-auto h-auto w-full max-w-full object-contain"
                  width={280}
                  height={280}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-3 text-center text-xs text-stone-500 sm:text-sm">
                Point your camera here — opens Google review for Gawri Ganga
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviewSection;
