import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile, Vehicle, Listing, Booking, Notification } from '@/types';

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  setUser: (user: Profile | null) => void;
  logout: () => void;
  hydrateFromServer: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => {
        void fetch('/api/auth/logout', { method: 'POST' });
        set({ user: null, isAuthenticated: false });
      },
      hydrateFromServer: async () => {
        try {
          const response = await fetch('/api/auth/me', { method: 'GET' });
          if (!response.ok) {
            set({ user: null, isAuthenticated: false });
            return;
          }
          const data = await response.json();
          set({ user: data.user || null, isAuthenticated: !!data.user });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'parkshare-auth',
    }
  )
);

interface VehicleState {
  vehicles: Vehicle[];
  defaultVehicle: Vehicle | null;
  setVehicles: (vehicles: Vehicle[]) => void;
  setDefaultVehicle: (vehicle: Vehicle | null) => void;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      vehicles: [],
      defaultVehicle: null,
      setVehicles: (vehicles) => {
        const defaultV = vehicles.find((v) => v.is_default) || null;
        set({ vehicles, defaultVehicle: defaultV });
      },
      setDefaultVehicle: (vehicle) => set({ defaultVehicle: vehicle }),
    }),
    {
      name: 'parkshare-vehicles',
    }
  )
);

interface SearchState {
  searchQuery: string;
  selectedCity: string;
  selectedDistrict: string;
  priceRange: [number, number];
  selectedAmenities: string[];
  selectedVehicleTypes: string[];
  sortBy: 'price' | 'distance' | 'rating';
  setSearchQuery: (query: string) => void;
  setSelectedCity: (city: string) => void;
  setSelectedDistrict: (district: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSelectedAmenities: (amenities: string[]) => void;
  setSelectedVehicleTypes: (types: string[]) => void;
  setSortBy: (sort: 'price' | 'distance' | 'rating') => void;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searchQuery: '',
      selectedCity: '',
      selectedDistrict: '',
      priceRange: [0, 5000],
      selectedAmenities: [],
      selectedVehicleTypes: [],
      sortBy: 'distance',
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCity: (city) => set({ selectedCity: city }),
      setSelectedDistrict: (district) => set({ selectedDistrict: district }),
      setPriceRange: (range) => set({ priceRange: range }),
      setSelectedAmenities: (amenities) => set({ selectedAmenities: amenities }),
      setSelectedVehicleTypes: (types) => set({ selectedVehicleTypes: types }),
      setSortBy: (sort) => set({ sortBy: sort }),
      resetFilters: () =>
        set({
          searchQuery: '',
          selectedCity: '',
          selectedDistrict: '',
          priceRange: [0, 5000],
          selectedAmenities: [],
          selectedVehicleTypes: [],
          sortBy: 'distance',
        }),
    }),
    {
      name: 'parkshare-search',
    }
  )
);

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.is_read).length,
        }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + (notification.is_read ? 0 : 1),
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          ),
          unreadCount: Math.max(
            0,
            state.unreadCount - (state.notifications.find((n) => n.id === id && !n.is_read) ? 1 : 0)
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
          unreadCount: 0,
        })),
    }),
    {
      name: 'parkshare-notifications',
    }
  )
);

interface BookingState {
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookings: [],
      setBookings: (bookings) => set({ bookings }),
      addBooking: (booking) =>
        set((state) => ({ bookings: [booking, ...state.bookings] })),
      updateBooking: (id, updates) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),
    }),
    {
      name: 'parkshare-bookings',
    }
  )
);

interface SavedListingsState {
  savedListings: Listing[];
  toggleSaved: (listing: Listing) => void;
  isSaved: (listingId: string) => boolean;
}

export const useSavedListingsStore = create<SavedListingsState>()(
  persist(
    (set, get) => ({
      savedListings: [],
      toggleSaved: (listing) =>
        set((state) => {
          const isAlreadySaved = state.savedListings.some((l) => l.id === listing.id);
          if (isAlreadySaved) {
            return {
              savedListings: state.savedListings.filter((l) => l.id !== listing.id),
            };
          }
          return {
            savedListings: [...state.savedListings, listing],
          };
        }),
      isSaved: (listingId) => get().savedListings.some((l) => l.id === listingId),
    }),
    {
      name: 'parkshare-saved',
    }
  )
);
