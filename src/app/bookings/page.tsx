'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Car, X, Star } from 'lucide-react';
import { Header, BottomNav } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { useBookingStore, useAuthStore } from '@/lib/store';
import type { Booking } from '@/types';

const demoBookings: Booking[] = [
  {
    id: 'booking-1',
    listing_id: '1',
    driver_id: 'demo-user-1',
    vehicle_id: 'vehicle-1',
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
    listing: {
      id: '1',
      owner_id: 'owner-1',
      title: 'Colombo City Centre Parking',
      description: '',
      address: 'No. 123, York Street, Colombo 01',
      city: 'Colombo',
      district: 'Colombo',
      latitude: 6.9271,
      longitude: 79.8612,
      price_per_hour: 350,
      price_per_day: 2500,
      images: [],
      amenities: [],
      vehicle_types: ['car'],
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
  },
  {
    id: 'booking-2',
    listing_id: '2',
    driver_id: 'demo-user-1',
    vehicle_id: 'vehicle-1',
    start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    total_hours: 2,
    subtotal: 700,
    platform_fee: 35,
    total_amount: 735,
    status: 'completed',
    payment_status: 'paid',
    payment_method: 'wallet',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    listing: {
      id: '2',
      owner_id: 'owner-2',
      title: 'Galle Face Hotel Parking',
      description: '',
      address: 'Galle Road, Colombo 03',
      city: 'Colombo',
      district: 'Colombo',
      latitude: 6.9196,
      longitude: 79.8423,
      price_per_hour: 350,
      price_per_day: 2500,
      images: [],
      amenities: [],
      vehicle_types: ['car'],
      total_spaces: 30,
      available_spaces: 5,
      operating_hours_start: '00:00',
      operating_hours_end: '23:59',
      is_24_hours: true,
      status: 'approved',
      verification_status: 'verified',
      rating: 4.9,
      review_count: 89,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'booking-3',
    listing_id: '4',
    driver_id: 'demo-user-1',
    vehicle_id: 'vehicle-1',
    start_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 50 * 60 * 60 * 1000).toISOString(),
    total_hours: 2,
    subtotal: 300,
    platform_fee: 15,
    total_amount: 315,
    status: 'cancelled',
    payment_status: 'refunded',
    payment_method: 'wallet',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    listing: {
      id: '4',
      owner_id: 'owner-4',
      title: 'Negombo Beach Parking',
      description: '',
      address: 'Beach Road, Negombo',
      city: 'Negombo',
      district: 'Gampaha',
      latitude: 7.2083,
      longitude: 79.8358,
      price_per_hour: 150,
      price_per_day: 1000,
      images: [],
      amenities: [],
      vehicle_types: ['car'],
      total_spaces: 25,
      available_spaces: 18,
      operating_hours_start: '06:00',
      operating_hours_end: '20:00',
      is_24_hours: false,
      status: 'approved',
      verification_status: 'verified',
      rating: 4.3,
      review_count: 67,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

function BookingsContent() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const success = searchParams.get('success');
  
  const user = useAuthStore((state) => state.user);
  const bookings = useBookingStore((state) => state.bookings);
  const setBookings = useBookingStore((state) => state.setBookings);
  const allBookings = bookings.length > 0 ? bookings : demoBookings;

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/bookings?driverId=${encodeURIComponent(user.id)}`);
        const json = await res.json();
        if (!res.ok) throw new Error('Failed to load bookings');
        setBookings((json.bookings || []) as Booking[]);
      } catch {
        // Keep demo fallback
      }
    };
    void load();
  }, [setBookings, user?.id]);
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const upcomingBookings = allBookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');
  const completedBookings = allBookings.filter((b) => b.status === 'completed');
  const cancelledBookings = allBookings.filter((b) => b.status === 'cancelled');

  const getBookingsByTab = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingBookings;
      case 'completed':
        return completedBookings;
      case 'cancelled':
        return cancelledBookings;
      default:
        return [];
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-LK', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-LK', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'pending':
        return <Badge variant="blue">{status}</Badge>;
      case 'completed':
        return <Badge variant="green">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="red">Cancelled</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-1 pb-20">
      <Header title={lang === 'si' ? 'වෙන්කරවීම්' : lang === 'ta' ? 'முன்பதிவுகள்' : 'My Bookings'} />
      
      {/* Success Banner */}
      {success && (
        <div className="mx-4 mt-4 bg-green-pale border border-green/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-green rounded-full flex items-center justify-center text-white font-bold">
            ✓
          </div>
          <div>
            <p className="font-semibold text-green">
              {lang === 'si' ? 'වෙන්කරවීම සාර්ථකයි!' : lang === 'ta' ? 'முன்பதிவு வெற்றியடைந்தது!' : 'Booking Successful!'}
            </p>
            <p className="text-sm text-green/80">
              {lang === 'si'
                ? 'ඔබේ වෙන්කරවීම තහවුරු කර ඇත'
                : lang === 'ta'
                ? 'உங்கள் முன்பதிவு உறுதிப்படுத்தப்பட்டது'
                : 'Your parking space has been reserved'}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="flex bg-gray-2 rounded-xl p-1">
          {[
            { key: 'upcoming', label: lang === 'si' ? 'ඉදිරියේ' : lang === 'ta' ? 'வரவிருக்கும்' : 'Upcoming' },
            { key: 'completed', label: lang === 'si' ? 'අවසන්' : lang === 'ta' ? 'முடிவடைந்த' : 'Completed' },
            { key: 'cancelled', label: lang === 'si' ? 'අවලංගු' : lang === 'ta' ? 'ரத்து' : 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`
                flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all
                ${activeTab === tab.key
                  ? 'bg-white text-gray-7 shadow-sm'
                  : 'text-gray-4'
                }
              `}
            >
              {tab.label}
              <span className="ml-1 text-xs">
                {tab.key === 'upcoming' && `(${upcomingBookings.length})`}
                {tab.key === 'completed' && `(${completedBookings.length})`}
                {tab.key === 'cancelled' && `(${cancelledBookings.length})`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="p-4 space-y-3">
        {getBookingsByTab().length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-2 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-gray-3" />
            </div>
            <p className="text-gray-5 font-medium">
              {lang === 'si'
                ? 'කිසිදු වෙන්කරවීමක් නැත'
                : lang === 'ta'
                ? 'முன்பதிவுகள் இல்லை'
                : 'No bookings yet'}
            </p>
            <Link href="/search">
              <Button variant="ghost" className="mt-4">
                {lang === 'si' ? 'ගාල් සොයන්න' : lang === 'ta' ? 'நிறுத்து தேடு' : 'Find Parking'}
              </Button>
            </Link>
          </div>
        ) : (
          getBookingsByTab().map((booking) => (
            <Card key={booking.id} className="flex gap-3" onClick={() => setSelectedBooking(booking)}>
              <div className="w-20 h-16 rounded-xl bg-gray-2 flex items-center justify-center flex-shrink-0">
                <Car size={24} className="text-gray-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-7 truncate">
                    {booking.listing?.title || 'Parking'}
                  </h3>
                  {getStatusBadge(booking.status)}
                </div>
                
                <p className="text-sm text-gray-4 flex items-center gap-1 mt-1">
                  <Calendar size={12} />
                  {formatDate(booking.start_time)}
                </p>
                
                <p className="text-sm text-gray-4 flex items-center gap-1">
                  <Clock size={12} />
                  {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <p className="font-bold text-orange">
                    Rs. {booking.total_amount.toLocaleString('en-LK')}
                  </p>
                  {booking.status === 'completed' && (
                    <button className="text-orange text-sm font-medium flex items-center gap-1">
                      <Star size={14} />
                      {lang === 'si' ? 'ශ්‍රේණියක් දෙන්න' : lang === 'ta' ? 'மதிப்புரைக்க' : 'Rate'}
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Booking Detail Sheet */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end animate-[fadeIn_0.2s]">
          <div className="bg-white rounded-t-[28px] w-full p-6 max-h-[85vh] overflow-y-auto animate-[slideUp_0.3s_cubic-bezier(0.32,0.72,0,1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-7">
                {lang === 'si' ? 'වෙන්කරවීමේ විස්තර' : lang === 'ta' ? 'முன்பதிவு விவரங்கள்' : 'Booking Details'}
              </h2>
              <button onClick={() => setSelectedBooking(null)} className="p-2">
                <X size={24} className="text-gray-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-1 rounded-xl p-4">
                <h3 className="font-semibold text-gray-7">
                  {selectedBooking.listing?.title}
                </h3>
                <p className="text-sm text-gray-4 flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  {selectedBooking.listing?.address}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-1 rounded-xl p-4">
                  <p className="text-xs text-gray-4 uppercase">Date</p>
                  <p className="font-semibold text-gray-7 mt-1">
                    {formatDate(selectedBooking.start_time)}
                  </p>
                </div>
                <div className="bg-gray-1 rounded-xl p-4">
                  <p className="text-xs text-gray-4 uppercase">Time</p>
                  <p className="font-semibold text-gray-7 mt-1">
                    {formatTime(selectedBooking.start_time)} - {formatTime(selectedBooking.end_time)}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-1 rounded-xl p-4">
                <div className="price-row">
                  <span className="text-gray-5">Duration</span>
                  <span className="text-gray-7">{selectedBooking.total_hours} hours</span>
                </div>
                <div className="price-row">
                  <span className="text-gray-5">Subtotal</span>
                  <span className="text-gray-7">Rs. {selectedBooking.subtotal.toLocaleString('en-LK')}</span>
                </div>
                <div className="price-row">
                  <span className="text-gray-5">Platform fee</span>
                  <span className="text-gray-7">Rs. {selectedBooking.platform_fee.toLocaleString('en-LK')}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span className="text-orange">Rs. {selectedBooking.total_amount.toLocaleString('en-LK')}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                {selectedBooking.status === 'confirmed' && (
                  <>
                    <Button
                      variant="red"
                      fullWidth
                      onClick={() => setShowCancelModal(true)}
                    >
                      {lang === 'si' ? 'අවලංගු කරන්න' : lang === 'ta' ? 'ரத்து செய்' : 'Cancel Booking'}
                    </Button>
                    <Button fullWidth>
                      {lang === 'si' ? 'ගාල් වෙත යන්න' : lang === 'ta' ? 'நிறுத்து இடத்திற்கு செல்' : 'Navigate'}
                    </Button>
                  </>
                )}
                {selectedBooking.status === 'completed' && (
                  <Button fullWidth>
                    {lang === 'si' ? 'ශ්‍රේණියක් දෙන්න' : lang === 'ta' ? 'மதிப்புரைக்க' : 'Write a Review'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 animate-[fadeIn_0.2s]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-[pop_0.25s_cubic-bezier(0.32,0.72,0,1)]">
            <h3 className="text-lg font-bold text-gray-7 mb-2">
              {lang === 'si' ? 'වෙන්කරවීම අවලංගු කරන්නද?' : lang === 'ta' ? 'முன்பதிவை ரத்து செய்யவா?' : 'Cancel Booking?'}
            </h3>
            <p className="text-gray-4 text-sm mb-6">
              {lang === 'si'
                ? 'මෙම ක්‍රියාව පරතරයක් නැතිව අපේක්ෂා කළ නොහැක'
                : lang === 'ta'
                ? 'இந்த செயலை மீளக் கூடாது'
                : 'This action cannot be undone'}
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setShowCancelModal(false)}>
                {lang === 'si' ? 'ඉන්න' : lang === 'ta' ? 'இரு' : 'Keep'}
              </Button>
              <Button
                variant="red"
                fullWidth
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                }}
              >
                {lang === 'si' ? 'අවලංගු කරන්න' : lang === 'ta' ? 'ரத்து செய்' : 'Cancel'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-1" />}>
      <BookingsContent />
    </Suspense>
  );
}
