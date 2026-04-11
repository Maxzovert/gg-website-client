import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaArrowLeft, FaGem, FaShippingFast, FaHeart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toaster';
import { trackLogin, trackSignUp } from '../../utils/analytics.js';
import OtpInput from '../../components/OtpInput.jsx';
import ggLogo from '../../assets/gglogo.svg';

const TRUST_POINTS = [
  {
    Icon: FaGem,
    title: 'Authentic Rudraksha & more',
    desc: 'Blessed products devotees trust, with clear quality you can feel.',
  },
  {
    Icon: FaShippingFast,
    title: 'Across India',
    desc: 'Careful packing and reliable delivery to your doorstep.',
  },
  {
    Icon: FaHeart,
    title: 'The Gawri Ganga family',
    desc: 'Guidance and care for your spiritual journey with us.',
  },
];

const Auth = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpLength, setOtpLength] = useState(6);
  const [loading, setLoading] = useState(false);
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isSignup = useMemo(() => location.pathname.startsWith('/signup'), [location.pathname]);
  const from = location.state?.from?.pathname || '/';
  const linkState = { from: location.state?.from };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (isSignup) {
      const trimmed = fullName.trim();
      const parts = trimmed.split(/\s+/).filter(Boolean);
      if (parts.length < 2) {
        toast.error('Please enter your first and last name.');
        return;
      }
    }
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length !== 10) {
      toast.error('Enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await sendPhoneOtp(digits, {
        ...(isSignup ? { full_name: fullName.trim(), is_signup: true } : {}),
      });
      if (error) {
        toast.error(error.message || 'Failed to send OTP');
      } else {
        setOtpRequested(true);
        setOtp('');
        if (typeof data?.otp_length === 'number' && data.otp_length > 0) {
          setOtpLength(data.otp_length);
        }
        toast.success('OTP sent to your phone');
      }
    } catch (_error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.replace(/\D/g, '');
    if (code.length !== otpLength) {
      toast.error(`Enter the ${otpLength}-digit OTP`);
      return;
    }
    if (isSignup) {
      const parts = fullName.trim().split(/\s+/).filter(Boolean);
      if (parts.length < 2) {
        toast.error('Please enter your first and last name.');
        return;
      }
    }
    const digits = phoneNumber.replace(/\D/g, '');
    setLoading(true);
    try {
      const { error } = await verifyPhoneOtp(digits, code, {
        ...(isSignup ? { full_name: fullName.trim(), is_signup: true } : {}),
      });
      if (error) {
        toast.error(error.message || 'Failed to verify OTP');
      } else {
        if (isSignup) {
          trackSignUp('otp');
          toast.success('Your account is ready');
        } else {
          trackLogin('otp');
          toast.success('Welcome back');
        }
        navigate(from, { replace: true });
      }
    } catch (_error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPhone = () => {
    setOtpRequested(false);
    setOtp('');
  };

  const setPhoneDigits = (raw) => {
    setPhoneNumber(raw.replace(/\D/g, '').slice(0, 10));
  };

  return (
    <div className="relative min-h-screen bg-linear-to-b from-[#FFF7F0] via-[#FAF4EF] to-[#EDE5DD]">
      <Link
        to="/"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-sm font-medium text-stone-700 shadow-sm ring-1 ring-orange-100/90 backdrop-blur-sm transition hover:bg-[#FFF5EE] hover:text-primary hover:ring-primary/25 sm:left-6 sm:top-6"
      >
        <FaArrowLeft className="text-xs text-primary/70" aria-hidden />
        Home
      </Link>

      <div className="flex min-h-screen items-center justify-center px-4 pb-10 pt-16 sm:px-6 sm:pb-12 sm:pt-20 lg:px-8 lg:py-12">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-orange-950/10 ring-1 ring-primary/15 lg:flex lg:min-h-[min(640px,calc(100vh-8rem))]">
          {/* Brand column — browns flow into site primary */}
          <aside className="relative flex flex-col justify-between gap-8 bg-linear-to-br from-[#2a1d18] via-[#4a2d1c] to-[#8f4518] px-8 py-10 text-white sm:px-10 sm:py-12 lg:w-[46%] lg:shrink-0 lg:py-14">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_100%_0%,rgba(255,145,77,0.45),transparent_50%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_100%,rgba(255,145,77,0.22),transparent_45%)]"
              aria-hidden
            />
            <div className="relative">
              <Link
                to="/"
                className="inline-block rounded-lg outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1d18]"
              >
                <img src={ggLogo} alt="Gawri Ganga" className="h-16 w-auto sm:h-20 md:h-24" />
              </Link>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffd8bc]">
                Purity · Power · Protection
              </p>
              <h1 className="mt-3 font-heading text-2xl font-bold leading-snug text-white sm:text-3xl">
                {isSignup ? 'Join Gawri Ganga' : 'Welcome back'}
              </h1>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#fdeeda]/95 sm:text-base">
                Authentic Rudraksha, malas, aura sprays & spiritual accessories sanctified with care for devotees
                across India.
              </p>
            </div>

            <ul className="relative grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
              {TRUST_POINTS.map(({ Icon, title, desc }) => (
                <li
                  key={title}
                  className="rounded-2xl border border-primary/25 bg-black/25 p-3.5 shadow-inner shadow-black/20 backdrop-blur-md sm:p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-orange-950/30">
                    <Icon className="text-sm" aria-hidden />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#fdeeda]/88">{desc}</p>
                </li>
              ))}
            </ul>
          </aside>

          {/* Form column — warm white, ties to left via orange accents */}
          <div className="flex flex-1 flex-col justify-center border-t border-orange-100/90 bg-linear-to-br from-white via-[#FFFCFA] to-[#FFF6EE] px-6 py-10 sm:px-10 sm:py-12 lg:border-l lg:border-t-0 lg:border-orange-100 lg:px-12 lg:py-14">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
                  {otpRequested ? 'Verify your number' : isSignup ? 'Create your account' : 'Sign in to continue'}
                </h2>
                <p className="mt-2 text-sm text-stone-600 sm:text-base">
                  {otpRequested
                    ? 'Enter the OTP we sent to your mobile.'
                    : isSignup
                      ? 'Use your mobile number — we’ll send a one-time code.'
                      : 'Enter the mobile number linked to your account.'}
                </p>
              </div>

              {!otpRequested ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  {isSignup && (
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-stone-500">
                        Full name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3.5 text-base text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="First and last name"
                        required
                        autoComplete="name"
                      />
                    </div>
                  )}
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-stone-500">
                      Mobile number
                    </label>
                    <div className="flex overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm shadow-orange-900/5 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
                      <span className="flex shrink-0 items-center border-r border-orange-100 bg-[#FFF4EC] px-3 text-sm font-semibold text-[#6b4423]">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneDigits(e.target.value)}
                        className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3.5 text-base text-stone-900 outline-none placeholder:text-stone-400"
                        placeholder="10-digit number"
                        required
                        autoComplete="tel"
                        inputMode="numeric"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/35 transition hover:bg-[#ff8533] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                  >
                    {loading ? 'Sending…' : 'Send OTP'}
                  </button>

                  <p className="text-center text-xs leading-relaxed text-stone-500">
                    By continuing you agree to our{' '}
                    <Link to="/terms-and-conditions" className="font-medium text-primary underline-offset-2 hover:underline">
                      Terms &amp; Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" className="font-medium text-primary underline-offset-2 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-8">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-stone-600">
                      Code sent to{' '}
                      <span className="font-semibold text-stone-900">+91 {phoneNumber}</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleEditPhone}
                      className="font-semibold text-primary hover:underline"
                    >
                      Change number
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-center text-sm font-medium text-stone-700">
                      Enter {otpLength}-digit code
                    </label>
                    <OtpInput
                      length={otpLength}
                      value={otp}
                      onChange={setOtp}
                      disabled={loading}
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.replace(/\D/g, '').length !== otpLength}
                    className="w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/35 transition hover:bg-[#ff8533] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                  >
                    {loading ? 'Verifying…' : isSignup ? 'Create account' : 'Sign in'}
                  </button>
                </form>
              )}

              <p className="mt-8 border-t border-orange-100/90 pt-8 text-center text-sm text-stone-600">
                {isSignup ? (
                  <>
                    Already have an account?{' '}
                    <Link to="/login" state={linkState} className="font-semibold text-primary hover:underline">
                      Sign in
                    </Link>
                  </>
                ) : (
                  <>
                    New to Gawri Ganga?{' '}
                    <Link to="/signup" state={linkState} className="font-semibold text-primary hover:underline">
                      Create an account
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
