import React, { useState } from 'react';
import {
  Coffee,
  ChefHat,
  BarChart3,
  Bell,
  QrCode,
  ShoppingBag,
  Sparkles,
  Gamepad2,
  ChevronDown,
  Building2,
  FileDown,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { RestaurantSwitcherModal } from '../features/restaurants';
import { TableContextModal } from '../features/table';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenNotifications: () => void;
  onOpenLounge: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenNotifications,
  onOpenLounge,
}) => {
  const {
    viewRole,
    setViewRole,
    cartCount,
    unreadNotificationsCount,
    activeOrder,
    scannedTableNumber,
    currentRestaurant,
  } = useCafe();

  const [showTableModal, setShowTableModal] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800 shadow-xl transition-all">
      {/* Top utility notification / simulation strip */}
      <div className="bg-gradient-to-r from-stone-950 via-amber-950/70 to-stone-950 px-4 py-1.5 text-xs text-amber-200/90 flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/30">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium tracking-wide flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">{currentRestaurant.name}</span>
            <span className="text-stone-500 hidden sm:inline">•</span>
            <span className="text-stone-300 hidden sm:inline">{currentRestaurant.cuisine}</span>
          </span>
        </div>

        {/* Multi-Restaurant Switcher & Table context indicator */}
        <div className="flex items-center gap-2">
          {/* Restaurant Quick Switcher Pill */}
          <button
            onClick={() => setShowRestaurantModal(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-stone-800/90 hover:bg-stone-700/90 text-amber-300 border border-amber-500/30 font-medium text-xs shadow-xs transition hover:scale-[1.02]"
            title="Switch Restaurant or Branch"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold truncate max-w-[130px] sm:max-w-[180px]">
              {currentRestaurant.name}
            </span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {/* Table context indicator / simulator */}
          <button
            onClick={() => setShowTableModal(true)}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-900/50 hover:bg-amber-800/70 text-amber-300 font-mono text-xs border border-amber-800/40 transition"
            title="Switch table QR context"
          >
            <QrCode className="w-3.5 h-3.5" />
            {scannedTableNumber ? `Table #${scannedTableNumber}` : 'Direct Link'}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Restaurant Selector Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRestaurantModal(true)}
            className="flex items-center gap-2.5 text-left group"
            title="Click to Switch Restaurant"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-950/60 text-stone-950 font-bold text-lg group-hover:scale-105 transition-transform">
              {currentRestaurant.logo || '☕'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base tracking-tight text-stone-100 group-hover:text-amber-400 transition-colors">
                  {currentRestaurant.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-400 transition-colors" />
              </div>
              <span className="text-[11px] text-amber-300/80 font-medium block">
                {currentRestaurant.tagline || 'Artisan Eatery & Lounge'}
              </span>
            </div>
          </button>
        </div>

        {/* View Switcher: Customer / Kitchen / Admin */}
        <div className="flex items-center bg-stone-950/80 p-1 rounded-2xl border border-stone-800 text-xs">
          <button
            onClick={() => setViewRole('customer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition ${
              viewRole === 'customer'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-950/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Diner</span>
          </button>

          <button
            onClick={() => setViewRole('kitchen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition ${
              viewRole === 'kitchen'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-950/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kitchen (KDS)</span>
          </button>

          <button
            onClick={() => setViewRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition ${
              viewRole === 'admin'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-950/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin Hub</span>
          </button>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2">
          {/* PDF Master Guide Download */}
          <a
            href="/Complete_Restaurant_FullStack_Architecture_Handbook.pdf"
            download="Complete_Restaurant_FullStack_Architecture_Handbook.pdf"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold transition hover:scale-[1.02]"
            title="Download Complete Architecture & Development Handbook (PDF)"
          >
            <FileDown className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">Handbook PDF</span>
          </a>

          {/* Waiting Lounge / Games Trigger Button */}
          <button
            onClick={onOpenLounge}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
              activeOrder?.gameEligible
                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs'
                : 'bg-stone-800/80 hover:bg-stone-750 text-stone-300 border-stone-700'
            }`}
            title="Open Waiting Lounge Games"
          >
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Play Zone</span>
            {activeOrder?.gameEligible && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-stone-800/80 hover:bg-stone-750 text-stone-300 border border-stone-700 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Cart Floating / Header Button (Only customer view) */}
          {viewRole === 'customer' && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-950/40 transition hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-stone-950 text-amber-300 text-[11px] font-black">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Multi-Restaurant Switcher Modal */}
      <RestaurantSwitcherModal
        isOpen={showRestaurantModal}
        onClose={() => setShowRestaurantModal(false)}
        onOpenAdmin={() => setViewRole('admin')}
      />

      {/* Table Context Simulation Modal */}
      <TableContextModal
        isOpen={showTableModal}
        onClose={() => setShowTableModal(false)}
      />
    </header>
  );
};
