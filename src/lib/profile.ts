import { createClient } from '@/lib/supabase';
import type { Profile } from '@/types';

type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  nic: string;
  role: Profile['role'];
  avatar_url?: string | null;
  is_verified: boolean;
  wallet_balance: number;
  created_at: string;
  updated_at: string;
};

export type ProfileUpdateInput = Partial<
  Pick<Profile, 'full_name' | 'email' | 'phone' | 'nic' | 'avatar_url'>
>;

const mapRowToProfile = (row: ProfileRow): Profile => ({
  id: row.id,
  email: row.email,
  full_name: row.full_name,
  phone: row.phone,
  nic: row.nic,
  role: row.role,
  avatar_url: row.avatar_url || undefined,
  is_verified: row.is_verified,
  wallet_balance: row.wallet_balance,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single<ProfileRow>();

  if (error) throw error;
  if (!data) return null;
  return mapRowToProfile(data);
}

export async function updateProfile(userId: string, updates: ProfileUpdateInput): Promise<Profile> {
  const supabase = createClient();
  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select('*')
    .single<ProfileRow>();

  if (error) throw error;
  return mapRowToProfile(data);
}

