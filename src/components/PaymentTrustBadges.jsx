import React from 'react';
import { FaMobileAlt, FaCreditCard, FaUniversity, FaMoneyBillWave } from 'react-icons/fa';
import payOptionsLogo from '../assets/ProductPage/payop.png';

const PaymentTrustBadges = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-semibold text-gray-700">
            <FaMobileAlt className="text-primary" aria-hidden /> UPI
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-semibold text-gray-700">
            <FaCreditCard className="text-primary" aria-hidden /> Cards
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-semibold text-gray-700">
            <FaUniversity className="text-primary" aria-hidden /> Net Banking
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-semibold text-gray-700">
            <FaMoneyBillWave className="text-primary" aria-hidden /> COD
          </span>
        </div>
        <span className="text-[10px] font-medium text-gray-500">Secured by Easebuzz</span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-gray-200 bg-gray-50/80 p-3 sm:p-4 ${className}`}>
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
        Secure payments
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
          <FaMobileAlt className="text-primary" aria-hidden /> UPI
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
          <FaCreditCard className="text-primary" aria-hidden /> Cards
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
          <FaUniversity className="text-primary" aria-hidden /> Net Banking
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
          <FaMoneyBillWave className="text-primary" aria-hidden /> COD
        </span>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        <img src={payOptionsLogo} alt="Accepted payment methods" className="h-6 sm:h-7 w-auto object-contain" loading="lazy" />
        <span className="text-[11px] text-gray-500">Secured by Easebuzz</span>
      </div>
    </div>
  );
};

export default PaymentTrustBadges;
