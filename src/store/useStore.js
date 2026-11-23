import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || 'https://speedo-server.vercel.app/api';

export const useStore = create((set, get) => ({
  currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,

  activeRole: (JSON.parse(localStorage.getItem('currentUser')) || {}).role || 'client',
  vehicles: [],
  bookings: [],

  fetchInitialData: async () => {
    try {
      const [vehiclesRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/vehicles`).catch(() => null),
        fetch(`${API_URL}/bookings`).catch(() => null)
      ]);

      let vehicles = [];
      let bookings = [];

      if (vehiclesRes && vehiclesRes.ok) {
        const fetchedVehicles = await vehiclesRes.json();
        if (Array.isArray(fetchedVehicles) && fetchedVehicles.length > 0) {
          vehicles = fetchedVehicles;
        }
      }

      if (bookingsRes && bookingsRes.ok) {
        const fetchedBookings = await bookingsRes.json();
        if (Array.isArray(fetchedBookings) && fetchedBookings.length > 0) {
          bookings = fetchedBookings;
        }
      }

      set({ vehicles, bookings });
    } catch (err) {
      console.warn('Unable to load fleet data:', err);
      set({ vehicles: [], bookings: [] });
    }
  },

  login: async (email, password, requiredRole = null) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, requiredRole })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        set({ currentUser: data.user, activeRole: data.user.role || 'client' });
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Invalid credentials' };
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, message: 'Authentication failed' };
    }
  },

  register: async (name, email, password, role = 'client') => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        set({ currentUser: data.user, activeRole: data.user.role || 'client' });
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err) {
      console.error('Registration failed:', err);
      return { success: false, message: 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    set({ currentUser: null, activeRole: 'client' });
  },

  // Actions
  setActiveRole: (role) => set({ activeRole: role }),

  bookVehicle: async (bookingData) => {
    try {
      const dbPayload = {
        carId: bookingData.carId,
        carName: bookingData.carName,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        days: bookingData.days,
        totalPaid: bookingData.totalPaid,
        location: bookingData.location,
        userId: get().currentUser.id || 1
      };

      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbPayload)
      });

      if (!res.ok) throw new Error('Booking failed');
      const newBooking = await res.json();

      set((state) => ({ bookings: [newBooking, ...state.bookings] }));
    } catch (err) {
      console.error(err);
    }
  },

  addVehicle: async (car) => {
    try {
      const res = await fetch(`${API_URL}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car)
      });

      if (!res.ok) throw new Error('Adding vehicle failed');
      const newVehicle = await res.json();
      set((state) => ({ vehicles: [newVehicle, ...state.vehicles] }));
    } catch (err) {
      console.warn('Backend add vehicle failed, updating locally:', err);
      const localVehicle = {
        id: `car-${Date.now()}`,
        ...car,
        available: true,
        maintenance: { status: 'Optimal' }
      };
      set((state) => ({ vehicles: [localVehicle, ...state.vehicles] }));
    }
  },

  updateVehicle: async (id, updatedCar) => {
    try {
      const res = await fetch(`${API_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCar)
      });
      if (res.ok) {
        const saved = await res.json();
        set((state) => ({
          vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...saved } : v)
        }));
        return;
      }
    } catch (err) {
      console.warn('Backend update vehicle failed, updating locally:', err);
    }
    // Fallback local update
    set((state) => ({
      vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...updatedCar } : v)
    }));
  },

  // Upload/custom image URL for a vehicle (admin only)
  uploadVehicleImage: async (id, imageUrl) => {
    try {
      const res = await fetch(`${API_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUrl })
      });
      if (res.ok) {
        const saved = await res.json();
        set((state) => ({
          vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...saved } : v)
        }));
        return { success: true, vehicle: saved };
      }
    } catch (err) {
      console.warn('Backend image upload failed, updating locally:', err);
    }
    // Fallback: update locally only
    set((state) => ({
      vehicles: state.vehicles.map(v => v.id === id ? { ...v, image: imageUrl } : v)
    }));
    return { success: true, vehicle: { id, image: imageUrl } };
  },

  deleteVehicle: async (id) => {
    try {
      await fetch(`${API_URL}/vehicles/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Backend delete vehicle failed, deleting locally:', err);
    }
    set((state) => ({
      vehicles: state.vehicles.filter(v => v.id !== id),
      bookings: state.bookings.filter(b => b.carId !== id)
    }));
  },

  generateAiCarPhoto: async (model) => {
    const cars = [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80'
    ];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(cars[Math.floor(Math.random() * cars.length)]);
      }, 750);
    });
  }
}));
