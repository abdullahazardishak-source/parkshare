export type UserRole = 'driver' | 'owner' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  nic: string;
  role: UserRole;
  avatar_url?: string;
  is_verified: boolean;
  wallet_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
  vehicle_type: 'car' | 'motorcycle' | 'van' | 'bus' | 'other';
  is_default: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  price_per_hour: number;
  price_per_day: number;
  images: string[];
  amenities: string[];
  vehicle_types: string[];
  total_spaces: number;
  available_spaces: number;
  operating_hours_start: string;
  operating_hours_end: string;
  is_24_hours: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  verification_status: 'unverified' | 'pending' | 'verified';
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  owner?: Profile;
}

export interface Booking {
  id: string;
  listing_id: string;
  driver_id: string;
  vehicle_id: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  subtotal: number;
  platform_fee: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  payment_method: 'wallet' | 'card' | 'bank_transfer';
  payment_reference?: string;
  created_at: string;
  updated_at: string;
  listing?: Listing;
  vehicle?: Vehicle;
  driver?: Profile;
}

export interface Review {
  id: string;
  booking_id: string;
  listing_id: string;
  driver_id: string;
  rating: number;
  comment: string;
  created_at: string;
  driver?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'verification' | 'review' | 'system' | 'payout';
  is_read: boolean;
  data?: Record<string, unknown>;
  created_at: string;
}

export interface Complaint {
  id: string;
  booking_id: string;
  complainant_id: string;
  respondent_id: string;
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'rejected';
  resolution?: string;
  created_at: string;
  updated_at: string;
}

export interface Payout {
  id: string;
  owner_id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'bank_transfer' | 'mobile_money';
  bank_account?: string;
  mobile_number?: string;
  reference?: string;
  processed_at?: string;
  created_at: string;
}

export interface SavedListing {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing?: Listing;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  reference_type?: 'booking' | 'payout' | 'refund' | 'topup';
  reference_id?: string;
  created_at: string;
}
