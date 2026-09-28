import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  UtensilsCrossed,
  Package,
  AlertCircle,
  Clock,
  Sparkles,
  Gamepad2,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  QrCode,
  ShieldCheck,
  Gift,
} from 'lucide-react';
import { useCafe } from '../../../context/CafeContext';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const {
    cart,
    cartTotal,
    removeFromCart,
    updateCartQuantity,
    scannedTableNumber,
    tables,
    customerName,
    setCustomerName,
    createOrder,
    activeCampaign,
    systemSettings,
  } = useCafe();

  const [orderType, setOrderType] = useState<'dine_in' | 'parcel'>('dine_in');
  const [selectedTable, setSelectedTable] = useState<number | undefined>(
    scannedTableNumber || undefined
  );
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'counter'>('online');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const availableTables = tables.filter((t) => t.status === 'available');
  const allTablesOccupied = availableTables.length === 0;

  const subtotal = cartTotal;
  const taxRate = (systemSettings.taxRatePercent || 5) / 100;
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      createOrder({
        orderType,
        tableNumber:
          orderType === 'dine_in'
            ? selectedTable || scannedTableNumber || undefined
            : undefined,
        paymentMethod,
        customerName: customerName.trim() || 'Patron',
        customerPhone: phone.trim() || undefined,
        kitchenNotes: notes.trim() || undefined,
      });

      setIsProcessing(false);
      onOrderSuccess();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-stone-900 text-stone-100 rounded-3xl max-w-xl w-full border border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-stone-100">Review & Order</h2>
              <p className="text-xs text-stone-400">
                Parallel Kitchen Prep + Zero Wasted Waiting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Cart Item Summary */}
          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
              Selected Items ({cart.length})
            </h3>
            {cart.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-4">Your cart is empty.</p>
            ) : (
              <div className="space-y-2.5">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-stone-950/60 border border-stone-800/80 flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-stone-100 truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-stone-400 flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-amber-400 font-bold">
                          ₹{item.itemTotal}
                        </span>
                        {item.customization && (
                          <span className="text-stone-500">
                            (
                            {[
                              item.customization.size,
                              item.customization.spiceLevel
                                ? `${item.customization.spiceLevel} Spice`
                                : null,
                              item.customization.milk,
                              item.customization.sweetness,
                            ]
                              .filter(Boolean)
                              .join(', ')}
                            )
                          </span>
                        )}
                        {item.specialInstructions && (
                          <span className="text-stone-500 italic block">
                            "{item.specialInstructions}"
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-stone-900 px-2 py-1 rounded-xl border border-stone-800">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-0.5 text-stone-400 hover:text-stone-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs font-bold w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-0.5 text-stone-400 hover:text-stone-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-stone-500 hover:text-red-400 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dining Type Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2.5">
              Dining Option
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                  orderType === 'dine_in'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-200'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    orderType === 'dine_in' ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-900'
                  }`}
                >
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-stone-100">Dine-In</p>
                  <p className="text-[11px] text-stone-400">Enjoy food at café table</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('parcel')}
                className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                  orderType === 'parcel'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-200'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    orderType === 'parcel' ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-900'
                  }`}
                >
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-stone-100">Parcel Takeaway</p>
                  <p className="text-[11px] text-stone-400">Packed for pickup</p>
                </div>
              </button>
            </div>
          </div>

          {/* Table allocation details (if Dine-In) */}
          {orderType === 'dine_in' && (
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  Table Seating
                </span>
                {scannedTableNumber && (
                  <span className="text-[11px] font-mono text-emerald-400">
                    QR Scanned: Table #{scannedTableNumber}
                  </span>
                )}
              </div>

              {scannedTableNumber ? (
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300">
                  Your order is tied to <strong>Table #{scannedTableNumber}</strong> via the table QR
                  stand.
                </div>
              ) : allTablesOccupied ? (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-xs text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    All tables are currently occupied!
                  </div>
                  <p className="text-[11px] text-stone-300">
                    Don't worry: your order goes straight to the kitchen. You will join the Table
                    Queue, and a table will be assigned the moment one frees up.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-stone-400 mb-2">
                    Select your table or let the system auto-assign an available table:
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {tables.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        disabled={t.status !== 'available'}
                        onClick={() => setSelectedTable(t.number)}
                        className={`p-2 rounded-xl text-xs border text-center transition ${
                          selectedTable === t.number
                            ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                            : t.status === 'available'
                            ? 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-700'
                            : 'border-stone-900 bg-stone-950/50 text-stone-600 cursor-not-allowed'
                        }`}
                      >
                        <span>T#{t.number}</span>
                        <span className="block text-[9px] text-stone-500 capitalize">
                          {t.status === 'available' ? 'Free' : t.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Rahul / Priya"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                Mobile Number (SMS / WhatsApp)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Kitchen Notes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
              Special Kitchen Instructions
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Less spicy for kids, extra napkins, serve chai boiling hot..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2.5">
              Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  paymentMethod === 'online'
                    ? 'border-emerald-500 bg-emerald-950/20 text-emerald-200'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm text-stone-100">Pay Online</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    UPI / Card
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Instant confirmation.
                  {activeCampaign && (
                    <span className="text-amber-300 font-medium block mt-1">
                      🎟️ Generates Lucky Draw Coupon instantly!
                    </span>
                  )}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('counter')}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  paymentMethod === 'counter'
                    ? 'border-amber-500 bg-amber-950/20 text-amber-200'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Banknote className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-sm text-stone-100">Pay at Counter</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    Cash / QR
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Pay the cashier at your convenience.
                  {activeCampaign && (
                    <span className="text-amber-400/90 block mt-1">
                      ℹ️ Lucky Draw coupon generated once staff confirms payment.
                    </span>
                  )}
                </p>
              </button>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-stone-400">
              <span>Items Subtotal</span>
              <span className="font-mono text-stone-200">₹{subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-stone-400">
              <span>GST ({systemSettings.taxRatePercent || 5}%)</span>
              <span className="font-mono text-stone-200">₹{tax}</span>
            </div>
            <div className="flex items-center justify-between text-stone-100 font-bold text-sm pt-2 border-t border-stone-800">
              <span>Total Payable</span>
              <span className="font-mono text-amber-400 text-base">₹{total}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950/70 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-stone-400 block">Total Amount</span>
            <span className="font-mono font-extrabold text-xl text-amber-400">₹{total}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={cart.length === 0 || isProcessing}
            className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            {isProcessing ? (
              <span>Confirming Order...</span>
            ) : (
              <>
                <span>Place Order (₹{total})</span>
                <span className="text-xs">→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
