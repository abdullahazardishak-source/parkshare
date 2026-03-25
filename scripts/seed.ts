import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const now = new Date().toISOString();

const profiles = [
  {
    id: 'demo-user-driver',
    email: 'driver@parkshare.lk',
    full_name: 'Demo Driver',
    phone: '+94771234567',
    nic: '199012345678',
    role: 'driver',
    is_verified: true,
    wallet_balance: 5000,
    created_at: now,
    updated_at: now,
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
    created_at: now,
    updated_at: now,
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
    created_at: now,
    updated_at: now,
  },
];

const vehicles = [
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
    created_at: now,
  },
];

const listings = [
  {
    id: 'listing-1',
    owner_id: 'demo-user-owner',
    title: 'Colombo City Centre Parking',
    description: 'Secure underground parking in Colombo city center.',
    address: 'No. 123, York Street, Colombo 01',
    city: 'Colombo',
    district: 'Colombo',
    latitude: 6.9271,
    longitude: 79.8612,
    price_per_hour: 350,
    price_per_day: 2500,
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
    created_at: now,
    updated_at: now,
  },
];

const bookings = [
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
    created_at: now,
    updated_at: now,
  },
];

const notifications = [
  {
    id: 'notif-1',
    user_id: 'demo-user-driver',
    title: 'Welcome to ParkShare',
    message: 'Your account is ready. OTP for testing is 123456.',
    type: 'system',
    is_read: false,
    created_at: now,
  },
];

const walletTransactions = [
  {
    id: 'wallet-tx-1',
    user_id: 'demo-user-driver',
    amount: 1000,
    type: 'credit',
    description: 'Initial wallet top-up',
    reference_type: 'seed',
    reference_id: 'seed-1',
    created_at: now,
  },
];

const payouts = [
  {
    id: 'payout-1',
    owner_id: 'demo-user-owner',
    amount: 2500,
    status: 'pending',
    method: 'bank_transfer',
    created_at: now,
  },
];

const complaints = [
  {
    id: 'complaint-1',
    booking_id: 'booking-1',
    complainant_id: 'demo-user-driver',
    respondent_id: 'demo-user-owner',
    subject: 'Parking slot blocked',
    description: 'The assigned slot had another car parked in it.',
    status: 'open',
    created_at: now,
    updated_at: now,
  },
];

const appSettings = [
  {
    id: 'platform_fees',
    key: 'platform_fees',
    value: { percentage: 5, currency: 'LKR' },
    updated_at: now,
  },
];

async function upsertTable(table: string, rows: Record<string, unknown>[], onConflict = 'id') {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`Seeded ${table}: ${rows.length} row(s)`);
}

async function seed() {
  console.log('Starting seed...');
  await upsertTable('profiles', profiles);
  await upsertTable('vehicles', vehicles);
  await upsertTable('listings', listings);
  await upsertTable('bookings', bookings);
  await upsertTable('notifications', notifications);
  await upsertTable('wallet_transactions', walletTransactions);
  await upsertTable('payouts', payouts);
  await upsertTable('complaints', complaints);
  await upsertTable('app_settings', appSettings, 'key');
  console.log('Seed completed.');
  console.log('Demo logins:');
  console.log('  Driver: driver@parkshare.lk');
  console.log('  Owner:  owner@parkshare.lk');
  console.log('  Admin:  admin@parkshare.lk');
  console.log('  OTP:    123456');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});

