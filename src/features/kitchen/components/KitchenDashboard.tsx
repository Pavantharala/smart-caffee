import React, { useState } from 'react';
import {
  ChefHat,
  Clock,
  CheckCircle,
  AlertCircle,
  UtensilsCrossed,
  Package,
  ArrowRight,
  Sparkles,
  Search,
  Banknote,
  RotateCcw,
  Check,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { useCafe } from '../../../context/CafeContext';
import { OrderStatus, TableStatus } from '../../../types';

export const KitchenDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    confirmCounterPayment,
    tables,
    updateTableStatus,
    tableQueue,
    assignTableFromQueue,
    leaveQueue,
    verifyAndRedeemPrize,
  } = useCafe();

  const [activeTab, setActiveTab] = useState<'orders' | 'tables' | 'counter' | 'redemption'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('active');
  const [voucherInput, setVoucherInput] = useState('');
  const [redemptionResult, setRedemptionResult] = useState<{ success: boolean; message: string } | null>(null);

  // Filter orders
  const activeOrders = orders.filter((o) => {
    if (orderStatusFilter === 'active') {
      return o.orderStatus !== 'served' && o.orderStatus !== 'cancelled';
    }
    if (orderStatusFilter === 'ready') return o.orderStatus === 'ready';
    if (orderStatusFilter === 'completed') return o.orderStatus === 'served';
    return true;
  });

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    const res = verifyAndRedeemPrize(voucherInput);
    setRedemptionResult(res);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top Staff Bar */}
      <div className="bg-stone-900 rounded-2xl p-4 sm:p-6 border border-stone-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl text-stone-100">
              Kitchen Display &amp; Floor Staff KDS
            </h1>
            <p className="text-xs text-stone-400">
              Parallel kitchen pipeline management • Live queue allocation • Counter cash register
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 bg-stone-950 p-1.5 rounded-xl border border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-amber-600 text-stone-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Orders Queue ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'tables'
                ? 'bg-amber-600 text-stone-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Floor &amp; Queue ({tableQueue.length})
          </button>
          <button
            onClick={() => setActiveTab('counter')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'counter'
                ? 'bg-amber-600 text-stone-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Counter Cash
          </button>
          <button
            onClick={() => setActiveTab('redemption')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'redemption'
                ? 'bg-amber-600 text-stone-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Prize Desk
          </button>
        </div>
      </div>

      {/* TAB 1: KITCHEN ORDER TICKETS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOrderStatusFilter('active')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                orderStatusFilter === 'active'
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              In-Flight / Kitchen Active
            </button>
            <button
              onClick={() => setOrderStatusFilter('ready')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                orderStatusFilter === 'ready'
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              Ready for Dispatch
            </button>
            <button
              onClick={() => setOrderStatusFilter('completed')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                orderStatusFilter === 'completed'
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              Served / Completed
            </button>
          </div>

          {activeOrders.length === 0 ? (
            <div className="text-center py-16 bg-stone-900/60 rounded-3xl border border-dashed border-stone-800">
              <CheckCircle className="w-10 h-10 text-stone-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-300">All caught up!</p>
              <p className="text-xs text-stone-500">No pending kitchen orders in this view.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOrders.map((order) => {
                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition shadow-sm ${
                      order.orderStatus === 'ready'
                        ? 'bg-emerald-950/20 border-emerald-500/50'
                        : order.orderStatus === 'preparing'
                        ? 'bg-amber-950/20 border-amber-500/50'
                        : 'bg-stone-900 border-stone-800'
                    }`}
                  >
                    <div>
                      {/* Ticket Header */}
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-lg text-stone-100">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                                order.orderType === 'dine_in'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              }`}
                            >
                              {order.orderType === 'dine_in'
                                ? order.tableNumber
                                  ? `Table #${order.tableNumber}`
                                  : 'Queue Waiting'
                                : 'Parcel Takeaway'}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Customer: <strong>{order.customerName || 'Guest'}</strong>
                          </p>
                        </div>

                        <span className="text-[11px] font-mono text-stone-400">
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="py-3 space-y-2 text-xs">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-bold text-stone-200">
                                {item.quantity}x {item.product.name}
                              </span>
                              {item.customization && (
                                <p className="text-[11px] text-amber-400/90">
                                  {[
                                    item.customization.temperature,
                                    item.customization.size,
                                    item.customization.milk,
                                    item.customization.sweetness,
                                  ]
                                    .filter(Boolean)
                                    .join(' • ')}
                                </p>
                              )}
                              {item.specialInstructions && (
                                <p className="text-[10px] text-rose-300 italic">
                                  "{item.specialInstructions}"
                                </p>
                              )}
                            </div>
                            <span className="font-mono text-stone-400">
                              ₹{item.itemTotal}
                            </span>
                          </div>
                        ))}

                        {order.kitchenNotes && (
                          <div className="mt-2 p-2 rounded-lg bg-stone-950 text-[11px] text-amber-300 border border-amber-900/50">
                            <strong>Note:</strong> {order.kitchenNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Kitchen Action Buttons */}
                    <div className="pt-3 border-t border-stone-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span>Current Status:</span>
                        <span className="font-bold uppercase text-amber-400">
                          {order.orderStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {order.orderStatus === 'placed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'accepted')}
                            className="col-span-2 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow transition"
                          >
                            Accept Order
                          </button>
                        )}

                        {order.orderStatus === 'accepted' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="col-span-2 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>Start Brewing / Prep</span>
                          </button>
                        )}

                        {order.orderStatus === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="col-span-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Mark Ready for Pickup</span>
                          </button>
                        )}

                        {order.orderStatus === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'served')}
                            className="col-span-2 py-2 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-100 font-bold text-xs transition"
                          >
                            Mark as Served
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FLOOR TABLES & TABLE QUEUE ALLOCATION */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Floorplan Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-display font-bold text-base text-stone-200">
              Café Table Floorplan (Tables 1 - 8)
            </h3>
            <p className="text-xs text-stone-400">
              Click any table to manually toggle status (Available, Occupied, Cleaning).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {tables.map((t) => {
                let badgeColor = 'bg-stone-800 border-stone-700 text-stone-300';
                if (t.status === 'available') {
                  badgeColor = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300';
                } else if (t.status === 'occupied') {
                  badgeColor = 'bg-rose-950/40 border-rose-500/50 text-rose-300';
                } else if (t.status === 'cleaning') {
                  badgeColor = 'bg-amber-950/40 border-amber-500/50 text-amber-300';
                }

                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border ${badgeColor} flex flex-col justify-between min-h-[120px] transition`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-extrabold text-lg">
                          Table #{t.number}
                        </span>
                        <span className="text-[10px] text-stone-400">{t.seats} Seats</span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider block">
                        {t.status}
                      </span>
                    </div>

                    {/* Quick status switchers */}
                    <div className="flex gap-1 pt-2">
                      <button
                        onClick={() => updateTableStatus(t.id, 'available')}
                        className={`text-[10px] px-2 py-1 rounded ${
                          t.status === 'available'
                            ? 'bg-emerald-500 text-stone-950 font-bold'
                            : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        Free
                      </button>
                      <button
                        onClick={() => updateTableStatus(t.id, 'occupied')}
                        className={`text-[10px] px-2 py-1 rounded ${
                          t.status === 'occupied'
                            ? 'bg-rose-500 text-white font-bold'
                            : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        Occ
                      </button>
                      <button
                        onClick={() => updateTableStatus(t.id, 'cleaning')}
                        className={`text-[10px] px-2 py-1 rounded ${
                          t.status === 'cleaning'
                            ? 'bg-amber-500 text-stone-950 font-bold'
                            : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        Clean
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Live Table Queue Management */}
          <div className="bg-stone-900 rounded-2xl p-5 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-stone-200">
                Live Table Queue
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                {tableQueue.length} Waiting
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Customers in queue had their food prep started <strong>in parallel</strong> upon ordering.
              Assign any free table as soon as it opens!
            </p>

            <div className="space-y-3">
              {tableQueue.length === 0 ? (
                <div className="text-center py-8 text-stone-500">
                  <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No customers currently waiting in table queue.</p>
                </div>
              ) : (
                tableQueue.map((entry, idx) => {
                  const freeTables = tables.filter((t) => t.status === 'available');

                  return (
                    <div
                      key={entry.id}
                      className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-xs text-stone-200">
                            #{idx + 1}. {entry.customerName}
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            Joined at {entry.joinedAt}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-amber-400">
                          ~{entry.estimatedWaitMinutes} min
                        </span>
                      </div>

                      {/* Quick Assign Dropdown */}
                      <div className="flex items-center gap-2 pt-1">
                        {freeTables.length > 0 ? (
                          <div className="flex-1 flex gap-1.5 flex-wrap">
                            {freeTables.map((t) => (
                              <button
                                key={t.id}
                                onClick={() => assignTableFromQueue(entry.id, t.number)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition"
                              >
                                Assign Table #{t.number}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-rose-400 italic">
                            No tables currently free
                          </span>
                        )}

                        <button
                          onClick={() => leaveQueue(entry.id)}
                          className="text-[10px] text-stone-500 hover:text-rose-400 underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COUNTER CASH REGISTER */}
      {activeTab === 'counter' && (
        <div className="bg-stone-900 rounded-2xl p-5 border border-stone-800 space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-stone-200">
              Counter Cash Collection
            </h3>
            <p className="text-xs text-stone-400">
              Orders where the customer selected "Pay at Counter". Collect cash or run physical card terminal.
            </p>
          </div>

          <div className="divide-y divide-stone-800">
            {orders.filter((o) => o.paymentMethod === 'counter').length === 0 ? (
              <div className="py-8 text-center text-stone-500 text-xs">
                No orders waiting for counter payment.
              </div>
            ) : (
              orders
                .filter((o) => o.paymentMethod === 'counter')
                .map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-100">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {ord.customerName} • {ord.items.length} items
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono font-extrabold text-sm text-amber-400 block">
                          ₹{ord.total}
                        </span>
                        {ord.paymentStatus === 'pending' && (
                          <span className="text-[10px] text-stone-500 block">
                            🎟️ Issues Lucky Draw Coupon
                          </span>
                        )}
                      </div>

                      {ord.paymentStatus === 'pending' ? (
                        <button
                          onClick={() => confirmCounterPayment(ord.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm Paid (₹{ord.total})</span>
                        </button>
                      ) : (
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          Received
                        </span>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LUCKY DRAW PRIZE REDEMPTION */}
      {activeTab === 'redemption' && (
        <div className="bg-stone-900 rounded-2xl p-6 border border-stone-800 max-w-xl mx-auto space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-stone-100">
                Prize Redemption Desk
              </h3>
              <p className="text-xs text-stone-400">
                Verify customer's winning Order-ID scratch voucher code
              </p>
            </div>
          </div>

          <form onSubmit={handleRedeemSubmit} className="space-y-3">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Enter Voucher Code:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value)}
                placeholder="e.g. WIN-8492-301"
                className="flex-1 px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono text-sm uppercase tracking-wider focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify</span>
              </button>
            </div>
          </form>

          {redemptionResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1 ${
                redemptionResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 text-sm">
                {redemptionResult.success ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Redemption Approved!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Redemption Failed</span>
                  </>
                )}
              </div>
              <p>{redemptionResult.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
