'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MapPin, List, SlidersHorizontal, Star, Clock, Filter, X } from 'lucide-react';
import { Header, BottomNav } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { useSearchStore } from '@/lib/store';
import type { Listing } from '@/types';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

// Demo listings
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
    title: 'Liberty Arcade Parking',
    description: 'Modern parking facility in Colombo 03',
    address: 'Liberty Arcade, Colombo 03',
    city: 'Colombo',
    district: 'Colombo',
    latitude: 6.9149,
    longitude: 79.8523,
    price_per_hour: 400,
    price_per_day: 2800,
    images: [],
    amenities: ['CCTV', 'Security', 'Elevator', 'Waiting Area'],
    vehicle_types: ['car', 'motorcycle'],
    total_spaces: 75,
    available_spaces: 22,
    operating_hours_start: '07:00',
    operating_hours_end: '22:00',
    is_24_hours: false,
    status: 'approved',
    verification_status: 'verified',
    rating: 4.6,
    review_count: 203,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    owner_id: 'owner-4',
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
    id: '5',
    owner_id: 'owner-5',
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

const cities = ['All', 'Colombo', 'Kandy', 'Negombo', 'Galle', 'Jaffna', 'Anuradhapura'];
const amenitiesList = ['CCTV', 'Security', 'Covered', 'EV Charging', 'Valet', 'Car Wash', 'Elevator'];

function SearchContent() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [sourceListings, setSourceListings] = useState<Listing[]>(demoListings);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'distance'>('distance');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/listings');
        const json = await res.json();
        if (res.ok && Array.isArray(json.listings) && json.listings.length > 0) {
          setSourceListings(json.listings as Listing[]);
        } else {
          setSourceListings(demoListings);
        }
      } catch {
        setSourceListings(demoListings);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      let filtered = [...sourceListings];
      
      if (selectedCity !== 'All') {
        filtered = filtered.filter((l) => l.city === selectedCity);
      }
      
      if (selectedAmenities.length > 0) {
        filtered = filtered.filter((l) =>
          selectedAmenities.every((a) => l.amenities.includes(a))
        );
      }
      
      filtered = filtered.filter(
        (l) => l.price_per_hour >= priceRange[0] && l.price_per_hour <= priceRange[1]
      );
      
      if (sortBy === 'price') {
        filtered.sort((a, b) => a.price_per_hour - b.price_per_hour);
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }
      
      setListings(filtered);
    }, 300);
  }, [selectedCity, selectedAmenities, priceRange, sortBy, sourceListings]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSelectedCity('All');
    setSelectedAmenities([]);
    setPriceRange([0, 5000]);
    setSortBy('distance');
  };

  const formatPrice = (price: number) => `Rs. ${price.toLocaleString('en-LK')}`;

  return (
    <div className="h-screen flex flex-col bg-gray-1">
      <Header title={lang === 'si' ? 'සෙවීම' : lang === 'ta' ? 'தேடல்' : 'Search'} />
      
      {/* Search Filters */}
      <div className="bg-white border-b border-gray-2 px-4 py-3">
        {/* City Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all
                ${selectedCity === city
                  ? 'bg-orange text-white'
                  : 'bg-gray-1 text-gray-6'
                }
              `}
            >
              {city}
            </button>
          ))}
        </div>
        
        {/* Sort/Filter Row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('distance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                sortBy === 'distance' ? 'bg-orange-pale text-orange' : 'bg-gray-1 text-gray-5'
              }`}
            >
              {lang === 'si' ? 'දුර' : lang === 'ta' ? 'தூரம்' : 'Distance'}
            </button>
            <button
              onClick={() => setSortBy('price')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                sortBy === 'price' ? 'bg-orange-pale text-orange' : 'bg-gray-1 text-gray-5'
              }`}
            >
              {lang === 'si' ? 'මිල' : lang === 'ta' ? 'விலை' : 'Price'}
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                sortBy === 'rating' ? 'bg-orange-pale text-orange' : 'bg-gray-1 text-gray-5'
              }`}
            >
              {lang === 'si' ? 'ශ්‍රේණිය' : lang === 'ta' ? 'மதிப்பீடு' : 'Rating'}
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-1 rounded-lg text-sm font-medium text-gray-6"
            >
              <Filter size={16} />
              {lang === 'si' ? 'පෙරහන්' : lang === 'ta' ? 'வடிப்பான்கள்' : 'Filters'}
              {(selectedAmenities.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000) && (
                <span className="w-2 h-2 bg-orange rounded-full" />
              )}
            </button>
            <div className="flex bg-gray-1 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List size={18} className={viewMode === 'list' ? 'text-orange' : 'text-gray-4'} />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded ${viewMode === 'map' ? 'bg-white shadow-sm' : ''}`}
              >
                <MapPin size={18} className={viewMode === 'map' ? 'text-orange' : 'text-gray-4'} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto pb-20">
        <p className="px-4 py-3 text-sm text-gray-4">
          {listings.length} {lang === 'si' ? 'ගාල් ඉඩ හමු උණු' : lang === 'ta' ? 'நிறுத்து இடங்கள் கிடைத்தன' : 'parking spaces found'}
        </p>
        
        {viewMode === 'list' ? (
          <div className="space-y-3 px-4">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/listing/${listing.id}`}>
                <Card className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-gray-2 to-gray-1 flex items-center justify-center flex-shrink-0">
                    <MapPin size={32} className="text-gray-3" />
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
                      <span className="text-xs text-green">
                        {listing.available_spaces} {lang === 'si' ? 'ඉඩ' : lang === 'ta' ? 'இடங்கள்' : 'available'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-lg font-bold text-orange">
                        {formatPrice(listing.price_per_hour)}
                        <span className="text-xs font-normal text-gray-4">/hr</span>
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="h-full w-full bg-gray-2 relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-4">
              <div className="text-center">
                <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                <p>{lang === 'si' ? 'සිතියම පූරණය වෙමින්...' : lang === 'ta' ? 'வரைபடம் ஏற்றப்படுகிறது...' : 'Loading map...'}</p>
                <p className="text-sm mt-1">
                  {lang === 'si'
                    ? 'Leaflet සිතියම පූරණය කිරීමට Google Maps API key අවශ්‍යයි'
                    : lang === 'ta'
                    ? 'Google Maps API key தேவை'
                    : 'Google Maps API key required'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end animate-[fadeIn_0.2s]">
          <div className="bg-white rounded-t-[28px] w-full p-6 max-h-[80vh] overflow-y-auto animate-[slideUp_0.3s_cubic-bezier(0.32,0.72,0,1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-7">
                {lang === 'si' ? 'පෙරහන්' : lang === 'ta' ? 'வடிப்பான்கள்' : 'Filters'}
              </h2>
              <button onClick={() => setShowFilters(false)} className="p-2">
                <X size={24} className="text-gray-4" />
              </button>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-7 mb-3">
                {lang === 'si' ? 'මිල පරාසය' : lang === 'ta' ? 'விலை வரம்பு' : 'Price Range'}
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-6 w-20 text-right">
                  Rs. {priceRange[1].toLocaleString()}/hr
                </span>
              </div>
            </div>
            
            {/* Amenities */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-7 mb-3">
                {lang === 'si' ? 'පහසුකම්' : lang === 'ta' ? 'வசதிகள்' : 'Amenities'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${selectedAmenities.includes(amenity)
                        ? 'bg-orange text-white'
                        : 'bg-gray-1 text-gray-6'
                      }
                    `}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" fullWidth onClick={clearFilters}>
                {lang === 'si' ? 'මකන්න' : lang === 'ta' ? 'அகற்று' : 'Clear All'}
              </Button>
              <Button fullWidth onClick={() => setShowFilters(false)}>
                {lang === 'si' ? 'පෙරහන් යොදන්න' : lang === 'ta' ? 'வடிப்பான்களைப் பயன்படுத்து' : 'Apply Filters'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-1" />}>
      <SearchContent />
    </Suspense>
  );
}
