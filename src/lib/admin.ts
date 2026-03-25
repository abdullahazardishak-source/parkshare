import { createServerClient } from '@/lib/supabase-server';

export async function getAdminDashboardData() {
  const supabase = createServerClient();

  const [
    usersRes,
    listingsRes,
    bookingsRes,
    pendingListingsRes,
    complaintsRes,
    recentBookingsRes,
    openComplaintsRes,
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('listings').select('id', { count: 'exact', head: true }),
    supabase.from('bookings').select('id', { count: 'exact', head: true }),
    supabase.from('listings').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(10),
    supabase.from('complaints').select('id', { count: 'exact', head: true }).neq('status', 'resolved'),
    supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('complaints').select('*').order('created_at', { ascending: false }).limit(10),
  ]);

  return {
    stats: {
      totalUsers: usersRes.count || 0,
      totalListings: listingsRes.count || 0,
      activeBookings: bookingsRes.count || 0,
      pendingApprovals: (pendingListingsRes.data || []).length,
      openComplaints: complaintsRes.count || 0,
      totalRevenue: ((recentBookingsRes.data || []) as Array<{ total_amount?: number }>).reduce(
        (sum, b) => sum + Number(b.total_amount || 0),
        0
      ),
    },
    pendingListings: pendingListingsRes.data || [],
    recentBookings: recentBookingsRes.data || [],
    openComplaints: openComplaintsRes.data || [],
  };
}

export async function getAdminUsers() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getAdminComplaints() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateComplaintStatus(id: string, status: string, resolution?: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('complaints')
    .update({ status, resolution, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function getAdminPayouts() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('payouts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updatePayoutStatus(id: string, status: string) {
  const supabase = createServerClient();
  const payload: Record<string, unknown> = { status };
  if (status === 'completed') payload.processed_at = new Date().toISOString();
  const { data, error } = await supabase
    .from('payouts')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function getAdminSettings() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('app_settings').select('*').order('key');
  if (error) throw error;
  return data || [];
}

export async function upsertAdminSetting(key: string, value: unknown) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('app_settings')
    .upsert({ id: key, key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

