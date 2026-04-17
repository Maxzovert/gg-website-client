import React, { useRef, useEffect, useCallback } from 'react';

/**
 * Segmented OTP boxes: auto-advance, paste, backspace navigation.
 */
const OtpInput = ({ length = 6, value = '', onChange, disabled = false, autoFocus = false }) => {
  const inputsRef = useRef([]);
  const safeLen = Math.min(Math.max(length, 4), 8);

  const clean = String(value || '')
    .replace(/\D/g, '')
    .slice(0, safeLen);
  const digitChars = Array.from({ length: safeLen }, (_, i) => clean[i] || '');

  const focusAt = useCallback((i) => {
    const el = inputsRef.current[i];
    if (el) {
      el.focus();
      el.select();
    }
  }, []);

  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, safeLen);
  }, [safeLen]);

  useEffect(() => {
    if (autoFocus && !disabled) {
      focusAt(0);
    }
  }, [autoFocus, disabled, focusAt]);

  const handleChange = (index, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1) || '';
    const next = Array.from({ length: safeLen }, (_, i) => digitChars[i] || '');
    next[index] = char;
    onChange(next.join(''));

    if (char && index < safeLen - 1) {
      focusAt(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digitChars[index] && index > 0) {
        const next = Array.from({ length: safeLen }, (_, i) => digitChars[i] || '');
        next[index - 1] = '';
        onChange(next.join(''));
        focusAt(index - 1);
        e.preventDefault();
      } else if (digitChars[index]) {
        const next = Array.from({ length: safeLen }, (_, i) => digitChars[i] || '');
        next[index] = '';
        onChange(next.join(''));
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      focusAt(index - 1);
      e.preventDefault();
    }
    if (e.key === 'ArrowRight' && index < safeLen - 1) {
      focusAt(index + 1);
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, safeLen);
    if (!pasted) return;
    onChange(pasted);
    const nextIdx = Math.min(pasted.length, safeLen - 1);
    focusAt(nextIdx);
  };

  return (
    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-3" role="group" aria-label="One-time password">
      {Array.from({ length: safeLen }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          value={digitChars[i]}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          onFocus={(e) => e.target.select()}
          className="h-11 w-9 rounded-xl border-2 border-orange-100 bg-white text-center text-lg font-semibold tracking-widest text-stone-900 shadow-sm shadow-orange-900/5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:opacity-50 sm:h-14 sm:w-12 sm:text-xl"
        />
      ))}
    </div>
  );
};

export default OtpInput;
