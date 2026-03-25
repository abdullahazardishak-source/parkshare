'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone } from 'lucide-react';
import { BottomNav } from '@/components/layout';
import { Card, Input, Button } from '@/components/ui';
import { useAuthStore } from '@/lib/store';
import { getProfile, updateProfile } from '@/lib/profile';

export default function ProfileEditPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    nic: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      setError('');
      try {
        const profile = await getProfile(user.id);
        const data = profile || user;
        setFormData({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          nic: data.nic || '',
        });
      } catch {
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, [user]);

  const validate = () => {
    if (!formData.full_name.trim()) return 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Valid email is required';
    if (formData.phone.replace(/\D/g, '').length < 9) return 'Valid phone number is required';
    const nicPattern = /^[0-9]{9}[VvXx]$|^[0-9]{12}$/;
    if (!nicPattern.test(formData.nic)) return 'Invalid NIC number';
    return '';
  };

  const handleSave = async () => {
    if (!user?.id) return;
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = await updateProfile(user.id, {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        nic: formData.nic.trim(),
      });
      setUser(updated);
      setSuccess('Profile updated successfully');
    } catch {
      setError('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gray-1 pb-20">
        <div className="px-5 py-10">
          <Card className="space-y-3">
            <p className="font-semibold text-gray-7">Sign in required</p>
            <p className="text-sm text-gray-4">Please sign in to edit your profile.</p>
            <Button fullWidth onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1 pb-20">
      <header className="sticky top-0 z-50 bg-gray-1/92 backdrop-blur-xl border-b border-gray-6/10 px-5 h-12 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) router.back();
            else router.push('/profile');
          }}
          className="p-2 -ml-2 rounded-xl text-gray-7"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-base text-gray-7">Edit profile</h1>
      </header>

      <div className="px-5 py-5 space-y-4">
        <Card className="space-y-4">
          <Input
            label="Full name"
            icon={<User size={18} />}
            value={formData.full_name}
            onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
            disabled={isLoading || isSaving}
          />
          <Input
            label="Email"
            icon={<Mail size={18} />}
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            disabled={isLoading || isSaving}
          />
          <Input
            label="Phone"
            icon={<Phone size={18} />}
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            disabled={isLoading || isSaving}
          />
          <Input
            label="NIC"
            icon={<User size={18} />}
            value={formData.nic}
            onChange={(e) => setFormData((prev) => ({ ...prev, nic: e.target.value.toUpperCase() }))}
            disabled={isLoading || isSaving}
          />
          {error && <p className="text-sm text-red">{error}</p>}
          {success && <p className="text-sm text-green">{success}</p>}
          <Button fullWidth onClick={handleSave} isLoading={isSaving} disabled={isLoading}>
            Save changes
          </Button>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}

