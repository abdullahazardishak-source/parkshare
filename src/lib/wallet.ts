import { createServerClient } from '@/lib/supabase-server';
import type { WalletTransaction } from '@/types';

export async function getWalletTransactions(userId: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as WalletTransaction[];
}

