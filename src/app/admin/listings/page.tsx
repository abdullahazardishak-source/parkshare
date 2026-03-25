'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Building2, ArrowLeft } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

export default function AdminListingsPage() {
  const [filter, setFilter] = useState<string | null>(null);
  const [listings, setListings] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const value = new URLSearchParams(window.location.search).get('filter');
    setFilter(value);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const query = filter === 'pending' ? '?status=pending' : '';
        const res = await fetch(`/api/admin/listings${query}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Failed to load listings');
        setListings(json.listings || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load listings');
      }
    };
    void load();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/listings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    const query = filter === 'pending' ? '?status=pending' : '';
    const res = await fetch(`/api/admin/listings${query}`);
    const json = await res.json();
    setListings(json.listings || []);
  };

  return (
    <div className="min-h-screen bg-gray-1">
      <header className="bg-white border-b border-gray-2 px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/admin" className="p-2 rounded-lg hover:bg-gray-1" aria-label="Back to admin dashboard">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold text-gray-7">Admin / Listings</h1>
      </header>

      <main className="p-6 space-y-4">
        {error && <p className="text-red text-sm">{error}</p>}
        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 size={20} className="text-green" />
            <p className="font-semibold text-gray-7">Listing approvals</p>
          </div>
          <Badge variant="orange">{listings.length} items</Badge>
        </Card>

        {listings.map((listing) => (
          <Card key={String(listing.id || '')} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-7">{String(listing.title || '')}</p>
              <p className="text-sm text-gray-4">Owner: {String(listing.owner_id || '')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={String(listing.status || '') === 'approved' ? 'green' : 'orange'}>
                {String(listing.status || '')}
              </Badge>
              {String(listing.status || '') !== 'approved' && (
                <Button size="sm" onClick={() => updateStatus(String(listing.id || ''), 'approved')}>
                  Approve
                </Button>
              )}
              {String(listing.status || '') !== 'rejected' && (
                <Button variant="red" size="sm" onClick={() => updateStatus(String(listing.id || ''), 'rejected')}>
                  Reject
                </Button>
              )}
            </div>
          </Card>
        ))}
      </main>
    </div>
  );
}

