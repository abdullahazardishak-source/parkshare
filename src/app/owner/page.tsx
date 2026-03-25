'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, DollarSign, Car, BarChart3, Settings, Shield, Clock, MapPin, Eye, Edit, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import type { Listing, Booking } from '@/types';

const demoOwnerListings: Listing[] = [
  {
    id: 'owner-1',
    owner_id: 'demo-user-1',
    title: 'Colombo City Centre Parking',
    description: 'Secure underground parking in the heart of Colombo',
    address: 'No. 123, York Street, Colombo 01',
    city: 'Colombo',
    district: 'Colombo',
    latitude: 6.9271,
    longitude: 79.8612,
    price_per_hour: 350,
    price_per_day: 2500,
    images: [],
    amenities: ['CCTV', 'Security', 'Covered'],
    vehicle_types: ['car', 'motorcycle'],
    total_spaces: 50,
    available_spaces: 12,
    operating_hours_start: '06:00',
    operating_hours_end: '23:00',
    is_24_hours: false,
    status: 'approved',
    verification_status: 'verified',
    rating: 4.8,
    review_count: 156,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'owner-2',
    owner_id: 'demo-user-1',
    title: 'Nugegoda Mall Parking',
    description: 'Convenient parking at Nugegoda Mall',
    address: 'Nugegoda Mall, Nugegoda',
    city: 'Nugegoda',
    district: 'Colombo',
    latitude: 6.8648,
    longitude: 79.8782,
    price_per_hour: 250,
    price_per_day: 1800,
    images: [],
    amenities: ['CCTV', 'Security', 'Elevator'],
    vehicle_types: ['car'],
    total_spaces: 30,
    available_spaces: 8,
    operating_hours_start: '08:00',
    operating_hours_end: '22:00',
    is_24_hours: false,
    status: 'pending',
    verification_status: 'pending',
    rating: 4.5,
    review_count: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const demoBookings: Booking[] = [
  {
    id: 'b1',
    listing_id: 'owner-1',
    driver_id: 'driver-1',
    vehicle_id: 'v1',
    start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    total_hours: 3,
    subtotal: 1050,
    platform_fee: 52.5,
    total_amount: 1102.5,
    status: 'confirmed',
    payment_status: 'paid',
    payment_method: 'wallet',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'b2',
    listing_id: 'owner-1',
    driver_id: 'driver-2',
    vehicle_id: 'v2',
    start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    total_hours: 2,
    subtotal: 700,
    platform_fee: 35,
    total_amount: 735,
    status: 'completed',
    payment_status: 'paid',
    payment_method: 'wallet',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function OwnerDashboardPage() {
  const lang: string = 'en';
  const [listings, setListings] = useState<Listing[]>(demoOwnerListings);
  const [bookings] = useState<Booking[]>(demoBookings);
  
  const totalEarnings = bookings.reduce((sum, b) => sum + (b.subtotal - b.platform_fee), 0);
  const pendingEarnings = bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.subtotal - b.platform_fee), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="green">Active</Badge>;
      case 'pending':
        return <Badge variant="blue">Pending</Badge>;
      case 'rejected':
        return <Badge variant="red">Rejected</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-1 pb-6">
      <Header title={lang === 'si' ? 'Owner Dashboard' : lang === 'ta' ? 'உரிமையாளர் Dashboard' : 'Owner Dashboard'} />
      
      {/* Stats */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-orange to-orange-2 text-white">
            <DollarSign size={24} className="opacity-80" />
            <p className="text-2xl font-bold mt-2">Rs. {totalEarnings.toLocaleString('en-LK')}</p>
            <p className="text-white/80 text-sm">Total Earnings</p>
          </Card>
          <Card>
            <Clock size={24} className="text-blue" />
            <p className="text-2xl font-bold text-gray-7 mt-2">Rs. {pendingEarnings.toLocaleString('en-LK')}</p>
            <p className="text-gray-4 text-sm">Pending Payout</p>
          </Card>
          <Card>
            <Car size={24} className="text-green" />
            <p className="text-2xl font-bold text-gray-7 mt-2">{bookings.length}</p>
            <p className="text-gray-4 text-sm">Total Bookings</p>
          </Card>
          <Card>
            <Shield size={24} className="text-purple-500" />
            <p className="text-2xl font-bold text-gray-7 mt-2">{listings.filter(l => l.status === 'approved').length}</p>
            <p className="text-gray-4 text-sm">Active Listings</p>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-4">
        <div className="flex gap-3">
          <Link href="/owner/listing/create" className="flex-1">
            <Button fullWidth>
              <Plus size={18} />
              Add Listing
            </Button>
          </Link>
          <Link href="/owner/analytics">
            <Button variant="secondary">
              <BarChart3 size={18} />
            </Button>
          </Link>
          <Link href="/owner/payouts">
            <Button variant="secondary">
              <DollarSign size={18} />
            </Button>
          </Link>
        </div>
      </div>

      {/* My Listings */}
      <div className="mt-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-lg font-bold text-gray-7">My Listings</h2>
          <Link href="/owner/listings" className="text-orange text-sm font-semibold">See All</Link>
        </div>
        
        <div className="space-y-3 px-4">
          {listings.map((listing) => (
            <Card key={listing.id} className="flex gap-3">
              <div className="w-16 h-16 rounded-xl bg-gray-2 flex items-center justify-center flex-shrink-0">
                <MapPin size={24} className="text-gray-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-7 truncate">{listing.title}</h3>
                  {getStatusBadge(listing.status)}
                </div>
                
                <p className="text-sm text-gray-4 mt-1">
                  {listing.available_spaces}/{listing.total_spaces} spaces
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <p className="font-bold text-orange">
                    Rs. {listing.price_per_hour}/hr
                  </p>
                  <div className="flex gap-2">
                    <button className="p-2 bg-gray-1 rounded-lg">
                      <Eye size={16} className="text-gray-5" />
                    </button>
                    <button className="p-2 bg-gray-1 rounded-lg">
                      <Edit size={16} className="text-gray-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="mt-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-lg font-bold text-gray-7">Recent Bookings</h2>
          <Link href="/owner/bookings" className="text-orange text-sm font-semibold">See All</Link>
        </div>
        
        <div className="space-y-2 px-4">
          {bookings.slice(0, 3).map((booking) => (
            <Card key={booking.id} className="flex items-center gap-3 py-3">
              <div className="w-10 h-10 bg-orange-pale rounded-lg flex items-center justify-center">
                <Car size={18} className="text-orange" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-7 text-sm">
                  Booking #{booking.id.slice(-4)}
                </p>
                <p className="text-xs text-gray-4">
                  {new Date(booking.start_time).toLocaleDateString('en-LK')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green">
                  +Rs. {(booking.subtotal - booking.platform_fee).toLocaleString('en-LK')}
                </p>
                <Badge variant={booking.status === 'completed' ? 'green' : 'blue'}>
                  {booking.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
