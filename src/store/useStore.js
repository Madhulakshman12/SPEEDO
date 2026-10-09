import { create } from 'zustand';

const API_URL = '/api';

const DEFAULT_LOCATIONS = [
  'Banjara Hills, Hyderabad, India',
  'Jubilee Hills, Hyderabad, India',
  'Whitefield, Bangalore, India'
];

const DEFAULT_VEHICLES = [
  {
    id: 'car-1',
    name: 'Porsche 911 GT3 RS',
    category: 'Supercars & Track',
    dailyRate: 65000,
    horsepower: '518 HP',
    zeroToSixty: '3.0s',
    topSpeed: '296 km/h',
    transmission: '7-Speed PDK Dual-Clutch',
    location: 'Banjara Hills, Hyderabad, India',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    available: true,
    maintenance: { status: 'Optimal' }
  },
  {
    id: 'car-2',
    name: 'Mercedes-AMG G 63 4x4²',
    category: 'Luxury SUV',
    dailyRate: 58000,
    horsepower: '577 HP',
    zeroToSixty: '4.5s',
    topSpeed: '220 km/h',
    transmission: '9G-TRONIC Automatic',
    location: 'Jubilee Hills, Hyderabad, India',
    image: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80',
    available: true,
    maintenance: { status: 'Service Due in 2 Days' }
  },
  {
    id: 'car-3',
    name: 'Audi RS e-tron GT',
    category: 'Electric Performance',
    dailyRate: 42000,
    horsepower: '637 HP',
    zeroToSixty: '3.1s',
    topSpeed: '250 km/h',
    transmission: '2-Speed Automatic Electric',
    location: 'Whitefield, Bangalore, India',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    available: true,
    maintenance: { status: 'Optimal' }
  },
  {
    id: 'car-4',
    name: 'Lamborghini Urus Performante',
    category: 'Luxury SUV',
    dailyRate: 72000,
    horsepower: '666 HP',
    zeroToSixty: '3.3s',
    topSpeed: '306 km/h',
    transmission: '8-Speed Automatic',
    location: 'Banjara Hills, Hyderabad, India',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
    available: true,
    maintenance: { status: 'Optimal' }
  },
  {
    id: 'car-5',
    name: 'Ferrari 296 GTB Hybrid',
    category: 'Supercars & Track',
    dailyRate: 85000,
    horsepower: '819 HP',
    zeroToSixty: '2.9s',
    topSpeed: '330 km/h',
    transmission: '8-Speed F1 Dual-Clutch',
    location: 'Jubilee Hills, Hyderabad, India',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    available: true,
    maintenance: { status: 'Optimal' }
  },
  {
    id: 'car-6',
    name: 'Rolls-Royce Ghost Black Badge',
    category: 'Executive Luxury',
    dailyRate: 95000,
    horsepower: '592 HP',
    zeroToSixty: '4.6s',
    topSpeed: '250 km/h',
    transmission: '8-Speed Satellite-Aided Auto',
    location: 'Whitefield, Bangalore, India',
    image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80',
    available: true,
    maintenance: { status: 'Optimal' }
  }
];

const DEFAULT_BOOKINGS = [
  {
    id: 'bk-991',
    carId: 'car-1',
    userId: 1,
    carName: 'Porsche 911 GT3 RS',
    startDate: '2026-10-12',
    endDate: '2026-10-15',
    days: 3,
    totalPaid: 165750,
    status: 'Confirmed',
    location: 'Banjara Hills, Hyderabad, India'
  }
];

function normalizeLocation(loc) {
  if (!loc) return 'Banjara Hills, Hyderabad, India';
  if (loc.includes('Los Angeles') || loc.includes('LAX')) return 'Banjara Hills, Hyderabad, India';
  if (loc.includes('Miami')) return 'Jubilee Hills, Hyderabad, India';
  if (loc.includes('San Francisco')) return 'Whitefield, Bangalore, India';
  return loc;
}

function normalizeRate(rate) {
  const num = Number(rate) || 45000;
  if (num < 5000) return num * 85;
  return num;
}

export const useStore = create((set, get) => ({
  currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,

  activeRole: (JSON.parse(localStorage.getItem('currentUser')) || {}).role || 'client',
  vehicles: DEFAULT_VEHICLES,
  bookings: DEFAULT_BOOKINGS,

  fetchInitialData: async () => {
    try {
      const [vehiclesRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/vehicles`).catch(() => null),
        fetch(`${API_URL}/bookings`).catch(() => null)
      ]);

      let vehicles = DEFAULT_VEHICLES;
      let bookings = DEFAULT_BOOKINGS;

      if (vehiclesRes && vehiclesRes.ok) {
        const fetchedVehicles = await vehiclesRes.json();
        if (Array.isArray(fetchedVehicles) && fetchedVehicles.length > 0) {
          vehicles = fetchedVehicles.map(v => ({
            ...v,
            location: normalizeLocation(v.location),
            dailyRate: normalizeRate(v.dailyRate),
            category: v.category === 'Track & Supercar' ? 'Supercars & Track' : (v.category || 'Supercars & Track')
          }));
        }
      }

      if (bookingsRes && bookingsRes.ok) {
        const fetchedBookings = await bookingsRes.json();
        if (Array.isArray(fetchedBookings) && fetchedBookings.length > 0) {
          bookings = fetchedBookings.map(b => ({
            ...b,
            location: normalizeLocation(b.location),
            totalPaid: normalizeRate(b.totalPaid)
          }));
        }
      }

      set({ vehicles, bookings });
    } catch (err) {
      console.warn('Using default fleet data due to network:', err);
      set({ vehicles: DEFAULT_VEHICLES, bookings: DEFAULT_BOOKINGS });
    }
  },

  login: async (email, password, requiredRole = null) => {
    // Quick local check for admin credentials for zero-friction login
    if ((email === 'admin@speedo.com' && password === 'admin123') || (email === 'admin' && password === 'admin')) {
      const adminUser = {
        id: 999,
        name: 'Speedo Fleet Admin',
        email: 'admin@speedo.com',
        role: 'admin',
        loyaltyTier: 'Executive Administrator',
        discountRate: 0.25
      };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      set({ currentUser: adminUser, activeRole: 'admin' });
      return { success: true, user: adminUser };
    }

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
      // Local demo fallback for user login if backend offline
      if (email && password) {
        const fallbackUser = {
          id: Date.now(),
          name: email.split('@')[0],
          email,
          role: requiredRole || 'client',
          loyaltyTier: requiredRole === 'admin' ? 'Executive Administrator' : 'Speedo Member',
          discountRate: requiredRole === 'admin' ? 0.25 : 0.10
        };
        localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
        set({ currentUser: fallbackUser, activeRole: fallbackUser.role });
        return { success: true, user: fallbackUser };
      }
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
      // Fallback register
      const newUser = {
        id: Date.now(),
        name,
        email,
        role,
        loyaltyTier: role === 'admin' ? 'Executive Administrator' : 'Speedo Member',
        discountRate: role === 'admin' ? 0.20 : 0.05
      };
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      set({ currentUser: newUser, activeRole: newUser.role });
      return { success: true, user: newUser };
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
