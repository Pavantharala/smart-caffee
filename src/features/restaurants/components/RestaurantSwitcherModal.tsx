import React from 'react';
import { Building2, Star, Check, Plus, X } from 'lucide-react';
import { useCafe } from '../../../context/CafeContext';

interface RestaurantSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
}

export const RestaurantSwitcherModal: React.FC<RestaurantSwitcherModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
}) => {
  const { restaurants, currentRestaurantId, switchRestaurant } = useCafe();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-stone-900 text-stone-100 rounded-3xl max-w-xl w-full p-6 border border-stone-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-stone-100">
                Select Restaurant / Outlet
              </h3>
              <p className="text-xs text-stone-400">
                Switch branch or preview menus & seating for other restaurants
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center text-sm font-bold transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of available restaurants */}
        <div className="space-y-3">
          {restaurants.map((rest) => {
            const isSelected = rest.id === currentRestaurantId;
            return (
              <div
                key={rest.id}
                onClick={() => {
                  switchRestaurant(rest.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-950/30'
                    : 'border-stone-800 bg-stone-950/60 hover:border-stone-700 hover:bg-stone-800/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center text-2xl shrink-0">
                    {rest.logo || '🍽️'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display font-bold text-stone-100 text-sm sm:text-base">
                        {rest.name}
                      </h4>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      )}
                      {rest.badge && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-stone-800 text-stone-300">
                          {rest.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-300/90 font-medium mt-0.5">{rest.cuisine}</p>
                    <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{rest.tagline}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-400">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {rest.rating || 4.8} ({rest.totalReviews || 120})
                      </span>
                      <span>•</span>
                      <span>{rest.tableCount || rest.tables?.length || 10} Tables</span>
                      <span>•</span>
                      <span>{rest.products?.length || 0} Menu Items</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800/60">
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                      <Check className="w-3.5 h-3.5" />
                      Selected
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-amber-600 hover:text-stone-950 text-stone-200 text-xs font-bold transition"
                    >
                      Switch Here
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick action to add new restaurant in Admin */}
        <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            Want to configure another restaurant profile or franchise?
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenAdmin();
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage in Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
