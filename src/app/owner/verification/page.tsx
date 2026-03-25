'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Upload } from 'lucide-react';
import { BottomNav } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';

export default function OwnerVerificationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-1 pb-20">
      <header className="sticky top-0 z-50 bg-gray-1/92 backdrop-blur-xl border-b border-gray-6/10 px-5 h-12 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) router.back();
            else router.push('/owner/register');
          }}
          className="p-2 -ml-2 rounded-xl text-gray-7"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-base text-gray-7">Owner verification</h1>
      </header>

      <div className="px-5 py-5 space-y-3">
        <Card className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-pale rounded-xl flex items-center justify-center">
            <ShieldCheck size={18} className="text-green" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-7">Verification status</p>
            <p className="text-sm text-gray-4 mt-1">
              Placeholder screen. Connect this to your real document verification flow.
            </p>
          </div>
          <Badge variant="orange">Pending</Badge>
        </Card>

        <Card>
          <p className="font-semibold text-gray-7">Upload documents (demo)</p>
          <p className="text-sm text-gray-4 mt-1">NIC / proof of address / business docs</p>
          <Button fullWidth className="mt-4" onClick={() => {}}>
            <Upload size={18} />
            Upload
          </Button>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}

