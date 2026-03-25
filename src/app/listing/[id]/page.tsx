'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, Clock, Shield, Car, Heart, Share2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { useAuthStore, useVehicleStore, useBookingStore, useSavedListingsStore } from '@/lib/store';
import type { Listing } from '@/types';

const demoListing: Listing = {
  id: '1',
  owner_id: 'owner-1',
  title: 'Colombo City Centre Parking',
  description: 'Secure underground parking in the heart of Colombo. This premium parking facility offers 24/7 security, CCTV surveillance, and easy access to major commercial areas. Perfect for business professionals and shoppers.',
  address: 'No. 123, York Street, Colombo 01',
  city: 'Colombo',
  district: 'Colombo',
  latitude: 6.9271,
  longitude: 79.8612,
  price_per_hour: 350,
  price_per_day: 2500,
  images: [],
  amenities: ['CCTV', 'Security', 'Covered', 'EV Charging', 'Elevator', 'Waiting Area'],
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
};

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const lang: string = 'en';
  
  const user = useAuthStore((state) => state.user);
  const vehicles = useVehicleStore((state) => state.vehicles);
  const defaultVehicle = useVehicleStore((state) => state.defaultVehicle);
  const addBooking = useBookingStore((state) => state.addBooking);
  const savedListings = useSavedListingsStore((state) => state.savedListings);
  const toggleSaved = useSavedListingsStore((state) => state.toggleSaved);
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [selectedVehicle, setSelectedVehicle] = useState(defaultVehicle?.id || '');
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  
  const isSaved = savedListings.some((l) => l.id === listing?.id);

  useEffect(() => {
    // Simulate fetching listing
    setTimeout(() => {
      setListing(demoListing);
    }, 300);
  }, [params.id]);

  const calculateTotal = () => {
    if (!listing) return { hours: 0, subtotal: 0, platformFee: 0, total: 0 };
    
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    let hours = (endH + endM / 60) - (startH + startM / 60);
    if (hours <= 0) hours += 24;
    
    const subtotal = hours * listing.price_per_hour;
    const platformFee = subtotal * 0.05;
    const total = subtotal + platformFee;
    
    return { hours, subtotal, platformFee, total };
  };

  const handleBooking = async () => {
    if (!listing || !user) return;
    
    setIsLoading(true);
    
    // Simulate booking
    setTimeout(() => {
      const booking = {
        id: 'booking-' + Date.now(),
        listing_id: listing.id,
        driver_id: user.id,
        vehicle_id: selectedVehicle || 'vehicle-1',
        start_time: new Date(selectedDate).toISOString().split('T')[0] + 'T' + startTime,
        end_time: new Date(selectedDate).toISOString().split('T')[0] + 'T' + endTime,
        total_hours: calculateTotal().hours,
        subtotal: calculateTotal().subtotal,
        platform_fee: calculateTotal().platformFee,
        total_amount: calculateTotal().total,
        status: 'confirmed' as const,
        payment_status: 'paid' as const,
        payment_method: 'wallet' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      addBooking(booking);
      setIsLoading(false);
      router.push('/bookings?success=true');
    }, 1500);
  };

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header showBack backUrl="/search" />
        <div className="p-5 space-y-4">
          <div className="h-48 bg-gray-2 rounded-2xl animate-pulse" />
          <div className="h-8 bg-gray-2 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-2 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  const { hours, subtotal, platformFee, total } = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-1 pb-32">
      <Header transparent />
      
      {/* Image Gallery */}
      <div className="relative h-64 bg-gradient-to-br from-gray-2 to-gray-1">
        <div className="absolute inset-0 flex items-center justify-center">
          <Car size={64} className="text-gray-3" />
        </div>
        
        {/* Image Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentImage === i ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
        {/* Actions */}
        <div className="absolute top-16 right-4 flex gap-2">
          <button
            onClick={() => toggleSaved(listing)}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md"
          >
            <Heart
              size={20}
              className={isSaved ? 'text-red fill-red' : 'text-gray-6'}
            />
          </button>
          <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md">
            <Share2 size={20} className="text-gray-6" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-t-[28px] -mt-6 relative z-10 px-5 pt-6">
        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-7">{listing.title}</h1>
            <p className="text-gray-4 flex items-center gap-1 mt-1">
              <MapPin size={14} />
              {listing.address}
            </p>
          </div>
          <Badge variant="green">
            <Star size={12} className="mr-1 fill-yellow text-yellow" />
            {listing.rating}
          </Badge>
        </div>
        
        {/* Quick Info */}
        <div className="flex items-center gap-4 mt-4 py-4 border-t border-b border-gray-2">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-orange" />
            <span className="text-sm font-medium text-gray-6">
              {listing.is_24_hours ? '24/7' : `${listing.operating_hours_start} - ${listing.operating_hours_end}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-green" />
            <span className="text-sm font-medium text-gray-6">Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <Car size={18} className="text-blue" />
            <span className="text-sm font-medium text-gray-6">
              {listing.available_spaces} spaces
            </span>
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-4">
          <h2 className="font-semibold text-gray-7 mb-2">
            {lang === 'si' ? 'විස්තරය' : lang === 'ta' ? 'விளக்கம்' : 'About'}
          </h2>
          <p className="text-gray-5 text-sm leading-relaxed">{listing.description}</p>
        </div>
        
        {/* Amenities */}
        <div className="mt-4">
          <h2 className="font-semibold text-gray-7 mb-3">
            {lang === 'si' ? 'පහසුකම්' : lang === 'ta' ? 'வசதிகள்' : 'Amenities'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {listing.amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-1 rounded-lg text-sm font-medium text-gray-6"
              >
                {amenity === 'CCTV' && <Shield size={14} className="text-blue" />}
                {amenity === 'Security' && <Shield size={14} className="text-green" />}
                {amenity === 'Covered' && <Shield size={14} className="text-orange" />}
                {amenity}
              </span>
            ))}
          </div>
        </div>
        
        {/* Reviews */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-7">
              {lang === 'si' ? 'ශ්‍රේණි' : lang === 'ta' ? 'மதிப்புரைகள்' : 'Reviews'}
            </h2>
            <Link href={`/listing/${listing.id}/reviews`} className="text-orange text-sm font-semibold">
              {lang === 'si' ? 'බලන්න' : lang === 'ta' ? 'பார்க்க' : 'See All'}
            </Link>
          </div>
          
          <Card className="bg-gray-1 border-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange/20 rounded-full flex items-center justify-center text-orange font-bold text-lg">
                A
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-7">Amal Silva</p>
                <p className="text-sm text-gray-4">Great parking spot! Very secure and convenient.</p>
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow fill-yellow" />
                <span className="text-sm font-medium">5.0</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-2 p-4 pb-safe">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-4">
              {lang === 'si' ? 'පැයට' : lang === 'ta' ? 'மணித்தோற்றம்' : 'per hour'}
            </p>
            <p className="text-2xl font-bold text-orange">
              Rs. {listing.price_per_hour.toLocaleString('en-LK')}
            </p>
          </div>
          <Button onClick={() => setShowBookingSheet(true)}>
            {lang === 'si' ? 'වෙන්කරන්න' : lang === 'ta' ? 'முன்பதிவு செய்' : 'Book Now'}
          </Button>
        </div>
      </div>

      {/* Booking Sheet */}
      {showBookingSheet && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end animate-[fadeIn_0.2s]">
          <div className="bg-white rounded-t-[28px] w-full p-6 max-h-[85vh] overflow-y-auto animate-[slideUp_0.3s_cubic-bezier(0.32,0.72,0,1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-7">
                {lang === 'si' ? 'වෙන්කරවීම' : lang === 'ta' ? 'முன்பதிவு' : 'Book Parking'}
              </h2>
              <button onClick={() => setShowBookingSheet(false)} className="p-2">
                <ChevronLeft size={24} className="text-gray-4 rotate-90" />
              </button>
            </div>
            
            {/* Date Selection */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-4 uppercase tracking-wider mb-2">
                {lang === 'si' ? 'දිනය' : lang === 'ta' ? 'தேதி' : 'Date'}
              </label>
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full px-4 py-3 bg-gray-1 rounded-xl text-gray-7"
              />
            </div>
            
            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-4 uppercase tracking-wider mb-2">
                  {lang === 'si' ? 'ආරම්භ වේලාව' : lang === 'ta' ? 'தொடக்க நேரம்' : 'Start Time'}
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-1 rounded-xl text-gray-7"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-4 uppercase tracking-wider mb-2">
                  {lang === 'si' ? 'අවසන් වේලාව' : lang === 'ta' ? 'முடிவு நேரம்' : 'End Time'}
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-1 rounded-xl text-gray-7"
                />
              </div>
            </div>
            
            {/* Price Breakdown */}
            <div className="bg-gray-1 rounded-xl p-4 mb-4">
              <div className="price-row">
                <span className="text-gray-5">
                  Rs. {listing.price_per_hour} x {hours.toFixed(1)} hours
                </span>
                <span className="text-gray-7">Rs. {subtotal.toLocaleString('en-LK')}</span>
              </div>
              <div className="price-row">
                <span className="text-gray-5">Platform fee (5%)</span>
                <span className="text-gray-7">Rs. {platformFee.toLocaleString('en-LK')}</span>
              </div>
              <div className="price-row total">
                <span>{lang === 'si' ? 'මුළු' : lang === 'ta' ? 'மொத்த' : 'Total'}</span>
                <span className="text-orange">Rs. {total.toLocaleString('en-LK')}</span>
              </div>
            </div>
            
            <Button fullWidth onClick={handleBooking} isLoading={isLoading}>
              {lang === 'si' ? 'වෙන්කරන්න' : lang === 'ta' ? 'முன்பதிவு செய்' : 'Confirm Booking'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
