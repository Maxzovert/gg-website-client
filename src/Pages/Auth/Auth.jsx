import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaUser, FaMobileAlt, FaKey } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toaster';
import { trackLogin } from '../../utils/analytics.js';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!otpRequested) {
        const { data, error } = await sendPhoneOtp(phoneNumber);
        if (error) {
          toast.error(error.message || 'Failed to send OTP');
        } else {
          setOtpRequested(true);
          setDevOtp(data?.dev_otp || '');
          toast.success('OTP sent successfully');
        }
      } else {
        const { error } = await verifyPhoneOtp(phoneNumber, otp, {
          full_name: name,
          email,
        });
        if (error) {
          toast.error(error.message || 'Failed to verify OTP');
        } else {
          trackLogin('otp');
          toast.success('Phone verified successfully');
          navigate(from, { replace: true });
        }
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
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Phone OTP Login</h1>
            <p className="text-gray-600">Authenticate with phone OTP, full name, and email.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <div className="relative">
                <FaMobileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter 10-digit mobile number"
                  required
                  disabled={otpRequested}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {!otpRequested && (
              <p className="text-xs text-gray-500">
                Demo development login: phone <span className="font-semibold">9999999999</span> with OTP{' '}
                <span className="font-semibold">123456</span>.
              </p>
            )}

            {otpRequested && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                  <button
                    type="button"
                    onClick={handleEditPhone}
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    Change phone
                  </button>
                </div>
                <div className="relative">
                  <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter OTP"
                    required
                  />
                </div>
                {!!devOtp && (
                  <p className="text-xs text-emerald-600 mt-2">
                    Dev OTP received from API: <span className="font-semibold">{devOtp}</span>
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : otpRequested ? 'Verify OTP & Login' : 'Send OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;

