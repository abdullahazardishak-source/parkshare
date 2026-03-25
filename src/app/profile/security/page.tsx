'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Lock, KeyRound } from 'lucide-react';
import { BottomNav } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';

export default function ProfileSecurityPage() {
  const router = useRouter();

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
        <h1 className="font-bold text-base text-gray-7">Security</h1>
      </header>

      <div className="px-5 py-5 space-y-3">
        <Card className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-1 rounded-xl flex items-center justify-center">
            <Shield size={18} className="text-gray-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-7">Account status</p>
            <p className="text-sm text-gray-4 mt-1">Demo security screen. Add real security settings later.</p>
          </div>
          <Badge variant="green">OK</Badge>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-1 rounded-xl flex items-center justify-center">
            <Lock size={18} className="text-gray-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-7">Change password</p>
            <p className="text-xs text-gray-4">Not implemented (demo)</p>
          </div>
          <Button variant="secondary" onClick={() => {}}>
            Update
          </Button>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-1 rounded-xl flex items-center justify-center">
            <KeyRound size={18} className="text-gray-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-7">Two-factor authentication</p>
            <p className="text-xs text-gray-4">Not implemented (demo)</p>
          </div>
          <Button variant="secondary" onClick={() => {}}>
            Enable
          </Button>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}

