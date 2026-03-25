'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { BottomNav } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { useAuthStore } from '@/lib/store';

export default function WalletPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [transactions, setTransactions] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState('');

  const balance = useMemo(
    () =>
      transactions.reduce((sum, tx) => {
        const amt = Number(tx.amount || 0);
        return tx.type === 'credit' ? sum + amt : sum - amt;
      }, Number(user?.wallet_balance || 0)),
    [transactions, user?.wallet_balance]
  );

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/wallet?userId=${encodeURIComponent(user.id)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Failed to load wallet');
        setTransactions(json.transactions || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load wallet');
      }
    };
    void load();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-1 pb-20">
      <header className="sticky top-0 z-50 bg-gray-1/92 backdrop-blur-xl border-b border-gray-6/10 px-5 h-12 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) router.back();
            else router.push('/dashboard');
          }}
          className="p-2 -ml-2 rounded-xl text-gray-7"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-base text-gray-7">Wallet</h1>
      </header>

      <div className="px-5 py-5 space-y-4">
        <Card className="bg-gradient-to-br from-orange to-orange-2 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm">Available balance</p>
              <p className="text-3xl font-black mt-1">Rs. {balance.toLocaleString('en-LK')}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <WalletIcon size={22} className="text-white" />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <Button
              className="bg-white text-orange hover:bg-white/95"
              onClick={() => {}}
            >
              <Plus size={18} />
              Top up
            </Button>
            <Button
              variant="secondary"
              className="bg-white/20 text-white border border-white/25 hover:bg-white/25"
              onClick={() => {}}
            >
              View details
            </Button>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-7">Recent activity</h2>
          <Badge variant="orange">Live</Badge>
        </div>
        {error && <p className="text-sm text-red">{error}</p>}

        <div className="space-y-3">
          {transactions.map((t) => (
            <Card key={String(t.id || '')} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  String(t.type || '') === 'credit' ? 'bg-green-pale' : 'bg-red-pale'
                }`}
              >
                {String(t.type || '') === 'credit' ? (
                  <ArrowDownLeft size={18} className="text-green" />
                ) : (
                  <ArrowUpRight size={18} className="text-red" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-7">{String(t.description || '')}</p>
                <p className="text-xs text-gray-4">{new Date(String(t.created_at || new Date().toISOString())).toLocaleString()}</p>
              </div>
              <p className={`font-bold ${String(t.type || '') === 'credit' ? 'text-green' : 'text-red'}`}>
                {String(t.type || '') === 'credit' ? '+' : '-'}Rs. {Number(t.amount || 0).toLocaleString('en-LK')}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

