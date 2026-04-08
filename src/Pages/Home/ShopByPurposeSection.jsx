import React, { useEffect, useMemo, useState } from 'react';
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
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api.js';

const FALLBACK_PURPOSES = [
  'Wealth',
  'Love',
  'Health',
  'Luck',
  'Protection',
  'Peace',
  'Courage',
  'Balance',
];

const iconByPurpose = {
  wealth: FaWallet,
  love: FaHandHoldingHeart,
  health: FiActivity,
  luck: GiClover,
  protection: FaShieldAlt,
  peace: GiMeditation,
  courage: GiSwordman,
  balance: FaBalanceScale,
};

const ShopByPurposeSection = () => {
  const navigate = useNavigate();
  const [purposes, setPurposes] = useState(FALLBACK_PURPOSES);
  const [loadingPurposes, setLoadingPurposes] = useState(true);

  useEffect(() => {
    const fetchPurposes = async () => {
      try {
        setLoadingPurposes(true);
        const response = await apiFetch('/api/products/purposes');
        if (!response.ok) throw new Error('Failed to fetch purposes');
        const result = await response.json();
        const list = result?.success && Array.isArray(result.data) ? result.data : [];
        if (list.length > 0) {
          setPurposes(list);
        }
      } catch (_error) {
      } finally {
        setLoadingPurposes(false);
      }
    };

    fetchPurposes();
  }, []);

  const renderedPurposes = useMemo(
    () => (purposes.length > 0 ? purposes : FALLBACK_PURPOSES),
    [purposes],
  );

  return (
    <section
      className="bg-[#FFFAEB] py-10 md:py-14"
      aria-labelledby="shop-by-purpose-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="shop-by-purpose-heading"
            className="font-heading text-2xl font-bold text-stone-900 sm:text-3xl md:text-4xl"
          >
            Shop By Purpose
          </h2>
          <p className="mt-2 text-sm text-stone-600 sm:text-base">
            Choose your intention and explore products crafted for it.
          </p>
        </div>

        <div className="mt-7 px-1 sm:px-0">
          <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-8">
          {renderedPurposes.map((purpose) => {
            const key = String(purpose).trim().toLowerCase();
            const Icon = iconByPurpose[key] || FaSun;

            return (
              <button
                type="button"
                key={purpose}
                onClick={() =>
                  navigate(`/purpose-products?purpose=${encodeURIComponent(purpose)}&category=all`)
                }
                className="group min-w-[112px] shrink-0 rounded-xl px-2 py-3 text-center transition hover:bg-amber-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 sm:min-w-0"
                aria-label={`Browse ${purpose} products`}
              >
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-[#D4AF37] bg-linear-to-b from-[#ff9b4b] to-[#f07f2f] text-2xl text-white shadow-[0_3px_10px_rgba(120,50,20,0.35)] transition duration-200 group-hover:scale-105 group-hover:shadow-[0_5px_14px_rgba(120,50,20,0.42)] sm:h-24 sm:w-24 sm:text-[30px]">
                  <Icon aria-hidden />
                </span>
                <span className="mt-2.5 block text-center text-sm font-semibold text-stone-800 sm:text-base">
                  {purpose}
                </span>
              </button>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopByPurposeSection;
