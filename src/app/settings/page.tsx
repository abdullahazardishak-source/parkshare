'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Shield, Bell, Globe, Info, LogOut } from 'lucide-react';
import { BottomNav } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { useAuthStore } from '@/lib/store';

export default function SettingsPage() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const items = [
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Shield, label: 'Security', href: '/profile/security' },
    { icon: Globe, label: 'Language', href: '/settings' },
    { icon: Info, label: 'Help & Support', href: '/help' },
  ];

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
        <h1 className="font-bold text-base text-gray-7">Settings</h1>
      </header>

      <div className="px-5 py-5 space-y-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-1 rounded-xl flex items-center justify-center">
                <item.icon size={18} className="text-gray-5" />
              </div>
              <span className="flex-1 font-medium text-gray-7">{item.label}</span>
              <ChevronRight size={18} className="text-gray-3" />
            </Card>
          </Link>
        ))}

        <Button
          variant="red"
          fullWidth
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="mt-2"
        >
          <LogOut size={18} />
          Log out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}

