'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Car, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { BottomNav } from '@/components/layout';
import { Card, Button, Badge, Input } from '@/components/ui';
import { useAuthStore, useVehicleStore } from '@/lib/store';
import {
  createVehicle,
  deleteVehicle,
  listVehicles,
  setDefaultVehicle,
  updateVehicle,
  type VehicleInput,
} from '@/lib/vehicles';

const emptyForm: VehicleInput = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  license_plate: '',
  color: '',
  vehicle_type: 'car',
  is_default: false,
};

export default function ProfileVehiclesPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setVehiclesStore = useVehicleStore((s) => s.setVehicles);
  const [vehicles, setVehicles] = useState<Awaited<ReturnType<typeof listVehicles>>>([]);
  const [formData, setFormData] = useState<VehicleInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const title = useMemo(() => (editingId ? 'Edit vehicle' : 'Add vehicle'), [editingId]);

  const refreshVehicles = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError('');
    try {
      const list = await listVehicles(user.id);
      setVehicles(list);
      setVehiclesStore(list);
    } catch {
      setError('Failed to load vehicles');
    } finally {
      setIsLoading(false);
    }
  }, [setVehiclesStore, user?.id]);

  useEffect(() => {
    void refreshVehicles();
  }, [refreshVehicles]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const validate = () => {
    if (!formData.make.trim()) return 'Vehicle make is required';
    if (!formData.model.trim()) return 'Vehicle model is required';
    if (!formData.license_plate.trim()) return 'License plate is required';
    if (!formData.color.trim()) return 'Color is required';
    if (!Number.isFinite(formData.year) || formData.year < 1950 || formData.year > 2100) {
      return 'Year must be between 1950 and 2100';
    }
    return '';
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await updateVehicle(editingId, user.id, formData);
        setSuccess('Vehicle updated');
      } else {
        await createVehicle(user.id, formData);
        setSuccess('Vehicle added');
      }
      resetForm();
      await refreshVehicles();
    } catch {
      setError('Failed to save vehicle');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (id: string) => {
    const target = vehicles.find((v) => v.id === id);
    if (!target) return;
    setEditingId(id);
    setFormData({
      make: target.make,
      model: target.model,
      year: target.year,
      license_plate: target.license_plate,
      color: target.color,
      vehicle_type: target.vehicle_type,
      is_default: target.is_default,
    });
  };

  const handleDelete = async (id: string) => {
    if (!user?.id) return;
    if (!window.confirm('Delete this vehicle?')) return;
    setError('');
    setSuccess('');
    try {
      await deleteVehicle(id, user.id);
      setSuccess('Vehicle deleted');
      await refreshVehicles();
    } catch {
      setError('Failed to delete vehicle');
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user?.id) return;
    setError('');
    setSuccess('');
    try {
      await setDefaultVehicle(id, user.id);
      setSuccess('Default vehicle updated');
      await refreshVehicles();
    } catch {
      setError('Failed to set default vehicle');
    }
  };

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gray-1 pb-20">
        <div className="px-5 py-10">
          <Card className="space-y-3">
            <p className="font-semibold text-gray-7">Sign in required</p>
            <p className="text-sm text-gray-4">Please sign in to manage vehicles.</p>
            <Button fullWidth onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1 pb-20">
      <header className="sticky top-0 z-50 bg-gray-1/92 backdrop-blur-xl border-b border-gray-6/10 px-5 h-12 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) router.back();
            else router.push('/profile');
          }}
          className="p-2 -ml-2 rounded-xl text-gray-7"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-base text-gray-7">My vehicles</h1>
      </header>

      <div className="px-5 py-5 space-y-4">
        <Card className="space-y-3">
          <p className="font-semibold text-gray-7">{title}</p>
          <Input
            label="Make"
            value={formData.make}
            onChange={(e) => setFormData((prev) => ({ ...prev, make: e.target.value }))}
            disabled={isSaving}
          />
          <Input
            label="Model"
            value={formData.model}
            onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
            disabled={isSaving}
          />
          <Input
            label="Year"
            type="number"
            value={String(formData.year)}
            onChange={(e) => setFormData((prev) => ({ ...prev, year: Number(e.target.value) || 0 }))}
            disabled={isSaving}
          />
          <Input
            label="License Plate"
            value={formData.license_plate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, license_plate: e.target.value.toUpperCase() }))
            }
            disabled={isSaving}
          />
          <Input
            label="Color"
            value={formData.color}
            onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
            disabled={isSaving}
          />
          <label className="block text-xs font-semibold text-gray-4 uppercase tracking-wider ml-1">Vehicle type</label>
          <select
            value={formData.vehicle_type}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                vehicle_type: e.target.value as VehicleInput['vehicle_type'],
              }))
            }
            className="w-full rounded-xl border-2 border-gray-2 px-3 py-3 text-gray-7 bg-white"
            disabled={isSaving}
          >
            <option value="car">Car</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="van">Van</option>
            <option value="bus">Bus</option>
            <option value="other">Other</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-6">
            <input
              type="checkbox"
              checked={formData.is_default}
              onChange={(e) => setFormData((prev) => ({ ...prev, is_default: e.target.checked }))}
              disabled={isSaving}
            />
            Set as default vehicle
          </label>
          <div className="flex gap-2">
            <Button fullWidth onClick={handleSubmit} isLoading={isSaving}>
              {editingId ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
            {editingId && (
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
          {error && <p className="text-sm text-red">{error}</p>}
          {success && <p className="text-sm text-green">{success}</p>}
        </Card>

        <Card className="space-y-3">
          <p className="font-semibold text-gray-7">My vehicles</p>
          {isLoading ? (
            <p className="text-sm text-gray-4">Loading vehicles...</p>
          ) : vehicles.length === 0 ? (
            <p className="text-sm text-gray-4">No vehicles yet. Add your first vehicle above.</p>
          ) : (
            vehicles.map((v) => (
              <div key={v.id} className="flex items-center gap-3 border border-gray-2 rounded-xl p-3">
                <div className="w-10 h-10 bg-orange-pale rounded-xl flex items-center justify-center">
                  <Car size={18} className="text-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-7 truncate">
                    {v.make} {v.model} ({v.year})
                  </p>
                  <p className="text-xs text-gray-4">
                    {v.license_plate} - {v.color} - {v.vehicle_type}
                  </p>
                </div>
                {v.is_default && <Badge variant="green">Default</Badge>}
                <div className="flex items-center gap-1">
                  {!v.is_default && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(v.id)}
                      className="p-2 rounded-lg text-green hover:bg-green-pale"
                      title="Set default"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEdit(v.id)}
                    className="p-2 rounded-lg text-blue hover:bg-blue-pale"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(v.id)}
                    className="p-2 rounded-lg text-red hover:bg-red-pale"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}

