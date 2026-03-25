'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Phone, ArrowLeft } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/lib/store';

const TEST_OTP = '123456';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const redirectParam = searchParams.get('redirect');
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate OTP send
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: otpCode }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || 'Failed to sign in');
        return;
      }

      setUser(data.user);

      const target = (() => {
        const raw = redirectParam?.startsWith('/') ? redirectParam : '/dashboard';
        const url = new URL(raw, window.location.origin);
        if (!url.searchParams.get('lang')) url.searchParams.set('lang', lang);
        return url.pathname + url.search;
      })();

      router.push(target);
    } catch {
      setError('Unable to reach server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-1 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-orange to-orange-2 pt-6 pb-16 px-6 rounded-b-[40px]">
        <button
          type="button"
          onClick={() => {
            // If there is no history entry, fall back to home.
            if (typeof window !== 'undefined' && window.history.length > 1) {
              router.back();
            } else {
              router.push(`/?lang=${lang}`);
            }
          }}
          className="flex items-center gap-1 text-white/90 text-base mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        
        <h1 className="text-3xl font-bold text-white leading-tight">
          Welcome to<br />ParkShare! 👋
        </h1>
        <p className="text-white/80 mt-3 text-base">
          {lang === 'si'
            ? 'ඔබගේ ගිණුමට පිවිසෙන්න'
            : lang === 'ta'
            ? 'உங்கள் கணக்குக்கு உள்நுழைக'
            : 'Sign in to your account'}
        </p>
      </div>

      <div className="flex-1 px-6 -mt-8">
        <div className="bg-white rounded-3xl p-6 shadow-card">
          {step === 'phone' ? (
            <>
              <Input
                label={lang === 'si' ? 'දුරකථන අංකය' : lang === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number'}
                type="tel"
                placeholder="77 123 4567"
                icon={<Phone size={20} />}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                error={error}
              />
              
              <p className="text-xs text-gray-4 mt-3">
                {lang === 'si'
                  ? 'අපි ඔබගේ දුරකථනයට OTP කේතයක් යවන්නෙමු'
                  : lang === 'ta'
                  ? 'உங்கள் தொலைபேசிக்கு OTP குறியீடு அனுப்பப்படும்'
                  : 'We will send an OTP to your phone'}
              </p>

              <Button
                fullWidth
                onClick={() => handleSendOTP()}
                isLoading={isLoading}
                className="mt-6 relative z-10"
              >
                {lang === 'si' ? 'OTP ලබා ගන්න' : lang === 'ta' ? 'OTP பெறுக' : 'Get OTP'}
              </Button>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-gray-4 text-sm">
                  {lang === 'si'
                    ? 'ඔබගේ දුරකථනයට යවන �ද කේතය ඇතුළත් කරන්න'
                    : lang === 'ta'
                    ? 'உங்கள் தொலைபேசிக்கு அனுப்பப்பட்ட குறியீட்டை உள்ளிடுக'
                    : 'Enter the code sent to your phone'}
                </p>
                <p className="text-orange font-medium mt-1">+94 {phone}</p>
              </div>

              <div className="otp-row mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`otp-box ${digit ? 'filled' : ''}`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {error && (
                <p className="text-red text-sm text-center mb-4">{error}</p>
              )}

              <p className="text-center text-gray-4 text-sm mb-4">
                {lang === 'si'
                  ? 'කේතය ලැබුණේ නැද්ද? '
                  : lang === 'ta'
                  ? 'குறியீடு வரவில்லை? '
                  : 'Didn\'t receive the code? '}
                <button className="text-orange font-semibold">
                  {lang === 'si' ? 'නැවත යවන්න' : lang === 'ta' ? 'மீண்டும் அனுப்புக' : 'Resend'}
                </button>
              </p>
              <p className="text-center text-xs text-gray-4 mb-4">
                {lang === 'si'
                  ? `පරීක්ෂණ OTP: ${TEST_OTP}`
                  : lang === 'ta'
                  ? `சோதனை OTP: ${TEST_OTP}`
                  : `Test OTP: ${TEST_OTP}`}
              </p>

              <Button
                fullWidth
                onClick={() => handleVerifyOTP()}
                isLoading={isLoading}
              >
                {lang === 'si' ? 'පුරනය වන්න' : lang === 'ta' ? 'உள்நுழைக' : 'Sign In'}
              </Button>
            </>
          )}
        </div>

        <p className="text-center text-gray-4 text-sm mt-6">
          {lang === 'si'
            ? 'ගිණුමක් නැද්ද? '
            : lang === 'ta'
            ? 'கணக்கு இல்லையா? '
            : 'Don\'t have an account? '}
          <Link href={`/register?lang=${lang}`} className="text-orange font-semibold">
            {lang === 'si' ? 'ලියාපදිංචි වන්න' : lang === 'ta' ? 'பதிவுசெய்க' : 'Sign Up'}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-1" />}>
      <LoginContent />
    </Suspense>
  );
}
