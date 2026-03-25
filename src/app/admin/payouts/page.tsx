'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await fetch('/api/admin/payouts');
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load payouts');
      setPayouts(json.payouts || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load payouts');
    }
  };
  useEffect(() => {
    void load();
  }, []);

  const markPaid = async (id: string) => {
    await fetch('/api/admin/payouts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'completed' }),
    });
    await load();
  };

  return (
    <div className="min-h-screen bg-gray-1">
      <header className="bg-white border-b border-gray-2 px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/admin" className="p-2 rounded-lg hover:bg-gray-1" aria-label="Back to admin dashboard">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold text-gray-7">Admin / Payouts</h1>
      </header>

      <main className="p-6 space-y-4">
        {error && <p className="text-red text-sm">{error}</p>}
        <Card className="flex items-center gap-3">
          <DollarSign size={20} className="text-green" />
          <p className="font-semibold text-gray-7">Owner payouts</p>
        </Card>

        {payouts.map((payout) => (
          <Card key={String(payout.id || '')} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-7">{String(payout.owner_id || '')}</p>
              <p className="text-sm text-gray-4">Payout #{String(payout.id || '')}</p>
            </div>
            <div className="text-right flex items-center gap-3">
              <div>
                <p className="font-semibold text-gray-7">Rs. {Number(payout.amount || 0).toLocaleString()}</p>
                <Badge variant={String(payout.status || '') === 'completed' ? 'green' : 'orange'}>
                  {String(payout.status || '')}
                </Badge>
              </div>
              {String(payout.status || '') === 'pending' && (
                <Button size="sm" onClick={() => markPaid(String(payout.id || ''))}>
                  Mark paid
                </Button>
              )}
            </div>
          </Card>
        ))}
      </main>
    </div>
  );
}

