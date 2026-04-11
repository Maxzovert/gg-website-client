import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaMobileAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toaster';
import { trackLogin, trackSignUp } from '../../utils/analytics.js';
import OtpInput from '../../components/OtpInput.jsx';

const Auth = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpLength, setOtpLength] = useState(6);
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isSignup = useMemo(() => location.pathname.startsWith('/signup'), [location.pathname]);

  const from = location.state?.from?.pathname || '/';

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
    setLoading(true);
    try {
      const { data, error } = await sendPhoneOtp(phoneNumber, {
        ...(isSignup
          ? { full_name: fullName.trim(), is_signup: true }
          : {}),
      });
      if (error) {
        toast.error(error.message || 'Failed to send OTP');
      } else {
        setOtpRequested(true);
        setOtp('');
        setDevOtp(data?.dev_otp || '');
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
    setLoading(true);
    try {
      const { error } = await verifyPhoneOtp(phoneNumber, code, {
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
    setDevOtp('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50/30 to-white py-8 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {otpRequested ? 'Enter OTP' : isSignup ? 'Create account' : 'Sign in'}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {otpRequested
                ? 'We sent a code to your mobile number'
                : isSignup
                  ? 'Create your account with your mobile number'
                  : 'Sign in with the mobile number you used to register'}
            </p>
          </div>

          {!otpRequested ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                    placeholder="First and last name"
                    required
                    autoComplete="name"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile number</label>
                <div className="relative">
                  <FaMobileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                    placeholder="10-digit mobile number"
                    required
                    autoComplete="tel"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                Dev test: <span className="font-mono font-semibold">9999999999</span> + OTP{' '}
                <span className="font-mono font-semibold">123456</span>
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
              >
                {loading ? 'Sending…' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-8">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 truncate max-w-[200px] sm:max-w-none">
                  Code sent to <span className="font-semibold text-gray-900">{phoneNumber}</span>
                </span>
                <button
                  type="button"
                  onClick={handleEditPhone}
                  className="shrink-0 text-primary font-medium hover:underline"
                >
                  Change number
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-center text-sm font-medium text-gray-700">
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

              {!!devOtp && (
                <p className="text-center text-xs text-emerald-600 bg-emerald-50 rounded-lg py-2 px-3">
                  Dev mode — OTP: <span className="font-mono font-bold">{devOtp}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={loading || otp.replace(/\D/g, '').length !== otpLength}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
              >
                {loading ? 'Verifying…' : isSignup ? 'Create account' : 'Sign in'}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-gray-600">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <Link to="/login" state={{ from: location.state?.from }} className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New to Gawri Ganga?{' '}
                <Link to="/signup" state={{ from: location.state?.from }} className="font-semibold text-primary hover:underline">
                  Create an account
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
