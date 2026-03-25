'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Mail, Shield, FileText } from 'lucide-react';
import { BottomNav } from '@/components/layout';
import { Card, Button } from '@/components/ui';

export default function HelpPage() {
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
        <h1 className="font-bold text-base text-gray-7">Help & Support</h1>
      </header>

      <div className="px-5 py-5 space-y-3">
        <Card>
          <p className="font-semibold text-gray-7">Contact us</p>
          <p className="text-sm text-gray-4 mt-1">This is a demo support page. Hook it up to your support system later.</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button variant="secondary" onClick={() => {}}>
              <MessageCircle size={18} />
              Chat
            </Button>
            <Button variant="secondary" onClick={() => {}}>
              <Mail size={18} />
              Email
            </Button>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-1 rounded-xl flex items-center justify-center">
            <FileText size={18} className="text-gray-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-7">FAQ</p>
            <p className="text-xs text-gray-4">Common questions and answers</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-1 rounded-xl flex items-center justify-center">
            <Shield size={18} className="text-gray-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-7">Safety</p>
            <p className="text-xs text-gray-4">Tips for secure bookings</p>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}

