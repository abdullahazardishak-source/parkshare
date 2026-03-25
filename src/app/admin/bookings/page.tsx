'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Car } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await fetch('/api/admin/bookings');
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load bookings');
      setBookings(json.bookings || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load bookings');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    await load();
  };

  return (
    <div className="min-h-screen bg-gray-1">
      <header className="bg-white border-b border-gray-2 px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/admin" className="p-2 rounded-lg hover:bg-gray-1" aria-label="Back to admin dashboard">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold text-gray-7">Admin / Bookings</h1>
      </header>

      <main className="p-6 space-y-4">
        {error && <p className="text-red text-sm">{error}</p>}
        <Card className="flex items-center gap-3">
          <Car size={20} className="text-orange" />
          <p className="font-semibold text-gray-7">Recent bookings overview</p>
        </Card>

        {bookings.map((booking) => (
          <Card key={String(booking.id || '')} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-7">{String(booking.listing_id || '')}</p>
              <p className="text-sm text-gray-4">{String(booking.driver_id || '')}</p>
            </div>
            <div className="text-right flex items-center gap-2">
              <p className="font-semibold text-gray-7">Rs. {String(booking.total_amount || 0)}</p>
              <Badge
                variant={
                  String(booking.status || '') === 'completed'
                    ? 'green'
                    : String(booking.status || '') === 'cancelled'
                    ? 'red'
                    : 'blue'
                }
              >
                {String(booking.status || '')}
              </Badge>
              {String(booking.status || '') !== 'completed' && (
                <Button size="sm" onClick={() => updateStatus(String(booking.id || ''), 'completed')}>
                  Complete
                </Button>
              )}
            </div>
          </Card>
        ))}
      </main>
    </div>
  );
}

