import { createServerClient } from '@/lib/supabase-server';
import type { Booking } from '@/types';

export async function getBookings(params?: { driverId?: string; status?: string }) {
  const supabase = createServerClient();
  let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
  if (params?.driverId) query = query.eq('driver_id', params.driverId);
  if (params?.status) query = query.eq('status', params.status);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Booking[];
}

export async function updateBookingStatus(id: string, status: Booking['status']) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Booking;
}

