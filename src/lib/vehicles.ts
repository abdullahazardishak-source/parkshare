import { createClient } from '@/lib/supabase';
import type { Vehicle } from '@/types';

type VehicleRow = {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
  vehicle_type: Vehicle['vehicle_type'];
  is_default: boolean;
  created_at: string;
};

export type VehicleInput = Omit<Vehicle, 'id' | 'created_at' | 'user_id'>;

const mapRowToVehicle = (row: VehicleRow): Vehicle => ({
  id: row.id,
  user_id: row.user_id,
  make: row.make,
  model: row.model,
  year: row.year,
  license_plate: row.license_plate,
  color: row.color,
  vehicle_type: row.vehicle_type,
  is_default: row.is_default,
  created_at: row.created_at,
});

export async function listVehicles(userId: string): Promise<Vehicle[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })
    .returns<VehicleRow[]>();

  if (error) throw error;
  return (data || []).map(mapRowToVehicle);
}

export async function createVehicle(userId: string, input: VehicleInput): Promise<Vehicle> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vehicles')
    .insert({
      user_id: userId,
      make: input.make,
      model: input.model,
      year: input.year,
      license_plate: input.license_plate,
      color: input.color,
      vehicle_type: input.vehicle_type,
      is_default: input.is_default,
    })
    .select('*')
    .single<VehicleRow>();

  if (error) throw error;
  return mapRowToVehicle(data);
}

export async function updateVehicle(
  vehicleId: string,
  userId: string,
  updates: Partial<VehicleInput>
): Promise<Vehicle> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vehicles')
    .update(updates)
    .eq('id', vehicleId)
    .eq('user_id', userId)
    .select('*')
    .single<VehicleRow>();

  if (error) throw error;
  return mapRowToVehicle(data);
}

export async function deleteVehicle(vehicleId: string, userId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId).eq('user_id', userId);
  if (error) throw error;
}

export async function setDefaultVehicle(vehicleId: string, userId: string): Promise<void> {
  const supabase = createClient();

  const { error: clearError } = await supabase
    .from('vehicles')
    .update({ is_default: false })
    .eq('user_id', userId);

  if (clearError) throw clearError;

  const { error: setError } = await supabase
    .from('vehicles')
    .update({ is_default: true })
    .eq('id', vehicleId)
    .eq('user_id', userId);

  if (setError) throw setError;
}

