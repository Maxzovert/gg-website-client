import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import ggLogo from '../../assets/gglogo.svg';

const Blog = () => {
  return (
    <div className="min-h-screen bg-stone-50/95">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
        >
          <FaArrowLeft aria-hidden />
          Back to home
        </Link>
        <div className="mb-10 flex justify-center">
          <img src={ggLogo} alt="Gawri Ganga" className="h-auto w-40 sm:w-48" loading="lazy" />
        </div>
        <header className="text-center">
          <h1 className="font-heading text-3xl font-bold text-stone-900 sm:text-4xl">Gawri Ganga Blog</h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            Articles on Rudraksha care, spirituality, and wellness from Gawri Ganga are coming soon. For now,
            explore our{' '}
            <Link to="/about" className="font-semibold text-primary underline-offset-2 hover:underline">
              about page
            </Link>{' '}
            or{' '}
            <Link to="/rudraksha" className="font-semibold text-primary underline-offset-2 hover:underline">
              Rudraksha collection
            </Link>
            .
          </p>
        </header>
      </div>
    </div>
  );
};

export default Blog;
