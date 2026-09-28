import React, { useState } from 'react';
import { X, Plus, Minus, ChefHat, Sparkles } from 'lucide-react';
import { Product, CartItem, SelectedCustomization } from '../../../types';

interface DishCustomizerModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const DishCustomizerModal: React.FC<DishCustomizerModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [selectedMilk, setSelectedMilk] = useState<string>(
    product.customization?.milkOptions?.[0] || ''
  );
  const [selectedSweetness, setSelectedSweetness] = useState<string>(
    product.customization?.sweetnessLevels?.[0] || ''
  );
  const [selectedTemp, setSelectedTemp] = useState<'Hot' | 'Iced'>(
    product.customization?.temperatureOptions?.[0] || 'Hot'
  );
  const [selectedSpice, setSelectedSpice] = useState<'Mild' | 'Medium' | 'Spicy'>(
    product.customization?.spiceLevels?.[0] || 'Medium'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.customization?.sizeOptions?.[0]?.name || ''
  );
  const [extraCheeseAdded, setExtraCheeseAdded] = useState<boolean>(false);
  const [selectedDip, setSelectedDip] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [modalQuantity, setModalQuantity] = useState<number>(1);

  let calcExtra = 0;
  if (selectedMilk.includes('+₹')) {
    const match = selectedMilk.match(/\+₹(\d+)/);
    if (match) calcExtra += parseInt(match[1], 10);
  }
  if (selectedSize) {
    const sizeOpt = product.customization?.sizeOptions?.find((s) => s.name === selectedSize);
    if (sizeOpt) calcExtra += sizeOpt.extraPrice;
  }
  if (extraCheeseAdded) calcExtra += 40;
  if (selectedDip) calcExtra += 25;

  const unitPrice = product.price + calcExtra;
  const totalPrice = unitPrice * modalQuantity;

  const handleConfirm = () => {
    const customization: SelectedCustomization = {
      milk: selectedMilk || undefined,
      sweetness: selectedSweetness || undefined,
      temperature: selectedTemp || undefined,
      spiceLevel: product.customization?.spiceLevels ? selectedSpice : undefined,
      size: selectedSize || undefined,
      extraPrice: calcExtra,
    };

    const cartItem: CartItem = {
      id: 'cart-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      product,
      quantity: modalQuantity,
      customization,
      specialInstructions: specialInstructions.trim() || undefined,
      itemTotal: totalPrice,
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-800 flex items-start justify-between bg-stone-950/60">
          <div className="flex items-center gap-3">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-16 rounded-2xl object-cover border border-stone-800"
            />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 block">
                Customize Dish
              </span>
              <h3 className="text-lg font-bold text-white leading-tight">{product.name}</h3>
              <p className="text-xs text-stone-400 mt-0.5">Base Price: ₹{product.price}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-800 rounded-xl text-stone-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Options List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Size Options */}
          {product.customization?.sizeOptions && product.customization.sizeOptions.length > 0 && (
            <div>
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-2">
                Portion Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.customization.sizeOptions.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => setSelectedSize(opt.name)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
                      selectedSize === opt.name
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <span>{opt.name}</span>
                    <span>{opt.extraPrice > 0 ? `+₹${opt.extraPrice}` : 'Included'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spice Level */}
          {product.customization?.spiceLevels && product.customization.spiceLevels.length > 0 && (
            <div>
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-2">
                Spice Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.customization.spiceLevels.map((sp) => (
                  <button
                    key={sp}
                    onClick={() => setSelectedSpice(sp)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition ${
                      selectedSpice === sp
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    {sp === 'Mild' ? '🟢 Mild' : sp === 'Medium' ? '🟡 Medium' : '🔴 Fiery'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extra Cheese Add-on */}
          {product.customization?.addExtraCheese && (
            <div className="flex items-center justify-between p-3.5 bg-stone-950 rounded-2xl border border-stone-800">
              <div>
                <span className="text-xs font-bold text-white block">Add Extra Cheese Burst</span>
                <span className="text-[11px] text-stone-400">Gourmet molten mozzarella (+₹40)</span>
              </div>
              <input
                type="checkbox"
                checked={extraCheeseAdded}
                onChange={(e) => setExtraCheeseAdded(e.target.checked)}
                className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 bg-stone-900 border-stone-700"
              />
            </div>
          )}

          {/* Dips Option */}
          {product.customization?.dipOptions && product.customization.dipOptions.length > 0 && (
            <div>
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-2">
                Add Dipping Sauce (+₹25)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.customization.dipOptions.map((dip) => (
                  <button
                    key={dip}
                    onClick={() => setSelectedDip(selectedDip === dip ? '' : dip)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-left transition ${
                      selectedDip === dip
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    {dip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chef Cooking Instructions */}
          <div>
            <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-amber-500" />
              Chef Cooking Notes
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., Less oil, crispy bun, serve hot..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Modal Bottom Bar with Quantity & Add Button */}
        <div className="p-4 sm:p-6 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-2xl p-1.5">
            <button
              onClick={() => setModalQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 flex items-center justify-center transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold text-sm text-white font-mono">
              {modalQuantity}
            </span>
            <button
              onClick={() => setModalQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="flex-1 py-3.5 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black rounded-2xl text-sm shadow-lg shadow-amber-500/20 flex items-center justify-between transition transform active:scale-98"
          >
            <span>Add to Order</span>
            <span>₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
