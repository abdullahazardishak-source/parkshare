'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, Shield, Bell } from 'lucide-react';
import { Card, Button } from '@/components/ui';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load settings');
      setSettings(json.settings || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load settings');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const saveDefaultRule = async () => {
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'moderation_rules',
        value: { autoApproveVerifiedOwners: false, requireManualReview: true },
      }),
    });
    await load();
  };

  return (
    <div className="min-h-screen bg-gray-1">
      <header className="bg-white border-b border-gray-2 px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/admin" className="p-2 rounded-lg hover:bg-gray-1" aria-label="Back to admin dashboard">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold text-gray-7">Admin / Settings</h1>
      </header>

      <main className="p-6 space-y-4">
        {error && <p className="text-red text-sm">{error}</p>}
        <Card className="flex items-center gap-3">
          <Settings size={20} className="text-gray-5" />
          <div className="flex-1">
            <p className="font-semibold text-gray-7">Platform settings</p>
            <p className="text-sm text-gray-4">Configure defaults and moderation rules.</p>
          </div>
          <Button size="sm" onClick={saveDefaultRule}>Save</Button>
        </Card>

        <Card className="flex items-center gap-3">
          <Shield size={20} className="text-gray-5" />
          <div>
            <p className="font-semibold text-gray-7">Admin access controls</p>
            <p className="text-sm text-gray-4">Role and permission management (demo).</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <Bell size={20} className="text-gray-5" />
          <div>
            <p className="font-semibold text-gray-7">Notification rules</p>
            <p className="text-sm text-gray-4">Booking and complaint alert preferences.</p>
          </div>
        </Card>

        {settings.length > 0 && (
          <Card>
            <p className="font-semibold text-gray-7 mb-2">Saved settings</p>
            <div className="space-y-2">
              {settings.map((setting) => (
                <div key={String(setting.key || '')} className="text-sm text-gray-5">
                  <span className="font-semibold text-gray-7">{String(setting.key || '')}</span>: {JSON.stringify(setting.value)}
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

