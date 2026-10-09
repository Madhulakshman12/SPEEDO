import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import {
  Car,
  MapPin,
  Sparkles,
  Plus,
  X,
  ShoppingBag,
  UserRound,
  ArrowRight,
  Zap,
  ShieldCheck,
  Lock,
  LogOut,
  Layers,
  ShieldAlert,
  ExternalLink,
  Edit2,
  Trash2,
  Save,
  Image,
  Link,
  Eye,
  ChevronDown,
  ChevronUp,
  Search,
  AlertTriangle
} from 'lucide-react';

/* ─────────── CONSTANTS & HELPERS ─────────── */
const INDIAN_LOCATIONS = [
  'Banjara Hills, Hyderabad, India',
  'Jubilee Hills, Hyderabad, India',
  'Whitefield, Bangalore, India'
];

const CATEGORY_DEFINITIONS = [
  {
    id: 'Supercars & Track',
    title: 'Supercars & Track',
    subtitle: 'Track-Honed Acceleration',
    description: 'Sub-3.0s sprint machines with race-derived downforce and screaming exhausts.',
    startingPrice: 65000,
    icon: Zap
  },
  {
    id: 'Luxury SUV',
    title: 'Luxury SUV',
    subtitle: 'Commanding Stance & Twin-Turbo V8',
    description: 'Towering road presence, handcrafted leather cabins, and all-weather capability.',
    startingPrice: 58000,
    icon: ShieldCheck
  },
  {
    id: 'Electric Performance',
    title: 'Electric Performance',
    subtitle: 'Instant Torque Architecture',
    description: 'Next-gen dual-motor electric engineering delivering explosive instantaneous launch.',
    startingPrice: 42000,
    icon: Sparkles
  },
  {
    id: 'Executive Luxury',
    title: 'Executive Luxury',
    subtitle: 'Unrivaled Starlight Serenity',
    description: 'The pinnacle of chauffeured or self-drive prestige, effortless poise, and comfort.',
    startingPrice: 95000,
    icon: Car
  }
];

export const formatINR = (val) => {
  const num = Math.round(Number(val) || 0);
  return '₹' + num.toLocaleString('en-IN');
};

const normalizePath = (path) => {
  const p = (path || '/').toLowerCase();
  if (p === '/admin' || p.startsWith('/admin/')) return '/admin';
  if (p === '/shop' || p.startsWith('/shop/')) return '/shop';
  if (p === '/categories' || p.startsWith('/categories/')) return '/categories';
  if (p === '/blogs' || p.startsWith('/blogs/')) return '/blogs';
  if (p === '/rentals' || p.startsWith('/rentals/')) return '/rentals';
  return '/';
};

/* ─────────── USER AUTH MODAL (FOR NORMAL CUSTOMERS ONLY) ─────────── */
function CustomerAuthModal({ isOpen, onClose, onLogin, onRegister, onNavigateToAdmin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // If an admin enters admin credentials in the customer modal, guide them to /admin
    if (email === 'admin@speedo.com' || email === 'admin') {
      setError('Admin account detected. Please use the /admin portal to sign in.');
      return;
    }

    setLoading(true);
    const res = isRegister
      ? await onRegister(name, email, password, 'client')
      : await onLogin(email, password, 'client');
    setLoading(false);

    if (res && res.success) {
      onClose();
    } else {
      setError(res?.message || 'Authentication failed');
    }
  };

  const handleDemoCustomer = () => {
    setEmail('user@speedo.com');
    setPassword('user123');
    setName('Arjun Reddy');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#0d131b] border border-white/10 rounded-2xl p-6 sm:p-7 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#2d6cdf] flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#2d6cdf]/30">
            <UserRound className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-condensed text-2xl text-white tracking-wide">
            {isRegister ? 'Create Account' : 'Customer Sign In'}
          </h3>
          <p className="text-xs text-white/40 mt-1">Speedo Luxury Fleet Member Access</p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4ba0ff]"
                placeholder="Arjun Reddy"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4ba0ff]"
              placeholder="user@speedo.com"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4ba0ff]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#2d6cdf] hover:bg-[#4b7cf0] text-white font-condensed text-base tracking-wider rounded-xl transition shadow-md disabled:opacity-50 mt-2 font-bold"
          >
            {loading ? 'Please wait...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-white/40 hover:text-white transition"
          >
            {isRegister ? 'Already registered? Sign In' : 'New user? Sign Up'}
          </button>
          <button
            type="button"
            onClick={handleDemoCustomer}
            className="text-[#8ec5ff] hover:underline"
          >
            Fill Demo
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── 403 NOT AUTHORIZED SCREEN (FOR ADMINS BROWSING USER PAGES) ─────────── */
function AdminUnauthorizedNotice({ onNavigateToAdmin, onLogout }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-[#0d131b] border border-red-500/20 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto shadow-lg">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="font-condensed text-3xl text-white tracking-wide">You are not authorized</h2>
        <p className="text-xs text-white/50 leading-relaxed">
          You are currently logged in as <span className="text-amber-400 font-mono">Speedo Administrator</span>.
          Admin accounts are restricted to the Admin Portal and cannot browse or place customer rental bookings.
        </p>
        <div className="pt-2 flex flex-col gap-2.5">
          <button
            onClick={onNavigateToAdmin}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-condensed text-base tracking-wider font-bold transition shadow-lg shadow-amber-600/30"
          >
            Go to Admin Console (/admin)
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-semibold transition"
          >
            Sign Out of Admin
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── 403 NOT AUTHORIZED SCREEN (FOR CLIENTS VISITING /admin) ─────────── */
function ClientUnauthorizedNotice({ onNavigateToStore, onLogout }) {
  return (
    <div className="min-h-screen bg-[#05070b] flex items-center justify-center px-6">
      <div className="bg-[#0d131b] border border-red-500/20 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="font-condensed text-3xl text-white tracking-wide">403 - Access Denied</h2>
        <p className="text-xs text-white/50 leading-relaxed">
          You are not authorized to view this page. The <span className="font-mono text-[#8ec5ff]">/admin</span> route is strictly reserved for administrative personnel.
        </p>
        <div className="pt-2 flex flex-col gap-2.5">
          <button
            onClick={onNavigateToStore}
            className="w-full py-2.5 rounded-xl bg-[#2d6cdf] hover:bg-[#4b7cf0] text-white font-condensed text-base tracking-wider font-bold transition shadow-lg shadow-[#2d6cdf]/30"
          >
            Return to Customer Website
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-semibold transition"
          >
            Sign Out of Current Account
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── DEDICATED ADMIN ROUTE (/admin) ─────────── */
function AdminRouteView({ onNavigateToStore }) {
  const {
    currentUser,
    vehicles,
    bookings,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    uploadVehicleImage,
    login,
    logout
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // CRUD State
  const [adminTab, setAdminTab] = useState('fleet'); // 'fleet' | 'bookings'
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add / Edit form state
  const emptyForm = {
    name: '', category: 'Supercars & Track', dailyRate: 65000,
    horsepower: '600 HP', zeroToSixty: '3.1s', topSpeed: '310 km/h',
    transmission: '8-Speed Automatic', location: INDIAN_LOCATIONS[0],
    image: '', imageSource: 'url' // 'url' or 'existing'
  };
  const [formData, setFormData] = useState({ ...emptyForm });
  const [imagePreviewError, setImagePreviewError] = useState(false);

  // Existing image gallery for quick selection
  const STOCK_IMAGES = [
    { label: 'Porsche 911', url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Mercedes G-Class', url: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Audi e-tron', url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Lamborghini Urus', url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Ferrari 296', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Rolls-Royce', url: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80' },
    { label: 'BMW M4', url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80' },
    { label: 'McLaren', url: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80' },
  ];

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'image') setImagePreviewError(false);
  };

  const resetAndOpenAdd = () => {
    setFormData({ ...emptyForm });
    setEditingCarId(null);
    setImagePreviewError(false);
    setShowAddCarModal(true);
  };

  const openEditCar = (car) => {
    setFormData({
      name: car.name || '',
      category: car.category || 'Supercars & Track',
      dailyRate: car.dailyRate || 65000,
      horsepower: car.horsepower || '',
      zeroToSixty: car.zeroToSixty || '',
      topSpeed: car.topSpeed || '',
      transmission: car.transmission || '8-Speed Automatic',
      location: car.location || INDIAN_LOCATIONS[0],
      image: car.image || '',
      imageSource: 'url'
    });
    setEditingCarId(car.id);
    setImagePreviewError(false);
    setShowAddCarModal(true);
  };

  const handleSubmitCar = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const carPayload = {
      name: formData.name,
      category: formData.category,
      dailyRate: Number(formData.dailyRate) || 50000,
      horsepower: formData.horsepower,
      zeroToSixty: formData.zeroToSixty,
      topSpeed: formData.topSpeed,
      transmission: formData.transmission,
      location: formData.location,
      image: formData.image || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'
    };

    if (editingCarId) {
      await updateVehicle(editingCarId, carPayload);
      showSuccess(`✓ "${formData.name}" updated successfully`);
    } else {
      await addVehicle(carPayload);
      showSuccess(`✓ "${formData.name}" added to fleet`);
    }

    setShowAddCarModal(false);
    setEditingCarId(null);
    setFormData({ ...emptyForm });
  };

  const handleDeleteCar = async (id) => {
    const car = vehicles.find(v => v.id === id);
    await deleteVehicle(id);
    showSuccess(`✓ "${car?.name || 'Vehicle'}" removed from fleet`);
    setDeleteConfirmId(null);
  };

  const handleImageUrlUpdate = async (carId, newUrl) => {
    await uploadVehicleImage(carId, newUrl);
    showSuccess('✓ Image updated successfully');
  };

  const filteredVehicles = vehicles.filter(v =>
    v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (currentUser && currentUser.role !== 'admin') {
    return <ClientUnauthorizedNotice onNavigateToStore={onNavigateToStore} onLogout={logout} />;
  }

  if (!currentUser) {
    const handleAdminLogin = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      const res = await login(email, password, 'admin');
      setLoading(false);
      if (!res || !res.success) {
        setError(res?.message || 'Invalid admin credentials');
      }
    };

    return (
      <div className="min-h-screen bg-[#05070b] text-white flex flex-col items-center justify-center p-6">
        <div className="bg-[#0d131b] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-condensed text-3xl text-white tracking-wider">SPEEDO ADMIN CONSOLE</h2>
            <p className="text-xs text-amber-400/80 font-mono tracking-widest uppercase mt-0.5">Route: /admin</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-red-200 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500 transition"
                placeholder="admin@speedo.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-condensed text-lg tracking-wider rounded-xl transition shadow-lg shadow-amber-600/30 disabled:opacity-50 mt-2 font-bold"
            >
              {loading ? 'Authenticating...' : 'Sign In as Admin'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => { setEmail('admin@speedo.com'); setPassword('admin123'); }}
              className="text-amber-400 hover:text-amber-300 font-mono"
            >
              Use demo credentials
            </button>
            <button
              type="button"
              onClick={onNavigateToStore}
              className="text-white/40 hover:text-white transition flex items-center gap-1"
            >
              Back to customer site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Admin Dashboard with full CRUD
  return (
    <div className="min-h-screen bg-[#05070b] text-white flex flex-col">
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-[60] bg-emerald-600/90 backdrop-blur-sm text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-[slideIn_0.3s_ease]">
          <ShieldCheck className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0d131b] sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-condensed text-xl tracking-wider text-white font-bold">SPEEDO FLEET CONSOLE</span>
              <span className="text-[10px] text-amber-400 font-mono ml-2">/admin</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40 font-mono hidden sm:inline">
              {currentUser?.email}
            </span>
            <button
              onClick={onNavigateToStore}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white/80 hover:text-white transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#8ec5ff]" />
              <span>Customer Website</span>
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-8 flex-1 space-y-6 w-full">
        {/* Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-condensed text-3xl sm:text-4xl text-white tracking-wide">Fleet Operations</h1>
            <p className="text-xs text-white/40 mt-1 font-mono">
              Banjara Hills, Jubilee Hills, and Whitefield Hubs · Currency: INR (₹)
            </p>
          </div>
          <button
            onClick={resetAndOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition shadow-lg shadow-amber-600/30 text-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add New Vehicle
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0d131b] border border-white/5 rounded-2xl p-4">
            <p className="text-white/40 text-xs font-mono uppercase">Fleet Vehicles</p>
            <p className="font-condensed text-3xl text-white font-bold mt-1">{vehicles.length} Cars</p>
          </div>
          <div className="bg-[#0d131b] border border-white/5 rounded-2xl p-4">
            <p className="text-white/40 text-xs font-mono uppercase">Total Bookings</p>
            <p className="font-condensed text-3xl text-[#8ec5ff] font-bold mt-1">{bookings.length}</p>
          </div>
          <div className="bg-[#0d131b] border border-white/5 rounded-2xl p-4">
            <p className="text-white/40 text-xs font-mono uppercase">Currency</p>
            <p className="font-condensed text-3xl text-emerald-400 font-bold mt-1">INR (₹)</p>
          </div>
          <div className="bg-[#0d131b] border border-white/5 rounded-2xl p-4">
            <p className="text-white/40 text-xs font-mono uppercase">Hubs</p>
            <p className="font-condensed text-3xl text-white font-bold mt-1">3 Indian Hubs</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 bg-[#0d131b] border border-white/5 rounded-xl p-1 self-start w-fit">
          <button
            onClick={() => setAdminTab('fleet')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition ${adminTab === 'fleet'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
          >
            <Car className="w-3.5 h-3.5 inline mr-1.5" />Fleet Inventory
          </button>
          <button
            onClick={() => setAdminTab('bookings')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition ${adminTab === 'bookings'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 inline mr-1.5" />Reservations
          </button>
        </div>

        {/* ═══════ FLEET TAB ═══════ */}
        {adminTab === 'fleet' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, category, or location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d131b] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 transition"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-xs text-white/30 font-mono">{filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} found</p>

            {/* Vehicle Cards Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredVehicles.map(car => (
                <div key={car.id} className="bg-[#0d131b] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-all duration-300">
                  {/* Image */}
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'; }}
                    />
                    {/* Overlay Badges */}
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white/90 border border-white/10">
                        {car.category}
                      </span>
                    </div>
                    <span className={`absolute top-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${car.maintenance?.status?.includes('Due')
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      }`}>
                      {car.maintenance?.status || 'Optimal'}
                    </span>

                    {/* Image URL indicator */}
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-[10px] text-white/60 font-mono truncate flex items-center gap-1.5">
                        <Link className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{car.image?.slice(0, 60)}...</span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-white text-base">{car.name}</h3>
                        <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#8ec5ff]" /> {car.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-condensed text-xl text-white font-bold">{formatINR(car.dailyRate)}</span>
                        <p className="text-[10px] text-white/35">/ day</p>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="flex gap-2 text-[10px] text-white/50 font-mono">
                      <span className="bg-white/5 px-2 py-0.5 rounded">{car.horsepower}</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded">0-60: {car.zeroToSixty}</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded">{car.topSpeed}</span>
                    </div>

                    {/* CRUD Action Buttons */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => openEditCar(car)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#2d6cdf]/10 hover:bg-[#2d6cdf]/20 text-[#8ec5ff] rounded-xl text-xs font-semibold transition border border-[#2d6cdf]/20"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(car.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-semibold transition border border-red-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Delete Confirmation Overlay */}
                  {deleteConfirmId === car.id && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-10 p-6" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                      <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
                      <h4 className="text-white font-bold text-base mb-1">Delete Vehicle?</h4>
                      <p className="text-white/50 text-xs text-center mb-4">
                        Are you sure you want to remove <span className="text-white font-semibold">{car.name}</span> from the fleet? This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car.id)}
                          className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-600/30"
                        >
                          Confirm Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="bg-[#0d131b] border border-white/5 rounded-2xl p-12 text-center">
                <Car className="w-10 h-10 text-white/15 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No vehicles match your search</p>
                <button onClick={() => setSearchQuery('')} className="mt-3 text-xs text-amber-400 hover:text-amber-300 transition">Clear search</button>
              </div>
            )}
          </div>
        )}

        {/* ═══════ BOOKINGS TAB ═══════ */}
        {adminTab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="font-condensed text-2xl text-white">All Client Reservations</h2>
            {bookings.length === 0 ? (
              <div className="bg-[#0d131b] border border-white/5 rounded-2xl p-8 text-center text-white/40 text-sm">
                No reservations recorded yet.
              </div>
            ) : (
              <div className="bg-[#0d131b] border border-white/5 rounded-2xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/30 border-b border-white/5 text-white/40 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Booking ID</th>
                      <th className="p-3.5">Vehicle</th>
                      <th className="p-3.5">Hub</th>
                      <th className="p-3.5">Dates</th>
                      <th className="p-3.5">Days</th>
                      <th className="p-3.5">Total Paid</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 font-mono text-[#8ec5ff]">{b.id}</td>
                        <td className="p-3.5 font-bold text-white">{b.carName}</td>
                        <td className="p-3.5">{b.location}</td>
                        <td className="p-3.5 font-mono text-white/50">{b.startDate?.toString()?.slice(0, 10)} → {b.endDate?.toString()?.slice(0, 10)}</td>
                        <td className="p-3.5">{b.days} days</td>
                        <td className="p-3.5 font-bold text-white">{formatINR(b.totalPaid)}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/70 text-emerald-300 border border-emerald-800">
                            {b.status || 'Confirmed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ═══════ ADD / EDIT VEHICLE MODAL ═══════ */}
      {showAddCarModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto pt-8 pb-8">
          <div className="bg-[#0d131b] border border-white/10 rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-condensed text-2xl text-white font-bold">
                  {editingCarId ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h3>
                <p className="text-xs text-white/40 font-mono">
                  {editingCarId ? `Editing: ${formData.name}` : 'Add a new car to your fleet'}
                </p>
              </div>
              <button
                onClick={() => { setShowAddCarModal(false); setEditingCarId(null); }}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitCar} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[11px] text-white/40 uppercase font-mono mb-1">Make & Model</label>
                <input
                  type="text"
                  placeholder="e.g., Ferrari Roma Spider"
                  value={formData.name}
                  onChange={e => updateForm('name', e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              {/* Category + Rate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-white/40 uppercase font-mono mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => updateForm('category', e.target.value)}
                    className="w-full bg-[#0d131b] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                  >
                    {CATEGORY_DEFINITIONS.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-white/40 uppercase font-mono mb-1">Daily Rate (₹)</label>
                  <input
                    type="number"
                    value={formData.dailyRate}
                    onChange={e => updateForm('dailyRate', e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Specs Row */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-white/40 uppercase font-mono mb-1">Power</label>
                  <input
                    type="text" value={formData.horsepower}
                    onChange={e => updateForm('horsepower', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    placeholder="600 HP"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase font-mono mb-1">0–60</label>
                  <input
                    type="text" value={formData.zeroToSixty}
                    onChange={e => updateForm('zeroToSixty', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    placeholder="3.2s"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase font-mono mb-1">Top Speed</label>
                  <input
                    type="text" value={formData.topSpeed}
                    onChange={e => updateForm('topSpeed', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    placeholder="315 km/h"
                  />
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-[11px] text-white/40 uppercase font-mono mb-1">Transmission</label>
                <input
                  type="text" value={formData.transmission}
                  onChange={e => updateForm('transmission', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                  placeholder="8-Speed Automatic"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-[11px] text-white/40 uppercase font-mono mb-1">Location Hub</label>
                <select
                  value={formData.location}
                  onChange={e => updateForm('location', e.target.value)}
                  className="w-full bg-[#0d131b] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                >
                  {INDIAN_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* ─── IMAGE SECTION ─── */}
              <div className="space-y-3 border border-white/5 rounded-xl p-4 bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Vehicle Image</span>
                </div>

                {/* Image Source Toggle */}
                <div className="flex gap-1 bg-black/30 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => updateForm('imageSource', 'url')}
                    className={`flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition ${formData.imageSource === 'url'
                      ? 'bg-amber-600 text-white'
                      : 'text-white/40 hover:text-white'
                      }`}
                  >
                    <Link className="w-3 h-3 inline mr-1" />Paste URL
                  </button>
                  <button
                    type="button"
                    onClick={() => updateForm('imageSource', 'existing')}
                    className={`flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition ${formData.imageSource === 'existing'
                      ? 'bg-amber-600 text-white'
                      : 'text-white/40 hover:text-white'
                      }`}
                  >
                    <Layers className="w-3 h-3 inline mr-1" />Stock Gallery
                  </button>
                </div>

                {/* URL Input */}
                {formData.imageSource === 'url' && (
                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-... or any image URL"
                      value={formData.image}
                      onChange={e => updateForm('image', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-500 transition font-mono"
                    />
                    <p className="text-[10px] text-white/25 mt-1 font-mono">Paste any direct image URL (Unsplash, Imgur, Google Drive, etc.)</p>
                  </div>
                )}

                {/* Stock Gallery */}
                {formData.imageSource === 'existing' && (
                  <div className="grid grid-cols-4 gap-2">
                    {STOCK_IMAGES.map((img, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => { updateForm('image', img.url); updateForm('imageSource', 'url'); }}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${formData.image === img.url
                          ? 'border-amber-500 ring-2 ring-amber-500/30'
                          : 'border-white/5 hover:border-white/20'
                          }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-1">
                          <span className="text-[8px] text-white/80 font-mono leading-tight">{img.label}</span>
                        </div>
                        {formData.image === img.url && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                            <ShieldCheck className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Image Preview */}
                {formData.image && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/40 font-mono uppercase">Preview</span>
                      <button
                        type="button"
                        onClick={() => updateForm('image', '')}
                        className="text-[10px] text-red-400 hover:text-red-300 font-mono flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3 h-3" /> Remove Image
                      </button>
                    </div>
                    <div className="rounded-xl overflow-hidden h-32 border border-white/10 relative">
                      {!imagePreviewError ? (
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => setImagePreviewError(true)}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-red-950/20 text-red-300">
                          <AlertTriangle className="w-6 h-6 mb-1" />
                          <span className="text-xs font-mono">Image failed to load</span>
                          <span className="text-[10px] text-red-400/60 mt-0.5">Check if the URL is a direct image link</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* No image placeholder */}
                {!formData.image && (
                  <div className="rounded-xl h-24 border border-dashed border-white/10 flex flex-col items-center justify-center text-white/20">
                    <Image className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-mono">No image selected · defaults to stock photo</span>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-condensed text-base tracking-wider rounded-xl transition font-bold shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingCarId ? 'Save Changes' : 'Add Car to Fleet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}




/* ─────────── CUSTOMER STOREFRONT VIEW (/, /shop, /categories, /blogs, /rentals) ─────────── */
function CustomerStoreView({ currentPath, onNavigate, onNavigateToAdmin }) {
  const {
    currentUser,
    vehicles,
    bookings,
    bookVehicle,
    fetchInitialData,
    login,
    register,
    logout
  } = useStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCarForBooking, setSelectedCarForBooking] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Booking details
  const [agreementAgreed, setAgreementAgreed] = useState(true);
  const [bookingLocation, setBookingLocation] = useState(INDIAN_LOCATIONS[0]);
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-15');

  const filteredVehicles = vehicles.filter(car => {
    const matchesLoc = selectedLocation === 'All' || car.location === selectedLocation;
    const matchesCat = selectedCategory === 'All' || car.category === selectedCategory;
    return matchesLoc && matchesCat;
  });

  const calculateDays = (start, end) => Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000));

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!selectedCarForBooking || !agreementAgreed) return;

    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    const days = calculateDays(startDate, endDate);
    const discount = currentUser.discountRate || 0;
    const total = days * selectedCarForBooking.dailyRate * (1 - discount);

    bookVehicle({
      carId: selectedCarForBooking.id,
      carName: selectedCarForBooking.name,
      startDate,
      endDate,
      days,
      totalPaid: total,
      location: bookingLocation || selectedCarForBooking.location
    });

    setSelectedCarForBooking(null);
    onNavigate('/rentals');
  };

  // CHECK: If user is logged in as ADMIN on the customer site, show the 403 unauthorized notice
  if (currentUser && currentUser.role === 'admin') {
    return (
      <div className="min-h-screen bg-[#05070b] text-white flex flex-col font-sans">
        <header className="border-b border-white/5 bg-[#05070b]/95">
          <div className="max-w-[1360px] mx-auto px-6 h-18 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#2d6cdf] flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-condensed text-[1.85rem] tracking-[0.16em] text-white font-bold">
                SPEEDO
              </span>
            </div>
            <button
              onClick={onNavigateToAdmin}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl text-xs font-bold text-white transition"
            >
              Go to Admin Console
            </button>
          </div>
        </header>

        <AdminUnauthorizedNotice
          onNavigateToAdmin={onNavigateToAdmin}
          onLogout={logout}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070b] text-white selection:bg-[#3b82f6] selection:text-white flex flex-col font-sans">
      {/* ─────────── NAVBAR ─────────── */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#05070b]/95 backdrop-blur-md">
        <div className="max-w-[1360px] mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => onNavigate('/')} className="flex items-center gap-3 group text-left">
            <div className="w-9 h-9 rounded-lg bg-[#2d6cdf] shadow-[0_8px_24px_rgba(45,108,223,0.4)] flex items-center justify-center transition-transform group-hover:scale-105">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="font-condensed text-[1.85rem] tracking-[0.16em] text-white group-hover:text-[#93c5fd] transition font-bold">
              SPEEDO
            </span>
          </button>

          {/* Each Nav Link with its own Route */}
          <nav className="hidden md:flex items-center gap-2">
            {[
              ['/', 'Home'],
              ['/shop', 'Shop'],
              ['/categories', 'Categories'],
              ['/blogs', 'Blogs']
            ].map(([path, label]) => {
              const isActive = currentPath === path;
              return (
                <button
                  key={path}
                  onClick={() => onNavigate(path)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'text-white' : 'text-white/50 hover:text-white/90'
                    }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#4ba0ff] rounded-full shadow-[0_0_8px_#4ba0ff]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/rentals')}
              title="Reservations"
              className="relative w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            {/* Normal User Avatar / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-[#2d6cdf] flex items-center justify-center text-xs font-bold text-white">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-medium text-white/90 max-w-[100px] truncate hidden sm:inline">
                    {currentUser.name}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0d131b] border border-white/10 rounded-xl p-2 shadow-2xl z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="font-bold text-white text-xs truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-white/40 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => { onNavigate('/rentals'); setShowProfileMenu(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition"
                    >
                      My Reservations
                    </button>
                    <button
                      onClick={() => { logout(); setShowProfileMenu(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-red-300 hover:bg-red-500/10 rounded-lg transition"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition flex items-center gap-1.5"
              >
                <UserRound className="w-3.5 h-3.5 text-[#8ec5ff]" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─────────── EACH PAGE RENDERED ACCORDING TO NAV LINK ROUTE ─────────── */}
      <main className="flex-1">
        {/* PAGE 1: HOME (/) */}
        {currentPath === '/' && (
          <div>
            <section className="relative overflow-hidden min-h-[580px] lg:min-h-[660px] flex items-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(45,108,223,0.18),transparent_40%),radial-gradient(circle_at_20%_90%,rgba(14,165,233,0.12),transparent_35%)] pointer-events-none" />

              <div className="max-w-[1360px] mx-auto px-6 py-8 lg:py-12 w-full">
                <div className="grid lg:grid-cols-[1fr_1.25fr] items-center gap-8 lg:gap-4">
                  {/* Left Hero Text */}
                  <div className="z-10 max-w-[620px]">
                    <div className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.22em] text-[#93c5fd] mb-6">
                      <span className="w-2 h-2 rounded-full bg-[#4ba0ff] inline-block shadow-[0_0_8px_#4ba0ff]" />
                      Top Product Of The Month
                    </div>

                    <h1 className="font-condensed text-[4rem] sm:text-[5.4rem] lg:text-[6.6rem] leading-[0.88] tracking-[-0.04em] text-white">
                      Experience the<br />
                      road like never<br />
                      before
                    </h1>

                    <p className="max-w-xl text-base sm:text-lg text-white/55 leading-relaxed mt-6">
                      Curated fleet of exotic supercars, luxury SUVs and track machines available across Hyderabad & Bangalore.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-8">
                      <button
                        onClick={() => onNavigate('/shop')}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2d6cdf] hover:bg-[#4b7cf0] text-white font-semibold rounded-xl shadow-[0_12px_28px_rgba(45,108,223,0.35)] transition transform active:scale-95"
                      >
                        Shop Now <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onNavigate('/categories')}
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent border border-white/15 hover:border-white/30 text-white rounded-xl transition"
                      >
                        Explore Categories <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Locations */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2 text-[11px] text-white/40 font-mono">
                      <span className="inline-flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md text-white/70">
                        <MapPin className="w-3 h-3 text-[#4ba0ff]" /> Banjara Hills
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md text-white/70">
                        <MapPin className="w-3 h-3 text-[#4ba0ff]" /> Jubilee Hills
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md text-white/70">
                        <MapPin className="w-3 h-3 text-[#4ba0ff]" /> Whitefield, Bangalore
                      </span>
                    </div>
                  </div>

                  {/* Right Hero Image (Clean object-contain, no stretch) */}
                  <div className="relative flex items-center justify-center lg:justify-end w-full overflow-visible">
                    <div className="relative w-full max-w-[850px] lg:max-w-[920px] flex justify-end">
                      <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#05070b] to-transparent pointer-events-none hidden lg:block z-10" />
                      <img
                        src="./x.png"
                        alt="Ford Mustang Performance Supercar"
                        className="w-full h-auto max-h-[580px] lg:max-h-[640px] object-contain object-right drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] select-none pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Vehicles preview */}
            <section className="max-w-[1360px] mx-auto px-6 pb-20 pt-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-[#8ec5ff] font-mono tracking-[0.2em] uppercase">Indian Exotic Fleet</p>
                  <h2 className="font-condensed text-3xl tracking-wide text-white mt-1">Featured Vehicles</h2>
                </div>
                <button
                  onClick={() => onNavigate('/shop')}
                  className="text-sm text-[#8ec5ff] hover:text-white transition font-mono flex items-center gap-1"
                >
                  View All in Shop →
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {vehicles.slice(0, 3).map(car => (
                  <div
                    key={car.id}
                    className="group bg-[#0d131b] border border-white/5 rounded-2xl overflow-hidden hover:border-[#2d6cdf]/50 transition-all duration-300 cursor-pointer flex flex-col"
                    onClick={() => {
                      setSelectedCarForBooking(car);
                      setBookingLocation(car.location);
                    }}
                  >
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-[10px] text-white/80 font-mono px-2.5 py-1 rounded-lg">
                        {car.category}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="flex items-center gap-1 text-xs text-white/40 mb-1.5">
                          <MapPin className="w-3 h-3 text-[#8ec5ff]" /> {car.location}
                        </p>
                        <h3 className="font-bold text-white text-lg tracking-wide">{car.name}</h3>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <span className="font-condensed text-2xl text-white font-bold">
                            {formatINR(car.dailyRate)}
                          </span>
                          <span className="text-xs text-white/35 font-normal"> / day</span>
                        </div>
                        <span className="text-xs text-white/70 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">
                          {car.horsepower}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* PAGE 2: SHOP (/shop) */}
        {currentPath === '/shop' && (
          <div className="max-w-[1360px] mx-auto px-6 py-10 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6">
              <div>
                <p className="text-[11px] text-[#8ec5ff] font-mono tracking-[0.24em] uppercase">Fleet Catalog</p>
                <h2 className="font-condensed text-3xl sm:text-4xl text-white tracking-wide mt-1">Available Fleet</h2>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2.5">
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="bg-[#0d131b] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4ba0ff]"
                >
                  <option value="All">All Locations</option>
                  {INDIAN_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="bg-[#0d131b] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4ba0ff]"
                >
                  <option value="All">All Categories</option>
                  {CATEGORY_DEFINITIONS.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVehicles.map(car => {
                const discount = currentUser?.discountRate || 0;
                const discountedRate = Math.round(car.dailyRate * (1 - discount));

                return (
                  <div
                    key={car.id}
                    className="group bg-[#0d131b] border border-white/5 rounded-2xl overflow-hidden hover:border-[#2d6cdf]/50 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-[10px] text-white/80 font-mono px-2.5 py-1 rounded-lg">
                        {car.category}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-condensed text-2xl text-white tracking-wide font-bold">{car.name}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-white/40">
                        <MapPin className="w-3.5 h-3.5 text-[#8ec5ff]" /> {car.location}
                      </p>

                      <div className="grid grid-cols-3 gap-2 mt-4 bg-black/30 rounded-xl p-3 text-center border border-white/5">
                        <div>
                          <p className="text-[9px] uppercase text-white/30 font-mono">Power</p>
                          <p className="mt-1 text-xs font-bold text-white">{car.horsepower}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase text-white/30 font-mono">0–60</p>
                          <p className="mt-1 text-xs font-bold text-[#8ec5ff]">{car.zeroToSixty}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase text-white/30 font-mono">Top Speed</p>
                          <p className="mt-1 text-xs font-bold text-white">{car.topSpeed || '290 km/h'}</p>
                        </div>
                      </div>

                      <div className="flex items-end justify-between gap-3 mt-5 pt-3 border-t border-white/5">
                        <div>
                          {discount > 0 && (
                            <p className="text-[11px] text-white/30 line-through font-mono">
                              {formatINR(car.dailyRate)}/day
                            </p>
                          )}
                          <p className="font-condensed text-2xl sm:text-3xl text-white font-bold">
                            {formatINR(discountedRate)}
                            <span className="text-xs text-white/35 font-normal"> / day</span>
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCarForBooking(car);
                            setBookingLocation(car.location);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-[#2d6cdf] hover:bg-[#4b7cf0] text-white text-xs sm:text-sm font-bold transition shadow-md"
                        >
                          Reserve
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PAGE 3: CATEGORIES (/categories) */}
        {currentPath === '/categories' && (
          <div className="max-w-[1360px] mx-auto px-6 py-10 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#8ec5ff] text-xs font-mono tracking-widest uppercase">
                <Layers className="w-3.5 h-3.5" /> Fleet Classifications
              </span>
              <h2 className="font-condensed text-4xl sm:text-5xl text-white tracking-wide">
                Vehicle Categories
              </h2>
              <p className="text-sm sm:text-base text-white/50 leading-relaxed">
                Discover performance tiers engineered for track days, city cruising, and long expressways.
              </p>
            </div>

            {/* Category Cards Showcase */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CATEGORY_DEFINITIONS.map(cat => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(isSelected ? 'All' : cat.id)}
                    className={`rounded-2xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${isSelected
                      ? 'bg-[#121a26] border-[#4ba0ff] shadow-[0_15px_35px_rgba(59,130,246,0.25)]'
                      : 'bg-[#0d131b] border-white/5 hover:border-white/20'
                      }`}
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 text-[#4ba0ff]">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="font-condensed text-2xl text-white font-bold">{cat.title}</h3>
                      <p className="text-[11px] text-[#8ec5ff] font-mono mt-0.5">{cat.subtitle}</p>
                      <p className="text-xs text-white/50 leading-relaxed mt-3">
                        {cat.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-white/40">Starting from</span>
                      <span className="text-white font-bold">{formatINR(cat.startingPrice)}/day</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filtered Vehicles for selected category */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-condensed text-2xl text-white tracking-wide">
                    {selectedCategory === 'All' ? 'All Fleet Vehicles' : `${selectedCategory}`}
                  </h3>
                  <p className="text-xs text-white/40 font-mono mt-0.5">
                    Showing {filteredVehicles.length} available vehicles
                  </p>
                </div>

                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="text-xs text-[#8ec5ff] hover:text-white transition font-mono"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map(car => (
                  <div
                    key={car.id}
                    className="group bg-[#0d131b] border border-white/5 rounded-2xl overflow-hidden hover:border-[#2d6cdf]/50 transition-all duration-300"
                  >
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-[10px] text-white/80 font-mono px-2.5 py-1 rounded-lg">
                        {car.category}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h4 className="font-bold text-white text-lg">{car.name}</h4>
                        <p className="text-xs text-white/40 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-[#8ec5ff]" /> {car.location}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="font-condensed text-2xl text-white font-bold">{formatINR(car.dailyRate)}/day</span>
                        <button
                          onClick={() => {
                            setSelectedCarForBooking(car);
                            setBookingLocation(car.location);
                          }}
                          className="px-4 py-2 bg-[#2d6cdf] hover:bg-[#4b7cf0] text-white rounded-xl text-xs font-bold transition shadow-md"
                        >
                          Reserve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PAGE 4: BLOGS (/blogs) */}
        {currentPath === '/blogs' && (
          <div className="max-w-[1360px] mx-auto px-6 py-10 space-y-8">
            <div className="border-b border-white/5 pb-6">
              <p className="text-[11px] text-[#8ec5ff] font-mono tracking-[0.24em] uppercase">Speedo Journal</p>
              <h2 className="font-condensed text-3xl sm:text-4xl text-white tracking-wide mt-1">Stories From The Road</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Hyderabad Outer Ring Road in a 911 GT3 RS',
                  date: 'OCTOBER 2026',
                  author: 'Arjun Reddy',
                  excerpt: 'Experiencing 518 naturally aspirated horsepower across Hyderabad’s premier expressways.',
                  image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80'
                },
                {
                  title: 'Bangalore to Coorg Coffee Trails in the AMG G 63',
                  date: 'SEPTEMBER 2026',
                  author: 'Rohit Varma',
                  excerpt: 'Tackling the twisty Western Ghats with twin-turbo V8 poise and bespoke luxury.',
                  image: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80'
                },
                {
                  title: 'Whitefield to Airport in the RS e-tron GT',
                  date: 'AUGUST 2026',
                  author: 'Sameer Rao',
                  excerpt: 'Instant 637-horsepower electric launch and silent cruising in Bangalore’s high-tech hub.',
                  image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80'
                }
              ].map((blog, idx) => (
                <div key={idx} className="bg-[#0d131b] border border-white/5 rounded-2xl overflow-hidden hover:border-[#2d6cdf]/40 transition group">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#8ec5ff]">
                      <span>{blog.date}</span>
                      <span className="text-white/40">{blog.author}</span>
                    </div>
                    <h3 className="font-bold text-white text-lg group-hover:text-[#93c5fd] transition">{blog.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed">{blog.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 5: RESERVATIONS (/rentals) */}
        {currentPath === '/rentals' && (
          <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <p className="text-[11px] text-[#8ec5ff] font-mono tracking-[0.24em] uppercase">Account</p>
                <h2 className="font-condensed text-3xl text-white tracking-wide mt-1">My Reservations</h2>
              </div>
              <button
                onClick={() => onNavigate('/shop')}
                className="px-4 py-2 bg-[#2d6cdf] hover:bg-[#4b7cf0] text-white text-xs font-bold rounded-xl transition"
              >
                Browse Fleet
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-[#0d131b] text-center py-16">
                <Car className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-condensed text-2xl text-white/70">No reservations booked yet</p>
                <button
                  onClick={() => onNavigate('/shop')}
                  className="mt-5 px-6 py-2.5 rounded-xl bg-[#2d6cdf] hover:bg-[#4b7cf0] text-white font-bold transition text-sm"
                >
                  Explore Supercars
                </button>
              </div>
            ) : (
              bookings.map(b => {
                const carImage = vehicles.find(v => v.id === b.carId)?.image || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80';
                return (
                  <div key={b.id} className="bg-[#0d131b] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-60 h-44 sm:h-auto shrink-0">
                        <img src={carImage} alt={b.carName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-5 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-700/50 uppercase">
                              {b.status || 'Confirmed'}
                            </span>
                            <h3 className="font-condensed text-2xl text-white mt-2 font-bold">{b.carName}</h3>
                            <p className="text-xs text-white/40 mt-1">
                              <MapPin className="inline w-3 h-3 mr-1 text-[#8ec5ff]" />
                              {b.location} · {b.days} days
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] text-white/40">Total Paid (INR)</p>
                            <p className="font-condensed text-2xl sm:text-3xl text-white font-bold">
                              {formatINR(b.totalPaid)}
                            </p>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-2 text-xs">
                          <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                            <p className="text-white/40 mb-1">Pick-up</p>
                            <p className="text-white font-mono">{b.startDate?.toString()?.slice(0, 10)}</p>
                          </div>
                          <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                            <p className="text-white/40 mb-1">Return</p>
                            <p className="text-white font-mono">{b.endDate?.toString()?.slice(0, 10)}</p>
                          </div>
                          <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                            <p className="text-white/40 mb-1">Booking Reference</p>
                            <p className="text-white/70 font-mono truncate">{b.id}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="border-t border-white/5 py-8 mt-12 bg-[#05070b]">
        <div className="max-w-[1360px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 font-mono">
          <div>
            <span className="font-bold text-white/70">SPEEDO FLEET INDIA</span>
            <span className="ml-2">· Banjara Hills · Jubilee Hills · Whitefield</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={onNavigateToAdmin}
              className="text-white/30 hover:text-amber-400 transition flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal (/admin)</span>
            </button>
            <span>© 2026 SPEEDO MOTORS</span>
          </div>
        </div>
      </footer>

      {/* ─────────── BOOKING MODAL ─────────── */}
      {selectedCarForBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d131b] border border-white/10 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-condensed text-2xl text-white font-bold">{selectedCarForBooking.name}</h3>
                <p className="text-xs text-[#8ec5ff] font-mono mt-0.5">{selectedCarForBooking.category}</p>
              </div>
              <button
                onClick={() => setSelectedCarForBooking(null)}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-xl transition text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="block text-[11px] text-white/40 uppercase font-mono mb-1.5">Pick-up Location</label>
                <select
                  value={bookingLocation}
                  onChange={e => setBookingLocation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4ba0ff]"
                >
                  {INDIAN_LOCATIONS.map(loc => (
                    <option key={loc} value={loc} className="bg-[#0d131b]">{loc}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-white/40 uppercase font-mono mb-1.5">Pick-up Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4ba0ff]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/40 uppercase font-mono mb-1.5">Return Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4ba0ff]"
                  />
                </div>
              </div>

              <div className="bg-black/30 rounded-xl p-3.5 text-xs space-y-1.5 border border-white/5">
                <p className="text-white/40 font-mono uppercase text-[10px]">Rental Liability Waiver</p>
                <p className="text-white/40 leading-relaxed text-[11px]">Includes comprehensive zero-depreciation insurance, 24/7 roadside assistance, and speed telemetry protocols.</p>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreementAgreed}
                    onChange={e => setAgreementAgreed(e.target.checked)}
                    className="accent-[#2d6cdf] w-4 h-4 rounded"
                  />
                  <span className="text-white/70 text-xs">I accept the terms and track protocol</span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div>
                  <p className="text-xs text-white/40">Total ({calculateDays(startDate, endDate)} days)</p>
                  <p className="font-condensed text-3xl text-white font-bold">
                    {formatINR(calculateDays(startDate, endDate) * selectedCarForBooking.dailyRate * (1 - (currentUser?.discountRate || 0)))}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={!agreementAgreed}
                  className="px-6 py-3 bg-[#2d6cdf] hover:bg-[#4b7cf0] disabled:opacity-40 text-white font-condensed text-lg tracking-wider rounded-xl transition shadow-lg shadow-[#2d6cdf]/30"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────── CUSTOMER AUTH MODAL ─────────── */}
      <CustomerAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={login}
        onRegister={register}
        onNavigateToAdmin={onNavigateToAdmin}
      />
    </div>
  );
}

/* ─────────── ROOT APP WITH CLEAN ROUTING FOR EACH NAV LINK ─────────── */
export default function App() {
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    const normalized = normalizePath(path);
    window.history.pushState({}, '', normalized);
    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPath === '/admin') {
    return <AdminRouteView onNavigateToStore={() => navigateTo('/')} />;
  }

  return (
    <CustomerStoreView
      currentPath={currentPath}
      onNavigate={navigateTo}
      onNavigateToAdmin={() => navigateTo('/admin')}
    />
  );
}
