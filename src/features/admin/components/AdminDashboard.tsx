import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  DollarSign,
  Clock,
  Gamepad2,
  Sparkles,
  QrCode,
  Plus,
  Coffee,
  Check,
  RotateCcw,
  Printer,
  Sliders,
  TrendingUp,
  Percent,
  Settings,
  Gift,
  Trophy,
  Users,
  Star,
  Tag,
  Flame,
  Utensils,
  Layers,
  ChevronRight,
  Filter,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Building2,
  Download,
  Upload,
  Copy,
  Edit3,
  Trash2,
  ExternalLink,
  Code2,
  BookOpen,
  Leaf,
  Search,
} from 'lucide-react';
import { useCafe } from '../../../context/CafeContext';
import { LuckyDrawCampaign, PromotionalBanner, SystemSettings, RestaurantProfile, Product } from '../../../types';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    products,
    categories,
    toggleProductAvailability,
    addProduct,
    deleteProduct,
    tables,
    setScannedTableNumber,
    setViewRole,
    resetAllDemoData,
    campaigns,
    activeCampaign,
    createCampaign,
    conductCampaignDraw,
    toggleCampaignStatus,
    promotionalBanners,
    addBanner,
    systemSettings,
    updateSystemSettings,
    feedbacks,
    multiplayerRooms,
    restaurants,
    currentRestaurantId,
    currentRestaurant,
    switchRestaurant,
    addRestaurant,
    updateCurrentRestaurant,
    deleteRestaurant,
    importRestaurantData,
    exportRestaurantData,
    gamesRegistry,
    toggleGameForRestaurant,
  } = useCafe();

  const customerFeedbacks = feedbacks || [];

  // Operations analytics dynamically
  const analytics = useMemo(() => {
    const totalOrders = orders.length;
    const servedOrders = orders.filter((o) => o.orderStatus === 'served');
    const prepTimes = orders.map((o) => o.estimatedWaitMinutes || 8);
    const avgPrep = prepTimes.length
      ? Math.round(prepTimes.reduce((a, b) => a + b, 0) / prepTimes.length)
      : 7;
    const avgTableWait = Math.max(3, Math.round(avgPrep * 0.8));
    const activeRoomsCount = multiplayerRooms?.length || 0;
    const playedMatches = Math.max(12, totalOrders * 2 + activeRoomsCount);

    return {
      avgPrepTimeMinutes: avgPrep,
      avgTableWaitMinutes: avgTableWait,
      gamesPlayed: playedMatches,
      totalOrders,
      servedOrders: servedOrders.length,
    };
  }, [orders, multiplayerRooms]);

  const [activeTab, setActiveTab] = useState<
    'restaurants' | 'menu' | 'games' | 'analytics' | 'funnel' | 'campaigns' | 'banners' | 'tables' | 'settings'
  >('restaurants');

  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days' | 'all'>('all');

  // Menu Search & Filter in Admin
  const [adminMenuSearch, setAdminMenuSearch] = useState('');
  const [adminMenuCategory, setAdminMenuCategory] = useState('all');

  // New Product Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories[0]?.id || 'burgers-sandwiches');
  const [newProdPrep, setNewProdPrep] = useState('7');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdVeg, setNewProdVeg] = useState(true);
  const [newProdPopular, setNewProdPopular] = useState(false);
  const [newProdChef, setNewProdChef] = useState(false);

  // New Restaurant Modal
  const [showAddRestaurantModal, setShowAddRestaurantModal] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestTagline, setNewRestTagline] = useState('');
  const [newRestCuisine, setNewRestCuisine] = useState('');
  const [newRestLogo, setNewRestLogo] = useState('🍽️');
  const [newRestHero, setNewRestHero] = useState(
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
  );
  const [newRestAddress, setNewRestAddress] = useState('');
  const [newRestPhone, setNewRestPhone] = useState('');
  const [newRestGST, setNewRestGST] = useState('');
  const [newRestHours, setNewRestHours] = useState('9:00 AM – 11:00 PM');
  const [newRestTables, setNewRestTables] = useState('10');
  const [newRestWifiSSID, setNewRestWifiSSID] = useState('');
  const [newRestWifiPass, setNewRestWifiPass] = useState('');
  const [cloneCurrentMenu, setCloneCurrentMenu] = useState(true);

  // Edit Current Restaurant Modal
  const [showEditRestaurantModal, setShowEditRestaurantModal] = useState(false);
  const [editRestName, setEditRestName] = useState(currentRestaurant.name);
  const [editRestTagline, setEditRestTagline] = useState(currentRestaurant.tagline);
  const [editRestCuisine, setEditRestCuisine] = useState(currentRestaurant.cuisine);
  const [editRestAddress, setEditRestAddress] = useState(currentRestaurant.address);
  const [editRestPhone, setEditRestPhone] = useState(currentRestaurant.phone);
  const [editRestGST, setEditRestGST] = useState(currentRestaurant.gstNumber);
  const [editRestWifiPass, setEditRestWifiPass] = useState(
    currentRestaurant.wifiDetails?.password || ''
  );

  // Import / Export JSON modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [exportCopied, setExportCopied] = useState(false);

  // New Campaign Form
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [campTitle, setCampTitle] = useState('');
  const [campDesc, setCampDesc] = useState('');
  const [campPrizeTitle, setCampPrizeTitle] = useState('');
  const [campPrizeValue, setCampPrizeValue] = useState('₹500 Voucher');
  const [campDrawDate, setCampDrawDate] = useState('Every Sunday 8:00 PM');
  const [campValidityDays, setCampValidityDays] = useState(2);
  const [campMaxWinners, setCampMaxWinners] = useState(1);

  // New Banner Form
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerDesc, setBannerDesc] = useState('');
  const [bannerBadge, setBannerBadge] = useState('Offer');

  // Quick Preset Food Images for Dish Creator
  const FOOD_IMAGE_PRESETS = [
    { label: '🍔 Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
    { label: '🍕 Pizza', url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80' },
    { label: '🍟 Fries', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80' },
    { label: '🥪 Sandwich', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80' },
    { label: '☕ Chai / Coffee', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80' },
    { label: '🥤 Shake', url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80' },
    { label: '🥟 Momos', url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80' },
    { label: '🍜 Noodles', url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80' },
    { label: '🧇 Waffle', url: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80' },
    { label: '🍫 Brownie', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
  ];

  // Calculations & Metrics
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const servedOrdersCount = orders.filter((o) => o.orderStatus === 'served').length;

  const avgFoodRating = customerFeedbacks.length
    ? (customerFeedbacks.reduce((sum, f) => sum + f.foodRating, 0) / customerFeedbacks.length).toFixed(1)
    : '4.8';
  const avgWaitingRating = customerFeedbacks.length
    ? (customerFeedbacks.reduce((sum, f) => sum + f.waitingRating, 0) / customerFeedbacks.length).toFixed(1)
    : '4.7';

  // Product Creation
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    addProduct({
      name: newProdName,
      description: newProdDesc,
      price: parseFloat(newProdPrice),
      categoryId: newProdCategory,
      prepTimeMinutes: parseInt(newProdPrep, 10) || 7,
      imageUrl:
        newProdImage ||
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
      available: true,
      popular: newProdPopular,
      vegetarian: newProdVeg,
      chefSpecial: newProdChef,
    });

    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdDesc('');
    setNewProdPrice('');
    setNewProdImage('');
  };

  // Restaurant Creation
  const handleCreateRestaurantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName || !newRestCuisine) return;

    addRestaurant({
      name: newRestName,
      tagline: newRestTagline || `${newRestCuisine} with Zero-Wait Dining`,
      cuisine: newRestCuisine,
      logo: newRestLogo || '🍽️',
      heroBanner: newRestHero,
      accentColor: 'amber',
      address: newRestAddress || 'Food Boulevard, Main Street',
      phone: newRestPhone || '+91 98000 12345',
      gstNumber: newRestGST || '07AABCD1234E1Z1',
      openingHours: newRestHours || '9:00 AM - 11:00 PM',
      currencySymbol: '₹',
      taxRatePercent: 5,
      rating: 4.8,
      totalReviews: 24,
      wifiDetails: newRestWifiSSID
        ? { ssid: newRestWifiSSID, password: newRestWifiPass || 'CafeFreeWifi' }
        : undefined,
      tableCount: parseInt(newRestTables, 10) || 10,
      tables: [],
      categories: cloneCurrentMenu ? [...categories] : [],
      products: cloneCurrentMenu ? [...products] : [],
      enabledGameIds: ['memory-flip', 'spin-wheel', 'cafe-quiz', 'reaction-test', 'tictactoe-multi'],
    });

    setShowAddRestaurantModal(false);
    setNewRestName('');
    setNewRestTagline('');
    setNewRestCuisine('');
  };

  // Edit Current Restaurant Profile
  const handleSaveRestaurantProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentRestaurant({
      name: editRestName,
      tagline: editRestTagline,
      cuisine: editRestCuisine,
      address: editRestAddress,
      phone: editRestPhone,
      gstNumber: editRestGST,
      wifiDetails: currentRestaurant.wifiDetails
        ? { ...currentRestaurant.wifiDetails, password: editRestWifiPass }
        : undefined,
    });
    setShowEditRestaurantModal(false);
  };

  const handleExportCopy = () => {
    const jsonStr = exportRestaurantData();
    navigator.clipboard?.writeText(jsonStr);
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2000);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importJsonText);
      importRestaurantData(parsed);
      setShowImportModal(false);
      setImportJsonText('');
    } catch (err: any) {
      alert('Failed to parse JSON: ' + err.message);
    }
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitle || !campPrizeTitle) return;

    createCampaign({
      title: campTitle,
      description: campDesc,
      frequency: 'weekly',
      prizeTitle: campPrizeTitle,
      prizeValue: campPrizeValue,
      drawDate: campDrawDate,
      validityDays: campValidityDays,
      maxWinners: campMaxWinners,
      isActive: true,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    });

    setShowAddCampaignModal(false);
    setCampTitle('');
    setCampDesc('');
    setCampPrizeTitle('');
  };

  const handleCreateBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle) return;

    addBanner({
      title: bannerTitle,
      description: bannerDesc,
      badge: bannerBadge,
      isActive: true,
    });

    setShowAddBannerModal(false);
    setBannerTitle('');
    setBannerDesc('');
  };

  // Filtered menu for admin table
  const adminFilteredProducts = products.filter((p) => {
    const matchesCat = adminMenuCategory === 'all' || p.categoryId === adminMenuCategory;
    const matchesQ =
      !adminMenuSearch ||
      p.name.toLowerCase().includes(adminMenuSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(adminMenuSearch.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      {/* 👑 HEADER COMMAND CENTER */}
      <div className="bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-black text-xl sm:text-2xl text-stone-100">
                Multi-Restaurant & Operations Hub
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {currentRestaurant.name}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Multi-Tenant Architecture • Dynamic Menu Engine • Extensible Games Registry • Live Analytics
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo state back to default restaurant data?')) {
                resetAllDemoData();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* 🧭 PRIMARY NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-800 scrollbar-none">
        {[
          { id: 'restaurants', label: 'Multi-Restaurant Hub', icon: Building2 },
          { id: 'menu', label: `Menu Catalog (${products.length})`, icon: Coffee },
          { id: 'games', label: `Games Engine (${gamesRegistry.length})`, icon: Gamepad2 },
          { id: 'analytics', label: 'Sales & Wait Metrics', icon: BarChart3 },
          { id: 'funnel', label: 'Customer Funnel', icon: TrendingUp },
          { id: 'campaigns', label: 'Lucky Draw Campaigns', icon: Gift },
          { id: 'banners', label: 'Promotional Banners', icon: Tag },
          { id: 'tables', label: 'Table Stands QR', icon: QrCode },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ].map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-900/80 border border-stone-800 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 🏢 TAB 1: MULTI-RESTAURANT HUB */}
      {/* ======================================================== */}
      {activeTab === 'restaurants' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-lg text-stone-100">
                Restaurant Outlets & Franchises ({restaurants.length})
              </h3>
              <p className="text-xs text-stone-400">
                Switch between restaurants, onboard new branches, edit branding, and export/import configurations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Import JSON</span>
              </button>

              <button
                onClick={handleExportCopy}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {exportCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5 text-amber-400" />}
                <span>{exportCopied ? 'Copied JSON!' : 'Export Active JSON'}</span>
              </button>

              <button
                onClick={() => setShowAddRestaurantModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Restaurant</span>
              </button>
            </div>
          </div>

          {/* Restaurant Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {restaurants.map((rest) => {
              const isSelected = rest.id === currentRestaurantId;
              return (
                <div
                  key={rest.id}
                  className={`p-5 rounded-3xl border transition flex flex-col justify-between space-y-4 shadow-md ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-amber-950/40'
                      : 'border-stone-800 bg-stone-900/90 hover:border-stone-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-2xl bg-stone-950 border border-stone-800 shadow">
                          {rest.logo || '🍽️'}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-display font-bold text-base text-stone-100">
                              {rest.name}
                            </h4>
                          </div>
                          <span className="text-xs text-amber-300 font-medium">{rest.cuisine}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active Now
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {rest.tagline}
                    </p>

                    <div className="pt-2 border-t border-stone-800/80 grid grid-cols-2 gap-2 text-xs text-stone-300">
                      <div>
                        <span className="text-stone-500 block text-[10px]">Tables & QR</span>
                        <strong className="text-stone-200">{rest.tableCount || rest.tables?.length || 10} Tables</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Menu Catalog</span>
                        <strong className="text-stone-200">{rest.products?.length || 0} Dishes</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Rating</span>
                        <strong className="text-amber-400 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {rest.rating || 4.8} ({rest.totalReviews || 120})
                        </strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">GST Tax</span>
                        <strong className="text-stone-200">{rest.taxRatePercent || 5}% GST</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                    {isSelected ? (
                      <button
                        onClick={() => {
                          setEditRestName(rest.name);
                          setEditRestTagline(rest.tagline);
                          setEditRestCuisine(rest.cuisine);
                          setEditRestAddress(rest.address);
                          setEditRestPhone(rest.phone);
                          setEditRestGST(rest.gstNumber);
                          setEditRestWifiPass(rest.wifiDetails?.password || '');
                          setShowEditRestaurantModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => switchRestaurant(rest.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition shadow"
                      >
                        Switch to this Restaurant
                      </button>
                    )}

                    {restaurants.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${rest.name}" from network?`)) {
                            deleteRestaurant(rest.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-stone-950 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 transition"
                        title="Delete Restaurant"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🍔 TAB 2: MENU CATALOG MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-lg text-stone-100">
                Menu Items for {currentRestaurant.name} ({products.length})
              </h3>
              <p className="text-xs text-stone-400">
                Add dishes, edit pricing, toggle availability (86 item sold-out status), or customize image cards.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={adminMenuSearch}
                onChange={(e) => setAdminMenuSearch(e.target.value)}
                placeholder="Filter dishes by name or keyword..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs text-stone-400 shrink-0">Category:</label>
              <select
                value={adminMenuCategory}
                onChange={(e) => setAdminMenuCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dishes Table */}
          <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="p-3.5">Dish</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Prep</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {adminFilteredProducts.map((p) => {
                    const cat = categories.find((c) => c.id === p.categoryId);
                    return (
                      <tr key={p.id} className="hover:bg-stone-800/40 transition">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-stone-100 text-sm">{p.name}</span>
                                {p.popular && (
                                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500 text-stone-950 font-black">
                                    ★ Hot
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                                {p.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 font-medium text-stone-300">
                          {cat?.name || p.categoryId}
                        </td>

                        <td className="p-3.5 font-mono font-bold text-amber-400 text-sm">
                          ₹{p.price}
                        </td>

                        <td className="p-3.5 font-mono text-stone-400">
                          ~{p.prepTimeMinutes}m
                        </td>

                        <td className="p-3.5">
                          {p.vegetarian ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold text-[10px]">
                              🌱 Veg
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-rose-950 text-rose-400 border border-rose-800/60 font-semibold text-[10px]">
                              🍗 Non-Veg
                            </span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <button
                            onClick={() => toggleProductAvailability(p.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                              p.available
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-emerald-500/20 hover:text-emerald-300'
                            }`}
                          >
                            {p.available ? 'In Stock' : 'Sold Out (86)'}
                          </button>
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-stone-950 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 transition"
                            title="Delete Dish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🎮 TAB 3: GAMES ENGINE & LOUNGE MANAGER */}
      {/* ======================================================== */}
      {activeTab === 'games' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-lg text-stone-100">
                Waiting Lounge Games Engine ({gamesRegistry.length} Registered)
              </h3>
              <p className="text-xs text-stone-400">
                Toggle which zero-wait games are available for patrons of {currentRestaurant.name} while their food prepares.
              </p>
            </div>

            <button
              onClick={() => setViewRole('customer')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Preview Customer Lounge</span>
            </button>
          </div>

          {/* Games List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gamesRegistry.map((game) => {
              const isEnabled = currentRestaurant.enabledGameIds?.includes(game.id);
              return (
                <div
                  key={game.id}
                  className={`p-5 rounded-3xl border transition flex flex-col justify-between space-y-3 ${
                    isEnabled
                      ? 'border-purple-500/40 bg-purple-950/20 shadow-md'
                      : 'border-stone-800 bg-stone-900/60 opacity-60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 rounded-xl bg-stone-950 border border-stone-800">
                          {game.icon === 'Brain' ? '🧠' : game.icon === 'Gift' ? '🎁' : game.icon === 'Timer' ? '⚡' : game.icon === 'Users' ? '👥' : game.icon === 'Dices' ? '🎲' : '🎮'}
                        </span>
                        <div>
                          <h4 className="font-display font-bold text-base text-stone-100">
                            {game.title}
                          </h4>
                          <span className="text-xs text-purple-300 font-medium">
                            {game.category.toUpperCase()} • {game.difficulty}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleGameForRestaurant(game.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                          isEnabled
                            ? 'bg-emerald-500 text-stone-950'
                            : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed">
                      {game.description}
                    </p>

                    <div className="pt-2 text-[11px] text-stone-400 space-y-1">
                      <p><strong>Rules:</strong> {game.howToPlay}</p>
                      {game.prepRewardDiscount && (
                        <p className="text-amber-400 font-semibold">
                          🎁 Prep Reward: {game.prepRewardDiscount}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 💡 DEVELOPER & RESTAURANT EXTENSIBILITY BLUEPRINT */}
          <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Code2 className="w-5 h-5" />
              <span>Extensibility Guide: How to Add New Games in Code</span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Adding new mini-games or activities to this application requires only <strong>2 simple steps</strong>:
            </p>

            <div className="p-4 rounded-2xl bg-stone-950 font-mono text-xs text-stone-300 space-y-2 border border-stone-800">
              <p className="text-stone-500">// 1. In src/data/gamesRegistry.ts, append your game metadata:</p>
              <pre className="text-amber-300 overflow-x-auto text-[11px]">
{`DEFAULT_GAMES_REGISTRY.push({
  id: 'burger-stacker',
  title: 'Burger Stacker Frenzy',
  category: 'single',
  icon: 'Layers',
  difficulty: 'Quick',
  prepRewardDiscount: 'Free Extra Cheese',
  howToPlay: 'Stack falling toppings in the right order!',
  isEnabled: true,
});`}
              </pre>
              <p className="text-stone-500 pt-2">// 2. In src/components/customer/GamesLounge.tsx, render your game view:</p>
              <pre className="text-purple-300 overflow-x-auto text-[11px]">
{`case 'burger-stacker':
  return <BurgerStackerGame onReward={(perk) => claimPerk(perk)} />;`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 📊 TAB 4: SALES & WAITING METRICS */}
      {/* ======================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-sm space-y-2">
              <span className="text-xs text-stone-400 block">Total Revenue</span>
              <h3 className="font-mono font-black text-2xl sm:text-3xl text-stone-100">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </h3>
              <p className="text-[11px] text-stone-500">From {orders.length} orders across outlets</p>
            </div>

            <div className="p-5 rounded-3xl bg-stone-900 border border-amber-500/30 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-300">
                <span className="font-bold">Waiting Experience</span>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <h3 className="font-mono font-black text-2xl sm:text-3xl text-amber-400">
                {avgWaitingRating} / 5.0
              </h3>
              <p className="text-[11px] text-stone-400">Measured across customer waiting sessions</p>
            </div>

            <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-sm space-y-2">
              <span className="text-xs text-stone-400 block">Average Prep Time</span>
              <h3 className="font-mono font-black text-2xl sm:text-3xl text-stone-100">
                ~{analytics.avgPrepTimeMinutes} mins
              </h3>
              <p className="text-[11px] text-stone-500">Parallel kitchen throughput</p>
            </div>

            <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-sm space-y-2">
              <span className="text-xs text-stone-400 block">Lounge Games Played</span>
              <h3 className="font-mono font-black text-2xl sm:text-3xl text-purple-400">
                {analytics.gamesPlayed}
              </h3>
              <p className="text-[11px] text-stone-500">Zero-wait customer engagement</p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🎁 TAB 5: CAMPAIGNS */}
      {/* ======================================================== */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-stone-100">
                Lucky Draw Campaigns
              </h3>
              <p className="text-xs text-stone-400">
                Reward dining customers with automated weekend lotteries & vouchers
              </p>
            </div>
            <button
              onClick={() => setShowAddCampaignModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300">
                    {c.frequency} Draw
                  </span>
                  <button
                    onClick={() => toggleCampaignStatus(c.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      c.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <h4 className="font-display font-bold text-base text-stone-100">{c.title}</h4>
                <p className="text-xs text-stone-400">{c.description}</p>
                <div className="pt-2 text-xs text-stone-300">
                  Prize: <strong className="text-amber-400">{c.prizeValue}</strong> • Draw: {c.drawDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🏷️ TAB 6: BANNERS */}
      {/* ======================================================== */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-stone-100">
                Promotional Banners
              </h3>
              <p className="text-xs text-stone-400">Live announcements on the customer menu page</p>
            </div>
            <button
              onClick={() => setShowAddBannerModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promotionalBanners.map((b) => (
              <div key={b.id} className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                  {b.badge}
                </span>
                <h4 className="font-display font-bold text-stone-100">{b.title}</h4>
                <p className="text-xs text-stone-400">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 📱 TAB 7: TABLE SEATING STANDS QR */}
      {/* ======================================================== */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
            <strong>Table Seating QR Stands for {currentRestaurant.name}:</strong> Scan any code to test customer table seating.
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tables.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-3xl bg-stone-900 border border-stone-800 text-center space-y-3"
              >
                <div className="w-20 h-20 mx-auto rounded-2xl bg-white p-2 flex items-center justify-center shadow-inner">
                  <QrCode className="w-full h-full text-stone-950" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-lg text-stone-100">
                    Table #{t.number}
                  </h4>
                  <span className="text-[10px] text-stone-400">{t.seats} Seats • {t.status}</span>
                </div>
                <button
                  onClick={() => {
                    setScannedTableNumber(t.number);
                    setViewRole('customer');
                  }}
                  className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
                >
                  Simulate QR Scan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ⚙️ TAB 8: SYSTEM SETTINGS */}
      {/* ======================================================== */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-stone-100">
              Operational Rules & Policies
            </h3>
            <p className="text-xs text-stone-400">Configure global app behaviors</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-200 block">Game Access Duration</span>
                <span className="text-stone-400 text-[11px]">Minutes allowed in lounge after order confirmation</span>
              </div>
              <input
                type="number"
                value={systemSettings.gameAccessDurationMinutes}
                onChange={(e) =>
                  updateSystemSettings({ gameAccessDurationMinutes: parseInt(e.target.value, 10) || 60 })
                }
                className="w-20 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-center font-mono font-bold text-amber-400"
              />
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-200 block">GST Tax Rate (%)</span>
                <span className="text-stone-400 text-[11px]">Default Indian Restaurant GST</span>
              </div>
              <input
                type="number"
                value={systemSettings.taxRatePercent}
                onChange={(e) =>
                  updateSystemSettings({ taxRatePercent: parseInt(e.target.value, 10) || 5 })
                }
                className="w-20 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-center font-mono font-bold text-amber-400"
              />
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-200 block">Allow Dine-In to Parcel Conversion</span>
                <span className="text-stone-400 text-[11px]">Let queue customers take food away if table wait is long</span>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.allowDineInToParcel}
                onChange={(e) => updateSystemSettings({ allowDineInToParcel: e.target.checked })}
                className="w-5 h-5 accent-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ➕ MODAL: ADD DISH */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-stone-900 text-stone-100 rounded-3xl max-w-lg w-full p-6 border border-stone-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-display font-bold text-lg">Add New Dish to {currentRestaurant.name}</h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-stone-400 hover:text-stone-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Double Decker Cheese Crunch Burger"
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Appetizing description of ingredients, spices, and preparation..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="149"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Prep Time (Mins)</label>
                  <input
                    type="number"
                    value={newProdPrep}
                    onChange={(e) => setNewProdPrep(e.target.value)}
                    placeholder="7"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Category</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo Preset Selector */}
              <div>
                <label className="block text-stone-300 font-bold mb-1.5">
                  Food Photo (Choose Preset or Enter URL):
                </label>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {FOOD_IMAGE_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setNewProdImage(p.url)}
                      className={`p-1.5 rounded-lg border text-[10px] text-center transition truncate ${
                        newProdImage === p.url
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                          : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="Or paste custom image URL..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-stone-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={newProdVeg}
                    onChange={(e) => setNewProdVeg(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span>🌱 Pure Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-stone-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={newProdChef}
                    onChange={(e) => setNewProdChef(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span>🔥 Chef's Special</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold shadow hover:bg-amber-400"
                >
                  Save & Publish Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🏢 MODAL: ADD RESTAURANT */}
      {showAddRestaurantModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-stone-900 text-stone-100 rounded-3xl max-w-lg w-full p-6 border border-stone-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-display font-bold text-lg">Onboard New Restaurant / Branch</h3>
              <button
                onClick={() => setShowAddRestaurantModal(false)}
                className="text-stone-400 hover:text-stone-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRestaurantSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">Restaurant Name *</label>
                <input
                  type="text"
                  required
                  value={newRestName}
                  onChange={(e) => setNewRestName(e.target.value)}
                  placeholder="e.g. Saffron Grove Coastal Bistro"
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Cuisine Style *</label>
                  <input
                    type="text"
                    required
                    value={newRestCuisine}
                    onChange={(e) => setNewRestCuisine(e.target.value)}
                    placeholder="e.g. Coastal Seafood & Grill"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Logo Icon / Emoji</label>
                  <input
                    type="text"
                    value={newRestLogo}
                    onChange={(e) => setNewRestLogo(e.target.value)}
                    placeholder="🦀 or ☕"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Tagline</label>
                <input
                  type="text"
                  value={newRestTagline}
                  onChange={(e) => setNewRestTagline(e.target.value)}
                  placeholder="Fresh coastal catch with handcrafted brews"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Address & Location</label>
                  <input
                    type="text"
                    value={newRestAddress}
                    onChange={(e) => setNewRestAddress(e.target.value)}
                    placeholder="Bay View Marina, Road 12"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newRestPhone}
                    onChange={(e) => setNewRestPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Number of Tables</label>
                  <input
                    type="number"
                    value={newRestTables}
                    onChange={(e) => setNewRestTables(e.target.value)}
                    placeholder="12"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">GST Tax ID</label>
                  <input
                    type="text"
                    value={newRestGST}
                    onChange={(e) => setNewRestGST(e.target.value)}
                    placeholder="07AAAAA9999Z1Z5"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-300">
                  <input
                    type="checkbox"
                    checked={cloneCurrentMenu}
                    onChange={(e) => setCloneCurrentMenu(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span>Clone current menu dishes to start with pre-loaded menu?</span>
                </label>
                <p className="text-[11px] text-stone-400">
                  If checked, copies all existing categories & dishes so you can immediately customize them.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddRestaurantModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold shadow hover:bg-amber-400"
                >
                  Provision Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✏️ MODAL: EDIT CURRENT RESTAURANT */}
      {showEditRestaurantModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-stone-900 text-stone-100 rounded-3xl max-w-lg w-full p-6 border border-stone-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-display font-bold text-lg">Edit Restaurant Profile</h3>
              <button
                onClick={() => setShowEditRestaurantModal(false)}
                className="text-stone-400 hover:text-stone-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRestaurantProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={editRestName}
                  onChange={(e) => setEditRestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Tagline</label>
                <input
                  type="text"
                  value={editRestTagline}
                  onChange={(e) => setEditRestTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Cuisine Style</label>
                  <input
                    type="text"
                    value={editRestCuisine}
                    onChange={(e) => setEditRestCuisine(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    value={editRestPhone}
                    onChange={(e) => setEditRestPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Address</label>
                <input
                  type="text"
                  value={editRestAddress}
                  onChange={(e) => setEditRestAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">GST Tax ID</label>
                  <input
                    type="text"
                    value={editRestGST}
                    onChange={(e) => setEditRestGST(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Wi-Fi Password</label>
                  <input
                    type="text"
                    value={editRestWifiPass}
                    onChange={(e) => setEditRestWifiPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowEditRestaurantModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold shadow hover:bg-amber-400"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📥 MODAL: IMPORT RESTAURANT JSON */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-stone-900 text-stone-100 rounded-3xl max-w-lg w-full p-6 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-display font-bold text-lg">Import Restaurant JSON Config</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-stone-400 hover:text-stone-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
              <p className="text-stone-400">
                Paste an exported Restaurant JSON configuration object below. This will import all dishes, categories, and settings.
              </p>
              <textarea
                required
                rows={8}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='{ "name": "Bistro", "cuisine": "...", "products": [...] }'
                className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 font-mono text-[11px] text-stone-200 focus:outline-none focus:border-amber-500"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold shadow hover:bg-amber-400"
                >
                  Import Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🎁 MODAL: ADD CAMPAIGN */}
      {showAddCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-stone-900 text-stone-100 rounded-3xl max-w-md w-full p-6 border border-stone-800 space-y-4">
            <h3 className="font-display font-bold text-lg">Create Lucky Draw Campaign</h3>
            <form onSubmit={handleCreateCampaignSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  placeholder="Sunday Gold Feast"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Prize Title</label>
                <input
                  type="text"
                  required
                  value={campPrizeTitle}
                  onChange={(e) => setCampPrizeTitle(e.target.value)}
                  placeholder="Free Chef Tasting Dinner for Two"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCampaignModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🏷️ MODAL: ADD BANNER */}
      {showAddBannerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-stone-900 text-stone-100 rounded-3xl max-w-md w-full p-6 border border-stone-800 space-y-4">
            <h3 className="font-display font-bold text-lg">Add Promotional Banner</h3>
            <form onSubmit={handleCreateBannerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Banner Title</label>
                <input
                  type="text"
                  required
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="Free Garlic Bread with any 10-inch Pizza!"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Description</label>
                <input
                  type="text"
                  value={bannerDesc}
                  onChange={(e) => setBannerDesc(e.target.value)}
                  placeholder="Valid for dine-in orders placed today before 8 PM."
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddBannerModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
