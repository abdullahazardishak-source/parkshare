'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MapPin, Search, Star, Clock, Wallet, Car, Bell } from 'lucide-react';
import { Header, BottomNav } from '@/components/layout';
import { Card, Badge, Skeleton } from '@/components/ui';
import { useAuthStore, useBookingStore } from '@/lib/store';
import type { Listing } from '@/types';

// Demo listings data
const demoListings: Listing[] = [
  {
    id: '1',
    owner_id: 'owner-1',
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
    amenities: ['CCTV', 'Security', 'Covered', 'EV Charging'],
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
    id: '2',
    owner_id: 'owner-2',
    title: 'Galle Face Hotel Parking',
    description: 'Premium parking near Galle Face Green',
    address: 'Galle Road, Colombo 03',
    city: 'Colombo',
    district: 'Colombo',
    latitude: 6.9196,
    longitude: 79.8423,
    price_per_hour: 500,
    price_per_day: 3500,
    images: [],
    amenities: ['Valet', 'CCTV', 'Security', 'Car Wash'],
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
  {
    id: '3',
    owner_id: 'owner-3',
    title: 'Kandy Mall Parking',
    description: 'Convenient parking at Kandy Mall',
    address: 'Kandy Mall, Kandy',
    city: 'Kandy',
    district: 'Kandy',
    latitude: 7.2906,
    longitude: 80.6337,
    price_per_hour: 200,
    price_per_day: 1500,
    images: [],
    amenities: ['CCTV', 'Security', 'Elevator Access'],
    vehicle_types: ['car', 'motorcycle', 'van'],
    total_spaces: 100,
    available_spaces: 45,
    operating_hours_start: '08:00',
    operating_hours_end: '22:00',
    is_24_hours: false,
    status: 'approved',
    verification_status: 'verified',
    rating: 4.5,
    review_count: 234,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    owner_id: 'owner-4',
    title: 'Negombo Beach Parking',
    description: 'Beach side parking for tourists',
    address: 'Beach Road, Negombo',
    city: 'Negombo',
    district: 'Gampaha',
    latitude: 7.2083,
    longitude: 79.8358,
    price_per_hour: 150,
    price_per_day: 1000,
    images: [],
    amenities: ['Security', 'Beach Access'],
    vehicle_types: ['car', 'motorcycle'],
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
];

function DashboardContent() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  
  const user = useAuthStore((state) => state.user);
  const bookings = useBookingStore((state) => state.bookings);
  
  const [nearbyListings, setNearbyListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/listings');
        const json = await res.json();
        if (!res.ok) throw new Error('Failed to load listings');
        setNearbyListings((json.listings || []) as Listing[]);
      } catch {
        setNearbyListings(demoListings);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (lang === 'si') {
      if (hour < 12) return 'සුබ උදෑසනක්!';
      if (hour < 18) return 'සුබ දවසක්!';
      return 'සුබ සන්ධ්‍යාවක්!';
    }
    if (lang === 'ta') {
      if (hour < 12) return 'கிருபைக்கு!';
      if (hour < 18) return 'மதியத்துக்கு!';
      return 'மாலைக்கு!';
    }
    if (hour < 12) return 'Good morning!';
    if (hour < 18) return 'Good afternoon!';
    return 'Good evening!';
  };

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString('en-LK')}`;
  };

  return (
    <div className="min-h-screen bg-gray-1 pb-20">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-orange to-orange-2 px-5 pt-4 pb-16 rounded-b-[40px]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm">
              {lang === 'si' ? 'ආයුබෝවන්' : lang === 'ta' ? 'வரவேற்கிறோம்' : 'Welcome back'}
            </p>
            <h1 className="text-2xl font-bold text-white">{getGreeting()}</h1>
          </div>
          <Link href="/notifications" className="relative p-3 bg-white/20 rounded-full">
            <Bell size={20} className="text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red rounded-full text-white text-xs flex items-center justify-center font-bold">
              3
            </span>
          </Link>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Link href="/wallet" className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
              <Wallet size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs">
                {lang === 'si' ? ' wallet' : lang === 'ta' ? 'கWallet' : 'Wallet'}
              </p>
              <p className="text-white font-bold">Rs. {user?.wallet_balance?.toLocaleString() || '5,000'}</p>
            </div>
          </Link>
          <Link href="/bookings" className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs">
                {lang === 'si' ? ' bookings' : lang === 'ta' ? 'முன்பதிவுகள்' : 'Bookings'}
              </p>
              <p className="text-white font-bold">{bookings.length || 2}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-5 -mt-10 relative z-10">
        <Link
          href="/search"
          className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-card"
        >
          <Search size={20} className="text-gray-4" />
          <span className="text-gray-4">
            {lang === 'si'
              ? 'ගාල් ඉඩ පෙට්ටියක් හොයන්න...'
              : lang === 'ta'
              ? 'நிறுத்து இடம் தேட...'
              : 'Search for parking...'}
          </span>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mt-6">
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
          {[
            { icon: MapPin, label: lang === 'si' ? 'ළඟම' : lang === 'ta' ? 'அருகில்' : 'Nearby', href: '/search?filter=nearby' },
            { icon: Car, label: lang === 'si' ? 'මගේ වාහන' : lang === 'ta' ? 'என் வாகனம்' : 'My Vehicle', href: '/profile/vehicles' },
            { icon: Wallet, label: lang === 'si' ? ' Wallet' : lang === 'ta' ? ' Wallet' : 'Wallet', href: '/wallet' },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="flex-shrink-0 flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-card min-w-[90px]"
            >
              <div className="w-12 h-12 bg-orange-pale rounded-xl flex items-center justify-center">
                <action.icon size={22} className="text-orange" />
              </div>
              <span className="text-xs font-medium text-gray-6">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Nearby Parking */}
      <div className="mt-6">
        <div className="flex items-center justify-between px-5 mb-4">
          <h2 className="text-lg font-bold text-gray-7">
            {lang === 'si' ? 'ළඟ පිහිටි ගාල්' : lang === 'ta' ? 'அருகில் உள்ள நிறுத்து' : 'Nearby Parking'}
          </h2>
          <Link href="/search" className="text-orange text-sm font-semibold">
            {lang === 'si' ? 'බලන්න' : lang === 'ta' ? 'பார்க்க' : 'See All'}
          </Link>
        </div>
        
        {isLoading ? (
          <div className="space-y-3 px-5">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-card">
                <div className="flex gap-4">
                  <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 px-5">
            {nearbyListings.slice(0, 3).map((listing) => (
              <Link key={listing.id} href={`/listing/${listing.id}`}>
                <Card className="flex gap-4">
                  {/* Image Placeholder */}
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-gray-2 to-gray-1 flex items-center justify-center flex-shrink-0">
                    <Car size={32} className="text-gray-3" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-7 truncate">{listing.title}</h3>
                      {listing.verification_status === 'verified' && (
                        <Badge variant="green">Verified</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-4 flex items-center gap-1 mt-1">
                      <MapPin size={12} />
                      {listing.city}, {listing.district}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-sm text-gray-5">
                        <Star size={14} className="text-yellow fill-yellow" />
                        {listing.rating}
                      </span>
                      <span className="text-sm text-gray-4">
                        ({listing.review_count} {lang === 'si' ? 'ලිපි' : lang === 'ta' ? 'மதிப்புரைகள்' : 'reviews'})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-lg font-bold text-orange">
                        {formatPrice(listing.price_per_hour)}
                        <span className="text-xs font-normal text-gray-4">/hr</span>
                      </p>
                      <span className="text-xs text-green">
                        {listing.available_spaces} {lang === 'si' ? 'ඉඩ' : lang === 'ta' ? 'இடங்கள்' : 'spaces'}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Bookings */}
      {bookings.length > 0 && (
        <div className="mt-6 mb-6">
          <div className="flex items-center justify-between px-5 mb-4">
            <h2 className="text-lg font-bold text-gray-7">
              {lang === 'si' ? 'මෑත වෙන්කරවීම්' : lang === 'ta' ? 'சமீபத்திய முன்பதிவுகள்' : 'Recent Bookings'}
            </h2>
            <Link href="/bookings" className="text-orange text-sm font-semibold">
              {lang === 'si' ? 'බලන්න' : lang === 'ta' ? 'பார்க்க' : 'See All'}
            </Link>
          </div>
          
          <div className="px-5">
            <Card className="flex gap-3">
              <div className="w-16 h-12 rounded-lg bg-gray-2 flex items-center justify-center">
                <Car size={20} className="text-gray-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-7">Colombo City Centre</p>
                <p className="text-sm text-gray-4">Today, 2:00 PM - 5:00 PM</p>
              </div>
              <Badge variant="green">Confirmed</Badge>
            </Card>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-1" />}>
      <DashboardContent />
    </Suspense>
  );
}
