import { createServerClient } from '@/lib/supabase-server';
import type { Notification } from '@/types';

export async function getNotifications(userId: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Notification[];
}

export async function markNotificationRead(id: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Notification;
}

