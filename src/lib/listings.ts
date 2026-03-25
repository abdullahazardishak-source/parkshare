import { createServerClient } from '@/lib/supabase-server';
import type { Listing } from '@/types';

export async function getListings(params?: { city?: string; district?: string; status?: string }) {
  const supabase = createServerClient();
  let query = supabase.from('listings').select('*').order('created_at', { ascending: false });
  if (params?.city) query = query.eq('city', params.city);
  if (params?.district) query = query.eq('district', params.district);
  if (params?.status) query = query.eq('status', params.status);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Listing[];
}

export async function getListingById(id: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Listing;
}

export async function updateListingStatus(id: string, status: Listing['status']) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('listings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Listing;
}

