import React from 'react';
import whyGgBg from '../../assets/HomePage/whygg.webp';

/** Readable on busy art */
const ON_IMAGE_TEXT =
  'text-[#2a1810] [text-shadow:0_1px_0_rgba(255,255,255,0.95),0_0_18px_rgba(255,250,235,0.98),0_2px_14px_rgba(62,47,28,0.18)]';

const POINTS = [
  'Carefully selected products with quality-focused checks',
  'Traditional choices for prayer and mindful daily routines',
  'Clear details, thoughtful packaging, and trusted support',
];

/** Simple vertical rule between two columns — straight stroke, not an L (desktop) */
function BetweenPointsDivider() {
  return (
    <li
      className="hidden items-center justify-center sm:flex sm:w-6 sm:self-stretch md:w-8"
      aria-hidden
    >
      <span
        className="h-14 w-[2px] shrink-0 rounded-full bg-[#4a3420]/75 [box-shadow:0_0_0_1px_rgba(255,250,235,0.6)] md:h-18"
      />
    </li>
  );
}

const WhyTrustGawriGangaSection = () => {
  return (
    <section className="w-full bg-[#FFFAEB]" aria-labelledby="why-trust-gawri-ganga-heading">
      <div className="relative mx-auto h-[700px] w-full max-w-[1920px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: `url(${whyGgBg})` }}
          role="presentation"
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-start px-4 pb-10 pt-9 sm:px-12 sm:pt-11 lg:px-20 lg:pt-12">
          <h2
            id="why-trust-gawri-ganga-heading"
            className={`font-heading max-w-4xl text-center text-[clamp(1.5rem,4.2vw,2.85rem)] font-bold uppercase leading-tight tracking-[0.07em] sm:tracking-[0.09em] ${ON_IMAGE_TEXT}`}
          >
            Why choose Gawri Ganga?
          </h2>

          <ul className="mt-14 flex w-full max-w-6xl flex-col space-y-5 sm:mt-20 sm:grid sm:min-h-0 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch sm:gap-x-0 sm:space-y-0 md:mt-24 lg:mt-28 lg:max-w-7xl">
            {POINTS.map((label, index) => (
              <React.Fragment key={label}>
                <li className="text-center sm:px-2 sm:py-1">
                  <p
                    className={`font-heading font-semibold leading-snug sm:leading-tight ${ON_IMAGE_TEXT} text-[clamp(0.95rem,2.1vw,1.2rem)] sm:text-[clamp(1rem,1.85vw,1.3rem)] md:text-[clamp(1.05rem,1.65vw,1.45rem)]`}
                  >
                    {label}
                  </p>
                </li>
                {index < POINTS.length - 1 ? <BetweenPointsDivider /> : null}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhyTrustGawriGangaSection;
