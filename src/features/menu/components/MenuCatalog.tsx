import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Flame,
  Leaf,
  Clock,
  Wifi,
  MapPin,
  Star,
  Copy,
  Check,
  ShoppingBag,
  ChefHat,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useCafe } from '../../../context/CafeContext';
import { Product, CartItem } from '../../../types';
import { CategoryNav } from './CategoryNav';
import { MenuItemCard } from './MenuItemCard';
import { DishCustomizerModal } from './DishCustomizerModal';

interface MenuCatalogProps {
  onOpenCart: () => void;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({ onOpenCart }) => {
  const {
    categories,
    products,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    cartCount,
    cartTotal,
    promotionalBanners,
    currentRestaurant,
    scannedTableNumber,
  } = useCafe();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<'all' | 'popular' | 'vegetarian' | 'nonveg' | 'chef' | 'quick'>('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [wifiCopied, setWifiCopied] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Customization modal state
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyWifi = () => {
    if (currentRestaurant.wifiDetails) {
      navigator.clipboard?.writeText(currentRestaurant.wifiDetails.password);
      setWifiCopied(true);
      setTimeout(() => setWifiCopied(false), 2000);
    }
  };

  const getProductCartCount = (productId: string) => {
    return cart
      .filter((item) => item.product.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleQuickAdd = (product: Product) => {
    const cartItem: CartItem = {
      id: 'cart-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      product,
      quantity: 1,
      itemTotal: product.price,
    };
    addToCart(cartItem);
  };

  const handleIncrement = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      updateCartQuantity(existing.id, existing.quantity + 1);
    } else {
      handleQuickAdd(product);
    }
  };

  const handleDecrement = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      if (existing.quantity <= 1) {
        removeFromCart(existing.id);
      } else {
        updateCartQuantity(existing.id, existing.quantity - 1);
      }
    }
  };

  const productsCountByCategory = (catId: string) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.categoryId === catId).length;
  };

  // Filter products by category, search text, and filter tag
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTag = p.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTag) return false;
    }
    if (filterTag === 'vegetarian' && p.vegetarian === false) return false;
    if (filterTag === 'nonveg' && p.vegetarian !== false) return false;
    if (filterTag === 'popular' && !p.popular) return false;
    if (filterTag === 'chef' && !p.chefSpecial) return false;
    if (filterTag === 'quick' && p.prepTimeMinutes > 15) return false;

    return true;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* 1. RESTAURANT HERO CARD */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-900">
        <div className="relative h-44 sm:h-56 w-full overflow-hidden">
          <img
            src={currentRestaurant.heroBanner}
            alt={currentRestaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
        </div>

        <div className="p-5 sm:p-6 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-3.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-stone-950 border-2 border-amber-500/80 p-2 shadow-2xl shrink-0 flex items-center justify-center">
                <img
                  src={currentRestaurant.logo}
                  alt={currentRestaurant.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {currentRestaurant.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                    Live Menu
                  </span>
                </div>
                <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                  {currentRestaurant.tagline} • {currentRestaurant.cuisine}
                </p>
                <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-stone-500" />
                  <span>{currentRestaurant.address}</span>
                </p>
              </div>
            </div>

            {/* Quick Stats & Wi-Fi */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-950/80 border border-stone-800 text-xs">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-bold text-white">{currentRestaurant.rating}</span>
                <span className="text-[10px] text-stone-500">
                  ({currentRestaurant.totalReviews})
                </span>
              </div>

              {currentRestaurant.wifiDetails && (
                <button
                  onClick={handleCopyWifi}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-amber-500/40 text-xs text-stone-300 transition"
                  title="Copy Guest Wi-Fi Password"
                >
                  <Wifi className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-mono">{currentRestaurant.wifiDetails.ssid}</span>
                  {wifiCopied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-stone-400" />
                  )}
                </button>
              )}

              {scannedTableNumber && (
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400">
                  Seated @ Table #{scannedTableNumber}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & QUICK FILTER PILLS */}
      <div className="space-y-3" ref={searchContainerRef}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search gourmet burgers, stone-baked pizzas, cold brews, momos..."
            className="w-full bg-stone-900 border border-stone-800 rounded-2xl pl-11 pr-10 py-3 text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setFilterTag('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filterTag === 'all'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'
            }`}
          >
            All Diets
          </button>
          <button
            onClick={() => setFilterTag('vegetarian')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
              filterTag === 'vegetarian'
                ? 'bg-emerald-500 text-stone-950 font-bold shadow'
                : 'bg-stone-900 text-emerald-400 border border-stone-800 hover:text-emerald-300'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" /> Pure Veg
          </button>
          <button
            onClick={() => setFilterTag('nonveg')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
              filterTag === 'nonveg'
                ? 'bg-rose-500 text-white font-bold shadow'
                : 'bg-stone-900 text-rose-400 border border-stone-800 hover:text-rose-300'
            }`}
          >
            🍗 Non-Veg
          </button>
          <button
            onClick={() => setFilterTag('chef')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
              filterTag === 'chef'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'bg-stone-900 text-amber-400 border border-stone-800 hover:text-amber-300'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" /> Chef's Special
          </button>
          <button
            onClick={() => setFilterTag('popular')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
              filterTag === 'popular'
                ? 'bg-orange-500 text-white font-bold shadow'
                : 'bg-stone-900 text-orange-400 border border-stone-800 hover:text-orange-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Best Sellers
          </button>
          <button
            onClick={() => setFilterTag('quick')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
              filterTag === 'quick'
                ? 'bg-blue-500 text-white font-bold shadow'
                : 'bg-stone-900 text-blue-400 border border-stone-800 hover:text-blue-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Under 15 Mins
          </button>
        </div>
      </div>

      {/* 3. CATEGORY NAVIGATION TABS */}
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        productsCountByCategory={productsCountByCategory}
      />

      {/* 4. DISHES GRID */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <MenuItemCard
              key={product.id}
              product={product}
              quantityInCart={getProductCartCount(product.id)}
              onQuickAdd={handleQuickAdd}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onOpenCustomize={(p) => setCustomizingProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-stone-900 border border-stone-800 rounded-3xl">
          <p className="text-base font-bold text-white">No dishes found</p>
          <p className="text-xs text-stone-400 mt-1">
            Try adjusting your search keywords or switching filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilterTag('all');
            }}
            className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* 5. CUSTOMIZE MODAL */}
      {customizingProduct && (
        <DishCustomizerModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onAddToCart={(item) => addToCart(item)}
        />
      )}

      {/* 6. FLOATING PERSISTENT CART BAR */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto animate-slide-up">
          <button
            onClick={onOpenCart}
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 px-5 py-3.5 rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center justify-between font-black text-sm transition-all transform active:scale-98 border border-amber-400/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-stone-950 text-amber-400 flex items-center justify-center font-bold text-xs shadow-inner">
                {cartCount}
              </div>
              <div className="text-left leading-tight">
                <span className="block text-xs uppercase font-extrabold tracking-wider opacity-85">
                  View Order
                </span>
                <span className="text-sm font-black">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} in Tray
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base font-black">₹{cartTotal}</span>
              <span className="text-xs px-2.5 py-1 bg-stone-950/20 rounded-lg">Proceed →</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
