import React from 'react';
import { Plus, Minus, Clock, Flame, Leaf, Sparkles, ChefHat } from 'lucide-react';
import { Product } from '../../../types';

interface MenuItemCardProps {
  product: Product;
  quantityInCart: number;
  onQuickAdd: (product: Product) => void;
  onIncrement: (product: Product) => void;
  onDecrement: (product: Product) => void;
  onOpenCustomize: (product: Product) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  product,
  quantityInCart,
  onQuickAdd,
  onIncrement,
  onDecrement,
  onOpenCustomize,
}) => {
  const hasCustomization = Boolean(
    product.customization &&
      ((product.customization.sizeOptions && product.customization.sizeOptions.length > 0) ||
        (product.customization.milkOptions && product.customization.milkOptions.length > 0) ||
        (product.customization.spiceLevels && product.customization.spiceLevels.length > 0) ||
        product.customization.addExtraCheese ||
        (product.customization.dipOptions && product.customization.dipOptions.length > 0))
  );

  return (
    <div className="bg-stone-900 border border-stone-800/80 hover:border-amber-500/40 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 group">
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />

        {/* Veg / Non-Veg Indicator at Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div
            className={`w-5 h-5 rounded-md border flex items-center justify-center bg-stone-950/90 shadow-md ${
              product.vegetarian !== false
                ? 'border-emerald-500'
                : 'border-rose-500'
            }`}
            title={product.vegetarian !== false ? 'Pure Vegetarian' : 'Non-Vegetarian'}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                product.vegetarian !== false ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          </div>

          {product.chefSpecial && (
            <span className="px-2 py-0.5 bg-amber-500/90 text-stone-950 text-[10px] font-black uppercase tracking-wider rounded-md shadow-md flex items-center gap-1">
              <ChefHat className="w-3 h-3" /> Chef's Pick
            </span>
          )}

          {product.popular && !product.chefSpecial && (
            <span className="px-2 py-0.5 bg-rose-500/90 text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-md flex items-center gap-1">
              <Flame className="w-3 h-3" /> Best Seller
            </span>
          )}
        </div>

        {/* Prep Time at Top Right */}
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-stone-950/85 backdrop-blur-xs rounded-full border border-stone-800 text-[10px] font-semibold text-stone-300 flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{product.prepTimeMinutes}m</span>
        </div>

        {/* Price Tag Overlay at Bottom Left */}
        <div className="absolute bottom-2.5 left-3">
          <span className="text-xl font-black text-white drop-shadow-md">
            ₹{product.price}
          </span>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
            {product.name}
          </h4>
          <p className="text-xs text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
          {hasCustomization ? (
            <button
              onClick={() => onOpenCustomize(product)}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 transition"
            >
              <span>Customizable</span>
            </button>
          ) : (
            <span className="text-[11px] text-stone-400">Ready to prepare</span>
          )}

          {quantityInCart > 0 ? (
            /* Animated Quantity Pill */
            <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => onDecrement(product)}
                className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center transition active:scale-90"
                title="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center font-bold text-xs text-amber-400 font-mono">
                {quantityInCart}
              </span>
              <button
                onClick={() => onIncrement(product)}
                className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center transition active:scale-90"
                title="Increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Add Button */
            <button
              onClick={() => {
                if (hasCustomization) {
                  onOpenCustomize(product);
                } else {
                  onQuickAdd(product);
                }
              }}
              className="px-4 py-2 bg-stone-800 hover:bg-amber-500 text-stone-200 hover:text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all duration-200 transform active:scale-95 border border-stone-700 hover:border-amber-500 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
