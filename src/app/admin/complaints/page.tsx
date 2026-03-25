'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await fetch('/api/admin/complaints');
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load complaints');
      setComplaints(json.complaints || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load complaints');
    }
  };
  useEffect(() => {
    void load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    await fetch('/api/admin/complaints', {
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
        <h1 className="text-xl font-bold text-gray-7">Admin / Complaints</h1>
      </header>

      <main className="p-6 space-y-4">
        {error && <p className="text-red text-sm">{error}</p>}
        {complaints.map((complaint) => (
          <Card key={String(complaint.id || '')} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-pale flex items-center justify-center">
                <AlertTriangle size={18} className="text-red" />
              </div>
              <div>
                <p className="font-semibold text-gray-7">{String(complaint.subject || '')}</p>
                <p className="text-sm text-gray-4">{String(complaint.booking_id || '')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  String(complaint.status || '') === 'resolved'
                    ? 'green'
                    : String(complaint.status || '') === 'investigating'
                    ? 'blue'
                    : 'red'
                }
              >
                {String(complaint.status || '')}
              </Badge>
              {String(complaint.status || '') !== 'resolved' && (
                <Button variant="secondary" size="sm" onClick={() => setStatus(String(complaint.id || ''), 'resolved')}>
                  Resolve
                </Button>
              )}
            </div>
          </Card>
        ))}
      </main>
    </div>
  );
}

