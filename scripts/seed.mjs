import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('\nPlease add to .env.local:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.log('\nThen run: node scripts/seed.mjs');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const seedData = {
  profiles: [
    {
      id: 'demo-user-driver',
      email: 'driver@parkshare.lk',
      full_name: 'Demo Driver',
      phone: '+94771234567',
      nic: '199012345678',
      role: 'driver',
      is_verified: true,
      wallet_balance: 5000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'demo-user-owner',
      email: 'owner@parkshare.lk',
      full_name: 'Demo Owner',
      phone: '+94771234568',
      nic: '198912345678',
      role: 'owner',
      is_verified: true,
      wallet_balance: 15000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'demo-admin',
      email: 'admin@parkshare.lk',
      full_name: 'Admin User',
      phone: '+94771234569',
      nic: '197912345678',
      role: 'admin',
      is_verified: true,
      wallet_balance: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  
  vehicles: [
    {
      id: 'vehicle-1',
      user_id: 'demo-user-driver',
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      license_plate: 'CAR-1234',
      color: 'Silver',
      vehicle_type: 'car',
      is_default: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'vehicle-2',
      user_id: 'demo-user-driver',
      make: 'Honda',
      model: 'Activa',
      year: 2022,
      license_plate: 'BIKE-5678',
      color: 'Black',
      vehicle_type: 'motorcycle',
      is_default: false,
      created_at: new Date().toISOString()
    }
  ],
  
  listings: [
    {
      id: 'listing-1',
      owner_id: 'demo-user-owner',
      title: 'Colombo City Centre Parking',
      description: 'Secure underground parking in the heart of Colombo. This premium parking facility offers 24/7 security, CCTV surveillance, and easy access to major commercial areas.',
      address: 'No. 123, York Street, Colombo 01',
      city: 'Colombo',
      district: 'Colombo',
      latitude: 6.9271,
      longitude: 79.8612,
      price_per_hour: 350,
      price_per_day: 2500,
      amenities: ['CCTV', 'Security', 'Covered', 'EV Charging', 'Elevator'],
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
      updated_at: new Date().toISOString()
    },
    {
      id: 'listing-2',
      owner_id: 'demo-user-owner',
      title: 'Galle Face Hotel Parking',
      description: 'Premium parking near Galle Face Green. Perfect for beach lovers and business travelers.',
      address: 'Galle Road, Colombo 03',
      city: 'Colombo',
      district: 'Colombo',
      latitude: 6.9196,
      longitude: 79.8423,
      price_per_hour: 500,
      price_per_day: 3500,
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
      updated_at: new Date().toISOString()
    },
    {
      id: 'listing-3',
      owner_id: 'demo-user-owner',
      title: 'Liberty Arcade Parking',
      description: 'Modern parking facility in Colombo 03 with easy access to shops and restaurants.',
      address: 'Liberty Arcade, Colombo 03',
      city: 'Colombo',
      district: 'Colombo',
      latitude: 6.9149,
      longitude: 79.8523,
      price_per_hour: 400,
      price_per_day: 2800,
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
      updated_at: new Date().toISOString()
    },
    {
      id: 'listing-4',
      owner_id: 'demo-user-owner',
      title: 'Kandy Mall Parking',
      description: 'Convenient parking at Kandy Mall, the largest shopping complex in Kandy.',
      address: 'Kandy Mall, Kandy',
      city: 'Kandy',
      district: 'Kandy',
      latitude: 7.2906,
      longitude: 80.6337,
      price_per_hour: 200,
      price_per_day: 1500,
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
      updated_at: new Date().toISOString()
    },
    {
      id: 'listing-5',
      owner_id: 'demo-user-owner',
      title: 'Negombo Beach Parking',
      description: 'Beach side parking for tourists visiting Negombo beach.',
      address: 'Beach Road, Negombo',
      city: 'Negombo',
      district: 'Gampaha',
      latitude: 7.2083,
      longitude: 79.8358,
      price_per_hour: 150,
      price_per_day: 1000,
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
      updated_at: new Date().toISOString()
    },
    {
      id: 'listing-6',
      owner_id: 'demo-user-owner',
      title: 'Galle Fort Parking',
      description: 'Secure parking near the historic Galle Fort, UNESCO World Heritage Site.',
      address: 'Galle Fort, Galle',
      city: 'Galle',
      district: 'Galle',
      latitude: 6.0265,
      longitude: 80.2146,
      price_per_hour: 300,
      price_per_day: 2000,
      amenities: ['CCTV', 'Security', 'Covered'],
      vehicle_types: ['car', 'motorcycle'],
      total_spaces: 35,
      available_spaces: 10,
      operating_hours_start: '07:00',
      operating_hours_end: '22:00',
      is_24_hours: false,
      status: 'approved',
      verification_status: 'verified',
      rating: 4.7,
      review_count: 189,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'listing-7',
      owner_id: 'demo-user-owner',
      title: 'Jaffna City Parking',
      description: 'Central parking in Jaffna city, convenient for shopping and business.',
      address: 'Jaffna City Centre, Jaffna',
      city: 'Jaffna',
      district: 'Jaffna',
      latitude: 9.6615,
      longitude: 80.0255,
      price_per_hour: 150,
      price_per_day: 1000,
      amenities: ['CCTV', 'Security'],
      vehicle_types: ['car', 'motorcycle', 'van'],
      total_spaces: 45,
      available_spaces: 20,
      operating_hours_start: '07:00',
      operating_hours_end: '21:00',
      is_24_hours: false,
      status: 'approved',
      verification_status: 'verified',
      rating: 4.2,
      review_count: 76,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'listing-8',
      owner_id: 'demo-user-owner',
      title: 'Anuradhapura Parking',
      description: 'Parking near the ancient city of Anuradhapura, UNESCO World Heritage Site.',
      address: 'Anuradhapura Town, Anuradhapura',
      city: 'Anuradhapura',
      district: 'Anuradhapura',
      latitude: 8.3114,
      longitude: 80.4037,
      price_per_hour: 180,
      price_per_day: 1200,
      amenities: ['CCTV', 'Security', 'Covered'],
      vehicle_types: ['car', 'motorcycle'],
      total_spaces: 40,
      available_spaces: 15,
      operating_hours_start: '06:00',
      operating_hours_end: '21:00',
      is_24_hours: false,
      status: 'approved',
      verification_status: 'verified',
      rating: 4.4,
      review_count: 112,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  
  bookings: [
    {
      id: 'booking-1',
      listing_id: 'listing-1',
      driver_id: 'demo-user-driver',
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
      updated_at: new Date().toISOString()
    }
  ]
};

async function seedDatabase() {
  console.log('🚀 Starting Supabase seed...\n');
  
  console.log('📋 Seeding profiles (users)...');
  for (const profile of seedData.profiles) {
    const { error } = await supabase
      .from('profiles')
      .upsert(profile, { onConflict: 'id' });
    if (error) {
      console.log(`   ⚠️  ${profile.email}: ${error.message}`);
    } else {
      console.log(`   ✓ ${profile.email} (${profile.role})`);
    }
  }
  
  console.log('\n📋 Seeding vehicles...');
  for (const vehicle of seedData.vehicles) {
    const { error } = await supabase
      .from('vehicles')
      .upsert(vehicle, { onConflict: 'id' });
    if (error) {
      console.log(`   ⚠️  ${vehicle.license_plate}: ${error.message}`);
    } else {
      console.log(`   ✓ ${vehicle.make} ${vehicle.model} (${vehicle.license_plate})`);
    }
  }
  
  console.log('\n📋 Seeding listings...');
  for (const listing of seedData.listings) {
    const { error } = await supabase
      .from('listings')
      .upsert(listing, { onConflict: 'id' });
    if (error) {
      console.log(`   ⚠️  ${listing.title}: ${error.message}`);
    } else {
      console.log(`   ✓ ${listing.title} (${listing.city})`);
    }
  }
  
  console.log('\n📋 Seeding bookings...');
  for (const booking of seedData.bookings) {
    const { error } = await supabase
      .from('bookings')
      .upsert(booking, { onConflict: 'id' });
    if (error) {
      console.log(`   ⚠️  Booking: ${error.message}`);
    } else {
      console.log(`   ✓ Booking for listing-1`);
    }
  }
  
  console.log('\n✅ Seed completed!');
  console.log('\n📝 Demo Credentials:');
  console.log('   Driver: driver@parkshare.lk');
  console.log('   Owner:  owner@parkshare.lk');
  console.log('   Admin:  admin@parkshare.lk');
  console.log('   OTP:    123456');
}

seedDatabase().catch(console.error);
