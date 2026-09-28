import React, { useState, useEffect } from 'react';
import {
  Coffee,
  CheckCircle2,
  Clock,
  Sparkles,
  Gamepad2,
  UtensilsCrossed,
  Package,
  ArrowRight,
  AlertTriangle,
  Receipt,
  UserCheck,
  Flame,
  HelpCircle,
  XCircle,
  Star,
  MessageSquare,
  Gift,
  Timer,
  Check,
} from 'lucide-react';
import { useCafe } from '../../../context/CafeContext';

interface ActiveOrderTrackerProps {
  onOpenLuckyDraw: () => void;
  onOpenGamesLounge: () => void;
  onBackToMenu: () => void;
}

export const ActiveOrderTracker: React.FC<ActiveOrderTrackerProps> = ({
  onOpenLuckyDraw,
  onOpenGamesLounge,
  onBackToMenu,
}) => {
  const {
    activeOrder,
    convertDineInToParcel,
    cancelOrder,
    tableQueue,
    activeCampaign,
    submitFeedback,
    systemSettings,
  } = useCafe();

  const [timeLeftMinutes, setTimeLeftMinutes] = useState<number>(60);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [foodRating, setFoodRating] = useState<number>(5);
  const [serviceRating, setServiceRating] = useState<number>(5);
  const [waitingRating, setWaitingRating] = useState<number>(5);
  const [feedbackComments, setFeedbackComments] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Live timer for 60-minute engagement access
  useEffect(() => {
    if (!activeOrder) return;
    const calculateTimeLeft = () => {
      const now = Date.now();
      const diffMs = activeOrder.engagementExpiresAt - now;
      const mins = Math.max(0, Math.ceil(diffMs / 60000));
      setTimeLeftMinutes(mins);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 10000);
    return () => clearInterval(interval);
  }, [activeOrder]);

  if (!activeOrder) {
    return (
      <div className="text-center py-16 bg-stone-900/60 rounded-3xl border border-stone-800 p-6 max-w-xl mx-auto">
        <Coffee className="w-12 h-12 text-stone-600 mx-auto mb-3" />
        <h3 className="font-display font-bold text-lg text-stone-200">No Active Order</h3>
        <p className="text-xs text-stone-400 mt-1 mb-4">
          Browse our Indian street snacks, hot Kadak chai, and desserts to place your order.
        </p>
        <button
          onClick={onBackToMenu}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const prepSteps = [
    { key: 'placed', label: 'Order Placed', desc: 'Received by kitchen' },
    { key: 'accepted', label: 'Accepted', desc: 'Queued at station' },
    { key: 'preparing', label: 'Cooking & Brewing', desc: 'On fire & espresso' },
    { key: 'ready', label: 'Ready', desc: 'Dispatched / at counter' },
    { key: 'served', label: 'Served', desc: 'Enjoy your meal!' },
  ];

  const currentStepIndex = prepSteps.findIndex((s) => s.key === activeOrder.orderStatus);

  // Queue position
  const queueEntry = tableQueue.find((q) => q.orderId === activeOrder.id);
  const queuePosition = queueEntry ? tableQueue.indexOf(queueEntry) + 1 : activeOrder.queuePosition;

  const handleCancelClick = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const res = cancelOrder(activeOrder.id);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback({
      orderId: activeOrder.id,
      foodRating,
      serviceRating,
      waitingRating,
      comments: feedbackComments.trim() || undefined,
    });
    setFeedbackSubmitted(true);
    setShowFeedbackModal(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Top Banner with Order ID & Status */}
      <div className="bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
              Live Order Tracker
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="font-display font-extrabold text-2xl text-stone-100">
                {activeOrder.orderNumber}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${
                  activeOrder.orderStatus === 'served'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : activeOrder.orderStatus === 'cancelled'
                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {activeOrder.orderStatus}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-stone-400 block">Estimated Prep</span>
            <span className="font-mono font-bold text-stone-200 flex items-center gap-1 justify-end">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              ~{activeOrder.estimatedPrepMinutes} mins
            </span>
          </div>
        </div>

        {/* 60-Minute Engagement Access Rule Banner */}
        <div className="mt-4 p-3 rounded-xl bg-stone-950/80 border border-purple-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-purple-300">
            <Timer className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              <strong>Engagement Pass:</strong> {timeLeftMinutes > 0 ? `${timeLeftMinutes} mins remaining` : 'Expired'}
            </span>
          </div>
          <span className="text-[11px] text-stone-400 hidden sm:inline">
            (Calculated from order confirmation)
          </span>
        </div>

        {/* PARALLEL STREAMS VISUALIZER */}
        <div className="mt-5 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Parallel Wait Optimization
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              ⚡ Zero Wasted Wait Time
            </span>
          </div>

          {/* STREAM 1: Kitchen Cooking Progress */}
          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-stone-200">Stream 1: Kitchen Preparation</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400 capitalize">
                {activeOrder.orderStatus === 'ready'
                  ? '🔔 Ready for you!'
                  : activeOrder.orderStatus === 'served'
                  ? 'Served & Complete'
                  : activeOrder.orderStatus}
              </span>
            </div>

            {/* Step Line */}
            <div className="grid grid-cols-5 gap-1 pt-1">
              {prepSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step.key} className="text-center">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isPassed
                          ? isCurrent
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-amber-600'
                          : 'bg-stone-800'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-semibold mt-1.5 block truncate ${
                        isPassed ? 'text-amber-300' : 'text-stone-600'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STREAM 2: Table Seating / Queue */}
          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-stone-200">Stream 2: Dining & Seating</span>
              </div>
              <span className="text-[11px] font-mono text-stone-300">
                {activeOrder.orderType === 'parcel'
                  ? 'Parcel Takeaway'
                  : activeOrder.tableNumber
                  ? `Table #${activeOrder.tableNumber}`
                  : 'Table Queue'}
              </span>
            </div>

            {/* Context Box */}
            {activeOrder.orderType === 'parcel' ? (
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 flex items-center gap-2.5">
                <Package className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Packaged for takeaway. Collect at pickup counter as soon as kitchen marks Ready.
                </span>
              </div>
            ) : activeOrder.tableNumber ? (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Table <strong>#{activeOrder.tableNumber}</strong> is allocated and reserved for you!
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  Assigned
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-xs text-stone-300 space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-300">
                    <span>You are #{queuePosition || 1} in Table Queue</span>
                    <span>~{((queuePosition || 1) * 7)} mins est.</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    While you wait for your table, your food is <strong>already cooking in parallel</strong>!
                    You will be notified the instant a table is cleaned and ready.
                  </p>
                </div>

                {/* Convert Dine-in to Parcel rule */}
                {systemSettings.allowDineInToParcel && (
                  <button
                    onClick={() => convertDineInToParcel(activeOrder.id)}
                    className="w-full py-2 px-3 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-stone-100 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Package className="w-3.5 h-3.5 text-amber-400" />
                    <span>In a hurry? Switch to Parcel Takeaway instead</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Counter payment alert if unpaid */}
        {activeOrder.paymentMethod === 'counter' && activeOrder.paymentStatus === 'pending' && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Payment Pending at Counter: <strong>₹{activeOrder.total}</strong>
              </span>
            </div>
            <span className="text-[11px] text-stone-400">
              Pay cashier at desk. Your Lucky Draw coupon will be generated upon confirmation!
            </span>
          </div>
        )}

        {/* Cancel Order Button */}
        {activeOrder.cancellationAllowed && activeOrder.orderStatus === 'placed' && (
          <div className="mt-4 pt-3 border-t border-stone-800/80 flex justify-end">
            <button
              onClick={handleCancelClick}
              className="text-xs text-stone-400 hover:text-red-400 transition flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>
          </div>
        )}
      </div>

      {/* WAITING ENGAGEMENT TILES: Lucky Draw + Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Lucky Draw Card */}
        <div
          onClick={activeOrder.luckyDrawCoupon ? onOpenLuckyDraw : undefined}
          className={`p-5 rounded-3xl border shadow-xl transition relative overflow-hidden ${
            activeOrder.luckyDrawCoupon
              ? 'bg-gradient-to-br from-amber-950/50 via-stone-900 to-stone-900 border-amber-600/40 hover:border-amber-500 cursor-pointer group'
              : 'bg-stone-900/90 border-stone-800'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`p-2.5 rounded-2xl ${
                activeOrder.luckyDrawCoupon
                  ? 'bg-amber-500/20 text-amber-300 group-hover:scale-110 transition'
                  : 'bg-stone-800 text-stone-500'
              }`}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            {activeOrder.luckyDrawCoupon ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-950/60 border border-amber-500/20 text-amber-300">
                {activeOrder.luckyDrawCoupon.couponId}
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-950/60 border border-stone-800 text-stone-500">
                Campaign Locked
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-lg text-stone-100 mb-1">
            Lucky Draw Campaign
          </h3>

          <p className="text-xs text-stone-400 mb-4 leading-relaxed">
            {activeOrder.luckyDrawCoupon ? (
              <>
                Official Coupon #{activeOrder.luckyDrawCoupon.couponId} issued for{' '}
                <strong>{activeOrder.luckyDrawCoupon.campaignTitle}</strong>! Tap to reveal your voucher.
              </>
            ) : activeOrder.paymentMethod === 'counter' ? (
              'Pay at the cashier desk to unlock and receive your official Lucky Draw coupon!'
            ) : activeCampaign ? (
              `Participating in ${activeCampaign.title}. Complete payment to receive your coupon.`
            ) : (
              'No active Lucky Draw campaign right now.'
            )}
          </p>

          {activeOrder.luckyDrawCoupon && (
            <div className="flex items-center text-xs font-bold text-amber-400 gap-1 group-hover:text-amber-300">
              <span>View Coupon & Scratch Card</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          )}
        </div>

        {/* Games Lounge Card */}
        <div
          onClick={timeLeftMinutes > 0 ? onOpenGamesLounge : undefined}
          className={`p-5 rounded-3xl border shadow-xl transition relative overflow-hidden ${
            timeLeftMinutes > 0
              ? 'bg-gradient-to-br from-purple-950/50 via-stone-900 to-stone-900 border-purple-600/40 hover:border-purple-500 cursor-pointer group'
              : 'bg-stone-900/90 border-stone-800 opacity-60'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 group-hover:scale-110 transition">
              <Gamepad2 className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-950/60 border border-purple-500/20 text-purple-300">
              {timeLeftMinutes > 0 ? `${timeLeftMinutes}m Active` : 'Pass Expired'}
            </span>
          </div>

          <h3 className="font-display font-bold text-lg text-stone-100 mb-1 group-hover:text-purple-300 transition">
            Waiting Lounge Games
          </h3>
          <p className="text-xs text-stone-400 mb-4 leading-relaxed">
            Pass the waiting time playing Snake, Culinary Trivia, Ludo Express, or Barista Reaction Test!
          </p>

          <div className="flex items-center text-xs font-bold text-purple-400 gap-1">
            <span>{timeLeftMinutes > 0 ? 'Enter Game Lounge' : 'Access Expired'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* ORDER TIMELINE EVENTS LOG */}
      <div className="bg-stone-900 rounded-3xl p-5 border border-stone-800 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-sm text-stone-200">Order Timeline</h3>
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-800">
          {activeOrder.timeline.map((evt, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-stone-900" />
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-200">{evt.title}</span>
                <span className="text-[11px] font-mono text-stone-500">{evt.timestamp}</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">{evt.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ORDER ITEMS BREAKDOWN */}
      <div className="bg-stone-900 rounded-3xl p-5 border border-stone-800 shadow-sm space-y-3">
        <h3 className="font-display font-bold text-sm text-stone-200 flex items-center justify-between">
          <span>Items Ordered ({activeOrder.items.length})</span>
          <span className="font-mono text-amber-400">₹{activeOrder.total}</span>
        </h3>

        <div className="divide-y divide-stone-800/80">
          {activeOrder.items.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-stone-200">
                  {item.quantity}x {item.product.name}
                </span>
                {item.customization && (
                  <p className="text-[11px] text-stone-500">
                    {[
                      item.customization.size,
                      item.customization.spiceLevel ? `${item.customization.spiceLevel} Spice` : null,
                      item.customization.temperature,
                      item.customization.milk,
                    ]
                      .filter(Boolean)
                      .join(' • ')}
                  </p>
                )}
              </div>
              <span className="font-mono text-stone-300">₹{item.itemTotal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOMER FEEDBACK SECTION */}
      <div className="bg-stone-900 rounded-3xl p-5 border border-stone-800 shadow-sm text-center space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h3 className="font-display font-bold text-base text-stone-100">
          How was your Smart Café experience?
        </h3>
        <p className="text-xs text-stone-400 max-w-md mx-auto">
          Help us evaluate our parallel kitchen prep and waiting entertainment.
        </p>

        {activeOrder.feedback || feedbackSubmitted ? (
          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>Thank you! Your feedback has been recorded.</span>
          </div>
        ) : (
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition border border-stone-700"
          >
            Rate Your Food & Wait Experience
          </button>
        )}
      </div>

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 text-stone-100 rounded-3xl max-w-md w-full p-6 border border-stone-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Share Your Experience</h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-stone-400 hover:text-stone-100 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              {/* Food Rating */}
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                  1. Food & Beverage Taste
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFoodRating(star)}
                      className="p-1 text-stone-600 hover:text-yellow-400 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= foodRating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-stone-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-400 ml-2">{foodRating}/5</span>
                </div>
              </div>

              {/* Service Rating */}
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                  2. Staff & Counter Service
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setServiceRating(star)}
                      className="p-1 text-stone-600 hover:text-yellow-400 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= serviceRating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-stone-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-400 ml-2">{serviceRating}/5</span>
                </div>
              </div>

              {/* Waiting Experience Rating */}
              <div>
                <label className="text-xs font-semibold text-amber-300 block mb-1.5">
                  3. Waiting Experience & Lounge Games (Key Metric)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setWaitingRating(star)}
                      className="p-1 text-stone-600 hover:text-yellow-400 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= waitingRating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-stone-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-400 ml-2">{waitingRating}/5</span>
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                  Any suggestions or thoughts?
                </label>
                <textarea
                  rows={3}
                  value={feedbackComments}
                  onChange={(e) => setFeedbackComments(e.target.value)}
                  placeholder="Tell us what you loved or how we can improve your wait time..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
              >
                Submit Ratings
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
