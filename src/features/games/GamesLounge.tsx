import React, { useState, useEffect } from 'react';
import {
  X,
  Gamepad2,
  Trophy,
  Coffee,
  Sparkles,
  Lock,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useCafe } from '../../context/CafeContext';
import { GameTab } from './types';
import { GameCard } from './components/GameCard';
import { SpinWheelGame } from './components/SpinWheelGame';
import { SnakeGame } from './components/SnakeGame';
import { MemoryMatchGame } from './components/MemoryMatchGame';
import { TicTacToeGame } from './components/TicTacToeGame';
import { CafeQuizGame } from './components/CafeQuizGame';
import { ReactionGame } from './components/ReactionGame';
import { LudoSprintGame } from './components/LudoSprintGame';
import { UnoClashGame } from './components/UnoClashGame';
import { MultiplayerRoomGame } from './components/MultiplayerRoomGame';
import { DEFAULT_GAMES_REGISTRY, getEnabledGamesForRestaurant } from './gamesRegistry';

export interface GamesLoungeProps {
  isOpen: boolean;
  onClose: () => void;
  initialGame?: GameTab;
}

export const GamesLounge: React.FC<GamesLoungeProps> = ({
  isOpen,
  onClose,
  initialGame = 'hub',
}) => {
  const { activeOrder, currentRestaurant, gamesRegistry } = useCafe();

  const [selectedGameTab, setSelectedGameTab] = useState<GameTab>(initialGame);
  const [hubCategoryFilter, setHubCategoryFilter] = useState<'all' | 'single' | 'multiplayer'>('all');
  const [guestAccessUnlocked, setGuestAccessUnlocked] = useState(false);

  // Check 60-Minute Access Rule (or demo unlock)
  const now = Date.now();
  const isAccessValid = Boolean(
    guestAccessUnlocked ||
      (activeOrder && activeOrder.gameEligible && now < activeOrder.engagementExpiresAt)
  );
  const remainingMins = activeOrder
    ? Math.max(0, Math.ceil((activeOrder.engagementExpiresAt - now) / 60000))
    : 60;

  useEffect(() => {
    if (isOpen && initialGame) {
      setSelectedGameTab(initialGame);
    }
  }, [isOpen, initialGame]);

  if (!isOpen) return null;

  // Active games for the current restaurant
  const allRegistryGames = gamesRegistry || DEFAULT_GAMES_REGISTRY;
  const restaurantGames = getEnabledGamesForRestaurant(
    currentRestaurant?.enabledGameIds,
    allRegistryGames
  );

  const filteredGames = restaurantGames.filter((g) => {
    if (hubCategoryFilter === 'all') return true;
    return g.category === hubCategoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl text-stone-950 shadow-md shadow-amber-500/20">
              <Gamepad2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">
                  Waiting Lounge & Play Zone
                </h2>
                <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold rounded-full">
                  60-Min Diner Pass
                </span>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1.5 mt-0.5">
                <span>{currentRestaurant?.name || 'Artisan Café'}</span>
                <span>•</span>
                <span>Table #{activeOrder?.tableNumber || 'Takeaway'}</span>
                <span>•</span>
                <span className="text-amber-400 font-semibold">{remainingMins} mins remaining</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedGameTab !== 'hub' && (
              <button
                onClick={() => setSelectedGameTab('hub')}
                className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 transition"
              >
                ← All Games
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-800 rounded-xl text-stone-400 hover:text-white transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!isAccessValid ? (
            /* Locked State for diners without active order */
            <div className="bg-stone-950 border border-stone-800 rounded-3xl p-8 max-w-lg mx-auto text-center my-8 shadow-2xl">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Lounge Access Reserved for Diners</h3>
              <p className="text-xs text-stone-400 mt-2 mb-6 leading-relaxed">
                The Café Gaming Lounge unlocks automatically once your food order is placed and
                confirmed by the kitchen!
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-sm transition"
                >
                  Browse Menu & Place Order
                </button>
                <button
                  onClick={() => setGuestAccessUnlocked(true)}
                  className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded-xl text-xs transition"
                >
                  Explore as Demo Guest (Instant Access)
                </button>
              </div>
            </div>
          ) : selectedGameTab === 'hub' ? (
            /* Games Lobby Hub */
            <div>
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex bg-stone-950 p-1 rounded-2xl border border-stone-800">
                  <button
                    onClick={() => setHubCategoryFilter('all')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                      hubCategoryFilter === 'all'
                        ? 'bg-amber-500 text-stone-950 shadow-md'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    All Games ({restaurantGames.length})
                  </button>
                  <button
                    onClick={() => setHubCategoryFilter('single')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                      hubCategoryFilter === 'single'
                        ? 'bg-amber-500 text-stone-950 shadow-md'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Solo Play
                  </button>
                  <button
                    onClick={() => setHubCategoryFilter('multiplayer')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                      hubCategoryFilter === 'multiplayer'
                        ? 'bg-amber-500 text-stone-950 shadow-md'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Table Clash & QR
                  </button>
                </div>

                <div className="text-xs text-stone-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Win discounts & vouchers while kitchen prepares order</span>
                </div>
              </div>

              {/* Grid of Game Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onSelect={(tab) => setSelectedGameTab(tab)}
                    activeOrderNumber={activeOrder?.orderNumber}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Modular Active Game Screen Switcher */
            <div className="py-2">
              {selectedGameTab === 'spin-wheel' && (
                <SpinWheelGame onBackToHub={() => setSelectedGameTab('hub')} />
              )}
              {selectedGameTab === 'snake' && (
                <SnakeGame onBackToHub={() => setSelectedGameTab('hub')} />
              )}
              {selectedGameTab === 'memory' && (
                <MemoryMatchGame onBackToHub={() => setSelectedGameTab('hub')} />
              )}
              {selectedGameTab === 'tictactoe-solo' && (
                <TicTacToeGame onBackToHub={() => setSelectedGameTab('hub')} />
              )}
              {selectedGameTab === 'quiz' && (
                <CafeQuizGame onBackToHub={() => setSelectedGameTab('hub')} />
              )}
              {selectedGameTab === 'reaction' && (
                <ReactionGame onBackToHub={() => setSelectedGameTab('hub')} />
              )}
              {selectedGameTab === 'ludo' && (
                <LudoSprintGame onBackToHub={() => setSelectedGameTab('hub')} />
              )}
              {selectedGameTab === 'uno' && (
                <UnoClashGame onBackToHub={() => setSelectedGameTab('hub')} />
              )}
              {selectedGameTab === 'multiplayer-ttt' && (
                <MultiplayerRoomGame onBackToHub={() => setSelectedGameTab('hub')} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
