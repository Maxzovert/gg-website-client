import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBalanceScale,
  FaHandHoldingHeart,
  FaShieldAlt,
  FaSun,
  FaWallet,
} from 'react-icons/fa';
import { FiActivity } from 'react-icons/fi';
import { GiClover, GiMeditation, GiSwordman } from 'react-icons/gi';

const PURPOSES = [
  'Meditation',
  'Daily Prayer',
  'Mindful Living',
  'Home Temple',
  'Japa Practice',
  'Gifting',
  'Wellness Rituals',
  'Focus',
];

const iconByPurpose = {
  meditation: GiMeditation,
  'daily prayer': FaSun,
  'mindful living': FaBalanceScale,
  'home temple': FaShieldAlt,
  'japa practice': FaHandHoldingHeart,
  gifting: GiClover,
  'wellness rituals': FiActivity,
  focus: FaWallet,
};

const ShopByPurposeSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="overflow-x-hidden bg-[#FFFAEB] py-8 sm:py-10 md:py-12 lg:py-14"
      aria-labelledby="shop-by-purpose-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="shop-by-purpose-heading"
            className="font-heading text-xl font-bold text-stone-900 sm:text-2xl md:text-3xl lg:text-[2rem]"
          >
            Shop By Collection
          </h2>
          <p className="mt-1.5 text-xs text-stone-600 sm:mt-2 sm:text-sm md:text-base">
            Explore spiritual products by ritual style and daily use.
          </p>
        </div>
      </div>

      {/* Full viewport width, single row — exactly 8 purposes; sizing unchanged */}
      <div
        className="relative left-1/2 right-1/2 mt-6 -ml-[50vw] -mr-[50vw] w-screen max-w-[100vw] px-2 sm:px-3 md:px-5 lg:px-8"
        role="group"
        aria-label="Shop by purpose categories"
      >
        <div className="flex w-full min-w-0 flex-nowrap items-start justify-center gap-0.5 sm:gap-1.5 md:gap-2 lg:gap-3">
          {PURPOSES.map((purpose) => {
            const key = String(purpose).trim().toLowerCase();
            const Icon = iconByPurpose[key] || FaSun;

            return (
              <button
                type="button"
                key={purpose}
                onClick={() =>
                  navigate(`/purpose-products?purpose=${encodeURIComponent(purpose)}&category=all`)
                }
                className="group flex min-h-0 min-w-0 flex-1 basis-0 flex-col items-center rounded-xl py-1.5 text-center transition hover:bg-amber-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 sm:rounded-2xl sm:py-2"
                aria-label={`Browse ${purpose} products`}
              >
                <span className="mx-auto flex aspect-square w-full max-w-[min(100%,7.5rem)] items-center justify-center rounded-full border-2 border-[#D4AF37] bg-linear-to-b from-[#ff9b4b] to-[#f07f2f] text-white shadow-[0_3px_12px_rgba(120,50,20,0.36)] transition duration-200 group-hover:scale-[1.04] group-hover:shadow-[0_5px_16px_rgba(120,50,20,0.44)] sm:border-[3px] [&_svg]:text-white">
                  <Icon
                    aria-hidden
                    className="h-[58%] w-[58%] min-h-3 min-w-3 shrink-0"
                  />
                </span>
                <span className="mt-1.5 line-clamp-2 w-full px-0.5 text-center text-[clamp(0.55rem,2.4vw,0.95rem)] font-semibold capitalize leading-tight text-stone-800 sm:mt-2 sm:line-clamp-2 md:text-[clamp(0.65rem,1.8vw,1rem)]">
                  {purpose}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopByPurposeSection;
