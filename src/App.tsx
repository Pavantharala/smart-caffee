import React, { useState } from 'react';
import { CafeProvider, useCafe } from './context/CafeContext';
import { Header } from './components/Header';
import { NotificationsDrawer } from './features/notifications';
import { MenuCatalog } from './features/menu';
import { CheckoutModal } from './features/cart';
import { ActiveOrderTracker } from './features/orders';
import { LuckyDrawModal } from './features/lucky-draw';
import { GamesLounge } from './features/games';
import { KitchenDashboard } from './features/kitchen';
import { AdminDashboard } from './features/admin';
import {
  Coffee,
  Sparkles,
  Gamepad2,
  Clock,
  ArrowRight,
  UtensilsCrossed,
  Layers,
} from 'lucide-react';

const CafeMainContent: React.FC = () => {
  const { viewRole, activeOrder, activeOrderId, setActiveOrderId, orders } = useCafe();

  // Modals & Navigation
  const [customerViewMode, setCustomerViewMode] = useState<'menu' | 'tracker'>('menu');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLuckyDrawOpen, setIsLuckyDrawOpen] = useState(false);
  const [isGamesLoungeOpen, setIsGamesLoungeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950">
      {/* Universal Header with Role & Table Switchers */}
      <Header
        onOpenCart={() => setIsCheckoutOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenLounge={() => setIsGamesLoungeOpen(true)}
      />

      {/* Main Role Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {viewRole === 'customer' && (
          <div className="space-y-6">
            {/* Active Order Persistent Notice Bar (if customer has an active order) */}
            {activeOrder && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-purple-950/60 border border-amber-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-stone-100">
                        {activeOrder.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {activeOrder.orderStatus}
                      </span>
                      {activeOrder.tableQueueStatus === 'queued' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-600/30 text-amber-300 border border-amber-500/30">
                          Table Queue #{activeOrder.queuePosition || 1}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-2">
                      <span>{activeOrder.items.length} items</span>
                      <span>•</span>
                      <span>₹{activeOrder.total}</span>
                      <span>•</span>
                      <span className="text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{activeOrder.estimatedPrepMinutes}m prep
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsGamesLoungeOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-950/40"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>Play Lounge Games</span>
                  </button>

                  <button
                    onClick={() => setCustomerViewMode('tracker')}
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition flex items-center gap-1.5 border border-stone-700"
                  >
                    <span>Track Live</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Sub-navigation for Customer View */}
            {activeOrder && (
              <div className="flex items-center gap-2 bg-stone-900/60 p-1 rounded-2xl border border-stone-800 w-fit">
                <button
                  onClick={() => setCustomerViewMode('menu')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    customerViewMode === 'menu'
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/30'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Menu & Add More Dishes</span>
                </button>

                <button
                  onClick={() => setCustomerViewMode('tracker')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    customerViewMode === 'tracker'
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/30'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Live Order & Seating Tracker</span>
                </button>
              </div>
            )}

            {/* Active view mode */}
            {customerViewMode === 'menu' || !activeOrder ? (
              <MenuCatalog onOpenCart={() => setIsCheckoutOpen(true)} />
            ) : (
              <ActiveOrderTracker
                onOpenLuckyDraw={() => setIsLuckyDrawOpen(true)}
                onOpenGamesLounge={() => setIsGamesLoungeOpen(true)}
                onBackToMenu={() => setCustomerViewMode('menu')}
              />
            )}
          </div>
        )}

        {viewRole === 'kitchen' && <KitchenDashboard />}

        {viewRole === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={() => {
          setIsCheckoutOpen(false);
          setCustomerViewMode('tracker');
        }}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectOrder={(orderId) => {
          setActiveOrderId(orderId);
          setCustomerViewMode('tracker');
          setIsNotificationsOpen(false);
        }}
      />

      <LuckyDrawModal
        isOpen={isLuckyDrawOpen}
        onClose={() => setIsLuckyDrawOpen(false)}
      />

      <GamesLounge
        isOpen={isGamesLoungeOpen}
        onClose={() => setIsGamesLoungeOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <CafeProvider>
      <CafeMainContent />
    </CafeProvider>
  );
}

export default App;
