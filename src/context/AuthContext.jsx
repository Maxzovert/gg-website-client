import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, apiFetch } from '../config/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const token = window.localStorage.getItem('auth_token');
        if (!token || !API_URL?.length) {
          if (mounted) setLoading(false);
          return;
        }

        const res = await apiFetch('/api/auth/me');

        if (!res.ok) {
          window.localStorage.removeItem('auth_token');
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const data = await res.json();
        if (mounted) {
          setUser(data.user || null);
          setLoading(false);
        }
      } catch (_error) {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [API_URL]);

  const signOut = async () => {
    try {
      if (API_URL) {
        await apiFetch('/api/auth/logout', { method: 'POST' });
      }
      window.localStorage.removeItem('auth_token');
      setUser(null);
      navigate('/');
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const sendPhoneOtp = async (phone_number) => {
    try {
      if (!API_URL) throw new Error('API URL is not configured');
      const res = await apiFetch('/api/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phone_number }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const verifyPhoneOtp = async (phone_number, otp, metadata = {}) => {
    try {
      if (!API_URL) throw new Error('API URL is not configured');
      const res = await apiFetch('/api/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({
          phone_number,
          otp,
          email: metadata.email,
          full_name: metadata.full_name,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to verify OTP');
      }

      if (data.token) {
        window.localStorage.setItem('auth_token', data.token);
      }
      setUser(data.user || null);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const value = {
    user,
    loading,
    sendPhoneOtp,
    verifyPhoneOtp,
    signOut,
    isAuthenticated: !!user,
    userId: user?.id || null
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

