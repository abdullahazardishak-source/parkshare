'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Car, Building2, DollarSign, BarChart3, AlertTriangle, CheckCircle, XCircle, Settings, Bell } from 'lucide-react';
import { Card, Badge } from '@/components/ui';

export default function AdminDashboardPage() {
  const [activeTab] = useState('dashboard');
  const [data, setData] = useState<{
    stats: {
      totalUsers: number;
      totalListings: number;
      activeBookings: number;
      pendingApprovals: number;
      openComplaints: number;
      totalRevenue: number;
    };
    pendingListings: Array<Record<string, unknown>>;
    recentBookings: Array<Record<string, unknown>>;
    openComplaints: Array<Record<string, unknown>>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load dashboard');
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/admin' },
    { key: 'users', label: 'Users', icon: Users, href: '/admin/users' },
    { key: 'listings', label: 'Listings', icon: Building2, href: '/admin/listings' },
    { key: 'bookings', label: 'Bookings', icon: Car, href: '/admin/bookings' },
    { key: 'payouts', label: 'Payouts', icon: DollarSign, href: '/admin/payouts' },
    { key: 'complaints', label: 'Complaints', icon: AlertTriangle, href: '/admin/complaints' },
    { key: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-1 flex">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-white border-r border-gray-2 flex flex-col">
        <div className="p-4 border-b border-gray-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange rounded-xl flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg hidden lg:block">ParkShare Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                ${activeTab === item.key
                  ? 'bg-orange text-white'
                  : 'text-gray-5 hover:bg-gray-1'
                }
              `}
            >
              <item.icon size={20} />
              <span className="hidden lg:block font-medium">{item.label}</span>
              {item.key === 'listings' && (data?.stats?.pendingApprovals || 0) > 0 && (
                <span className="ml-auto bg-red text-white text-xs px-2 py-0.5 rounded-full">
                  {data?.stats?.pendingApprovals || 0}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-2 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-7">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-gray-1">
              <Bell size={20} className="text-gray-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="hidden lg:block">
                <p className="font-semibold text-gray-7">Admin User</p>
                <p className="text-xs text-gray-4">admin@parkshare.lk</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {error && <p className="text-red text-sm mb-4">{error}</p>}
          {isLoading && <p className="text-gray-4 text-sm mb-4">Loading dashboard...</p>}
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-4 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-gray-7 mt-1">{(data?.stats?.totalUsers || 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-pale rounded-xl flex items-center justify-center">
                  <Users size={24} className="text-blue" />
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-4 text-sm">Total Listings</p>
                  <p className="text-2xl font-bold text-gray-7 mt-1">{data?.stats?.totalListings || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-pale rounded-xl flex items-center justify-center">
                  <Building2 size={24} className="text-green" />
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-4 text-sm">Active Bookings</p>
                  <p className="text-2xl font-bold text-gray-7 mt-1">{data?.stats?.activeBookings || 0}</p>
                </div>
                <div className="w-12 h-12 bg-orange-pale rounded-xl flex items-center justify-center">
                  <Car size={24} className="text-orange" />
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-4 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-7 mt-1">Rs. {((data?.stats?.totalRevenue || 0) / 100000).toFixed(1)}M</p>
                </div>
                <div className="w-12 h-12 bg-green-pale rounded-xl flex items-center justify-center">
                  <DollarSign size={24} className="text-green" />
                </div>
              </div>
            </Card>
          </div>

          {/* Pending Approvals */}
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-7">Pending Listing Approvals</h2>
              <Link href="/admin/listings?filter=pending" className="text-orange text-sm font-semibold">
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              {(data?.pendingListings || []).map((listing) => (
                <div key={String(listing.id || '')} className="flex items-center gap-4 p-3 bg-gray-1 rounded-xl">
                  <div className="w-12 h-12 bg-gray-2 rounded-lg flex items-center justify-center">
                    <Building2 size={20} className="text-gray-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-7">{String(listing.title || '')}</p>
                    <p className="text-sm text-gray-4">{String(listing.city || '')} • {String(listing.status || '')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-green text-white rounded-lg">
                      <CheckCircle size={18} />
                    </button>
                    <button className="p-2 bg-red-pale text-red rounded-lg">
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-7">Recent Bookings</h2>
                <Link href="/admin/bookings" className="text-orange text-sm font-semibold">
                  View All
                </Link>
              </div>
              
              <div className="space-y-3">
                {(data?.recentBookings || []).map((booking) => (
                  <div key={String(booking.id || '')} className="flex items-center gap-3 p-3 bg-gray-1 rounded-xl">
                    <div className="w-10 h-10 bg-orange-pale rounded-lg flex items-center justify-center">
                      <Car size={18} className="text-orange" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-7">{String(booking.listing_id || '')}</p>
                      <p className="text-sm text-gray-4">{String(booking.driver_id || '')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-7">Rs. {String(booking.total_amount || 0)}</p>
                      <Badge variant={String(booking.status || '') === 'completed' ? 'green' : 'blue'}>
                        {String(booking.status || '')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Open Complaints */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-7">Open Complaints</h2>
                <Link href="/admin/complaints" className="text-orange text-sm font-semibold">
                  View All
                </Link>
              </div>
              
              <div className="space-y-3">
                {(data?.openComplaints || []).map((complaint) => (
                  <div key={String(complaint.id || '')} className="flex items-center gap-3 p-3 bg-gray-1 rounded-xl">
                    <div className="w-10 h-10 bg-red-pale rounded-lg flex items-center justify-center">
                      <AlertTriangle size={18} className="text-red" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-7">{String(complaint.subject || '')}</p>
                      <p className="text-sm text-gray-4">{String(complaint.booking_id || '')}</p>
                    </div>
                    <Badge variant={String(complaint.status || '') === 'open' ? 'red' : 'blue'}>
                      {String(complaint.status || '')}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
