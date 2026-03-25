'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Phone, Lock, User, Mail, Car, Building2, ArrowLeft } from 'lucide-react';
import { Button, Input } from '@/components/ui';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nic: '',
    password: '',
    confirmPassword: '',
    role: '' as '' | 'driver' | 'owner',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = lang === 'si' ? 'නම අත්‍යවශ්‍යයි' : lang === 'ta' ? 'பெயர் தேவை' : 'Name is required';
    }
    
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = lang === 'si' ? 'වැරදි ඊමේල් ලිපිනයකි' : lang === 'ta' ? 'தவறான மின்னஞ்சல்' : 'Invalid email';
    }
    
    if (!formData.phone || formData.phone.length < 9) {
      newErrors.phone = lang === 'si' ? 'වැරදි දුරකථන අංකයකි' : lang === 'ta' ? 'தவறான தொலைபேசி எண்' : 'Invalid phone number';
    }
    
    // NIC validation for Sri Lanka
    const nicPattern = /^[0-9]{9}[VvXx]$|^[0-9]{12}$/;
    if (!nicPattern.test(formData.nic)) {
      newErrors.nic = lang === 'si' ? 'වැරදි NIC අංකයකි' : lang === 'ta' ? 'தவறான NIC எண்' : 'Invalid NIC number (e.g., 199012345678)';
    }
    
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = lang === 'si' ? 'මුරපදය අවම වශයෙන් 8 අකුරු විය යුතුය' : lang === 'ta' ? 'கடவுச்சொல் குறைந்தது 8 எழுத்துகள்' : 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = lang === 'si' ? 'මුරපද නොගැලපේ' : lang === 'ta' ? 'கடவுச்சொல் பொருந்தவில்லை' : 'Passwords do not match';
    }
    
    if (!formData.role) {
      newErrors.role = lang === 'si' ? 'රෝලයක් තෝරන්න' : lang === 'ta' ? 'பாத்திரத்தைத் தேர்வுசெய்க' : 'Please select a role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate registration. Redirect to login for JWT-based sign in.
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/login?lang=${lang}`);
    }, 1500);
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-1 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-orange to-orange-2 pt-6 pb-12 px-6 rounded-b-[40px]">
        <Link
          href={`/login?lang=${lang}`}
          className="flex items-center gap-1 text-white/90 text-base mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </Link>
        
        <h1 className="text-3xl font-bold text-white">
          {lang === 'si' ? 'ParkShare එකට එකතු වන්න' : lang === 'ta' ? 'ParkShare-இல் சேருங்கள்' : 'Join ParkShare'}
        </h1>
        <p className="text-white/80 mt-2 text-base">
          {lang === 'si'
            ? 'ආරම්භ කිරීමට ඔබේ විස්තර ඇතුලත් කරන්න'
            : lang === 'ta'
            ? 'தொடங்க உங்கள் விவரங்களை உள்ளிடுங்கள்'
            : 'Enter your details to get started'}
        </p>
      </div>

      <div className="flex-1 px-6 -mt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-card space-y-4">
            <Input
              label={lang === 'si' ? 'සම්පූර්ණ නම' : lang === 'ta' ? 'முழு பெயர்' : 'Full Name'}
              type="text"
              placeholder="John Doe"
              icon={<User size={20} />}
              value={formData.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              error={errors.fullName}
            />
            
            <Input
              label={lang === 'si' ? 'ඊමේල් ලිපිනය' : lang === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
              type="email"
              placeholder="john@example.com"
              icon={<Mail size={20} />}
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              error={errors.email}
            />
            
            <Input
              label={lang === 'si' ? 'දුරකථන අංකය' : lang === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number'}
              type="tel"
              placeholder="77 123 4567"
              icon={<Phone size={20} />}
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, ''))}
              error={errors.phone}
            />
            
            <Input
              label={lang === 'si' ? 'ජාතික හැඳුනුම්පත් අංකය' : lang === 'ta' ? 'தேசிய அடையாள அட்டை எண்' : 'NIC Number'}
              type="text"
              placeholder="199012345678"
              icon={<User size={20} />}
              value={formData.nic}
              onChange={(e) => updateField('nic', e.target.value.toUpperCase())}
              error={errors.nic}
              hint={lang === 'si' ? 'උදාහරණය: 199012345678' : lang === 'ta' ? 'எடுத்துக்காட்டு: 199012345678' : 'e.g., 199012345678'}
            />
            
            <Input
              label={lang === 'si' ? 'මුරපදය' : lang === 'ta' ? 'கடவுச்சொல்' : 'Password'}
              type="password"
              placeholder="••••••••"
              icon={<Lock size={20} />}
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              error={errors.password}
            />
            
            <Input
              label={lang === 'si' ? 'මුරපදය තහවුරු කරන්න' : lang === 'ta' ? 'கடவுச்சொல்லை உறுதிப்படுத்துங்கள்' : 'Confirm Password'}
              type="password"
              placeholder="••••••••"
              icon={<Lock size={20} />}
              value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
            />
          </div>

          {/* Role Selection */}
          <div className="bg-white rounded-3xl p-6 shadow-card">
            <label className="block text-xs font-semibold text-gray-4 uppercase tracking-wider mb-4">
              {lang === 'si' ? 'මම:' : lang === 'ta' ? 'நான்:' : 'I am a:'}
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, role: 'driver' });
                  if (errors.role) setErrors({ ...errors, role: '' });
                }}
                className={`
                  p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2
                  ${formData.role === 'driver'
                    ? 'border-orange bg-orange-pale'
                    : 'border-gray-2'
                  }
                `}
              >
                <Car size={28} className={formData.role === 'driver' ? 'text-orange' : 'text-gray-4'} />
                <span className={`font-semibold ${formData.role === 'driver' ? 'text-orange' : 'text-gray-6'}`}>
                  {lang === 'si' ? 'රියදුරු' : lang === 'ta' ? 'ஓட்டுனர்' : 'Driver'}
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, role: 'owner' });
                  if (errors.role) setErrors({ ...errors, role: '' });
                }}
                className={`
                  p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2
                  ${formData.role === 'owner'
                    ? 'border-orange bg-orange-pale'
                    : 'border-gray-2'
                  }
                `}
              >
                <Building2 size={28} className={formData.role === 'owner' ? 'text-orange' : 'text-gray-4'} />
                <span className={`font-semibold ${formData.role === 'owner' ? 'text-orange' : 'text-gray-6'}`}>
                  {lang === 'si' ? 'ඉඩ හිමිකරු' : lang === 'ta' ? 'இட உரிமையாளர்' : 'Space Owner'}
                </span>
              </button>
            </div>
            
            {errors.role && <p className="text-red text-sm mt-2 text-center">{errors.role}</p>}
          </div>

          <Button
            fullWidth
            type="submit"
            isLoading={isLoading}
          >
            {lang === 'si' ? 'ගිණුම හදන්න' : lang === 'ta' ? 'கணக்கு உருவாக்கு' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-gray-4 text-sm mt-6 pb-8">
          {lang === 'si'
            ? 'දැනටමත් ගිණුමක් තිබේද? '
            : lang === 'ta'
            ? 'ஏற்கனவே கணக்கு உள்ளதா? '
            : 'Already have an account? '}
          <Link href={`/login?lang=${lang}`} className="text-orange font-semibold">
            {lang === 'si' ? 'ඇතුල් වන්න' : lang === 'ta' ? 'உள்நுழைக' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-1" />}>
      <RegisterContent />
    </Suspense>
  );
}
