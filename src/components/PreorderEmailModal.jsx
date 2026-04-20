import React, { useEffect, useMemo, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PreorderEmailModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  defaultEmail = '',
  productName = 'this product',
}) => {
  const [email, setEmail] = useState(defaultEmail || '');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setEmail(defaultEmail || '');
    setTouched(false);
  }, [isOpen, defaultEmail]);

  const isValidEmail = useMemo(() => EMAIL_RE.test(String(email || '').trim()), [email]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Preorder Notification</h3>
            <p className="mt-1 text-sm text-gray-600">
              Enter your email for `{productName}` and we will notify you when it is ready.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close preorder modal"
          >
            <FaTimes />
          </button>
        </div>

        <div>
          <label htmlFor="preorder-email" className="mb-1 block text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            id="preorder-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {touched && !isValidEmail ? (
            <p className="mt-1 text-xs font-medium text-red-600">Please enter a valid email address.</p>
          ) : null}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setTouched(true);
              if (!isValidEmail || loading) return;
              onSubmit(String(email || '').trim());
            }}
            disabled={loading}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreorderEmailModal;
