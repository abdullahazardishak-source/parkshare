'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { useAuthStore } from '@/lib/store';

export default function NotificationsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [notifications, setNotifications] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/notifications?userId=${encodeURIComponent(user.id)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load notifications');
      setNotifications(json.notifications || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load notifications');
    }
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

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
        <h1 className="font-bold text-base text-gray-7">Notifications</h1>
      </header>

      <div className="px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-gray-5" />
            <p className="text-sm text-gray-4">Latest updates</p>
          </div>
          <Button variant="secondary" onClick={() => router.refresh()}>
            Refresh
          </Button>
        </div>
        {error && <p className="text-sm text-red mb-3">{error}</p>}

        <div className="space-y-3">
          {notifications.map((n) => (
            <Card key={String(n.id || '')} className="flex items-start gap-3">
              <div className="pt-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${!Boolean(n.is_read) ? 'bg-orange-pale' : 'bg-gray-1'}`}>
                  <Bell size={18} className={!Boolean(n.is_read) ? 'text-orange' : 'text-gray-4'} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-7 truncate">{String(n.title || '')}</p>
                  <span className="text-xs text-gray-4 flex-shrink-0">{new Date(String(n.created_at || new Date().toISOString())).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-4 mt-1">{String(n.message || '')}</p>
                {!Boolean(n.is_read) && (
                  <div className="mt-2">
                    <Badge variant="orange">New</Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

