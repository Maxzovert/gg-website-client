import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    location: 'Pune',
    product: 'Rudraksha Mala',
    quote:
      'The bead quality and lab certificate gave me real confidence. Daily japa feels calmer and more focused since I started wearing it.',
    rating: 5,
  },
  {
    name: 'Rajesh K.',
    location: 'Delhi',
    product: 'Karungli Mala',
    quote:
      'Packaging was careful, delivery was on time, and the pendant matches the photos. You can tell they care about authenticity.',
    rating: 5,
  },
  {
    name: 'Meera V.',
    location: 'Bengaluru',
    product: 'Kanthi Mala',
    quote:
      'Shuddhi has become part of my morning routine—subtle, calming, and not overpowering. Will order again for family.',
    rating: 5,
  },
  {
    name: 'Arjun T.',
    location: 'Jaipur',
    product: 'Tulsi Mala',
    quote:
      'Genuine tulsi beads, neatly strung. The team answered my sizing questions before purchase. Very happy with the mala.',
    rating: 5,
  },
];

const cardClass =
  'flex h-full flex-col rounded-2xl border-2 border-amber-300/85 bg-white p-5 shadow-[0_8px_24px_-6px_rgba(62,47,28,0.22)] sm:p-6';

function StarRow({ count }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }, (_, i) => (
        <FaStar key={i} className="text-sm text-amber-500" aria-hidden />
      ))}
    </div>
  );
}

const TestimonialsSection = () => {
  return (
    <section
      className="w-full overflow-x-hidden bg-[#FFFAEB] py-10 sm:py-14 md:py-16 lg:py-20"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <span
            className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-[#FFFAEB] shadow-md sm:mx-0 sm:h-16 sm:w-16"
            aria-hidden
          >
            <FaQuoteLeft className="text-2xl sm:text-3xl" />
          </span>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2
              id="testimonials-heading"
              className="font-heading text-[clamp(1.375rem,4.5vw,2rem)] font-bold leading-tight tracking-tight text-stone-900 sm:text-3xl md:text-[2rem]"
            >
              What devotees are saying
            </h2>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-stone-600 sm:text-base">
              Real experiences from customers who chose Gawri Ganga for Rudraksha, malas, sprays, and
              sacred accessories.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6">
          {TESTIMONIALS.map((item) => (
            <article key={`${item.name}-${item.product}`} className={`${cardClass} min-w-0`}>
              <StarRow count={item.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-stone-700 sm:text-[0.9375rem]">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <footer className="mt-5 border-t border-amber-200/60 pt-4">
                <p className="font-heading text-sm font-bold text-stone-900">{item.name}</p>
                <p className="mt-0.5 text-xs text-stone-500">{item.location}</p>
                <p className="mt-2 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200/80">
                  {item.product}
                </p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
