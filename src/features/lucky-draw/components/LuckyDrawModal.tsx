import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Gift,
  Award,
  Clock,
  QrCode,
  CheckCircle,
  Copy,
  PartyPopper,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCafe } from '../../../context/CafeContext';

interface LuckyDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LuckyDrawModal: React.FC<LuckyDrawModalProps> = ({ isOpen, onClose }) => {
  const { activeOrder, activeCampaign } = useCafe();
  const [isScratching, setIsScratching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  if (!isOpen || !activeOrder) return null;

  const coupon = activeOrder.luckyDrawCoupon;

  const handleReveal = () => {
    setIsScratching(true);
    setTimeout(() => {
      setIsRevealed(true);
      setIsScratching(false);

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981'],
        });
      } catch (e) {}
    }, 600);
  };

  const handleCopyCode = () => {
    if (coupon?.couponId) {
      navigator.clipboard.writeText(coupon.couponId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-stone-900 text-stone-100 rounded-3xl max-w-md w-full border border-amber-500/30 shadow-2xl overflow-hidden relative">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-stone-100">
                Official Lucky Draw Coupon
              </h2>
              <p className="text-[11px] text-stone-400">
                {coupon ? coupon.campaignTitle : 'Campaign Coupon Desk'}
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

        {/* Modal Content */}
        <div className="p-6 text-center space-y-6">
          {!coupon ? (
            <div className="py-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-stone-800 text-stone-500 flex items-center justify-center mx-auto">
                <Gift className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-lg text-stone-200">
                No Coupon Issued
              </h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                {activeOrder.paymentMethod === 'counter'
                  ? 'Your payment is pending at the counter. Once the cashier receives payment, your Lucky Draw coupon will be generated.'
                  : 'There was no active campaign running at the time of your order.'}
              </p>
            </div>
          ) : !isRevealed && !coupon.isRevealed ? (
            /* Unscratched state */
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-950 border border-stone-800 text-xs font-mono">
                <span className="text-stone-400">Order Ref:</span>
                <span className="font-bold text-amber-400">{activeOrder.orderNumber}</span>
              </div>

              <div className="relative mx-auto w-64 h-64 rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 p-1 shadow-2xl shadow-amber-900/50 flex flex-col items-center justify-center text-center">
                <div className="w-full h-full rounded-[22px] bg-stone-950/80 backdrop-blur-xs p-6 flex flex-col items-center justify-center border border-amber-400/30 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-300 animate-bounce">
                    <Gift className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-stone-100">
                      Scratch to Reveal
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Tap below to unlock your official coupon code & lottery entry
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReveal}
                disabled={isScratching}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-display font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition transform active:scale-95 disabled:opacity-50"
              >
                {isScratching ? 'Unlocking Coupon...' : '✨ Reveal My Lucky Draw Coupon'}
              </button>
            </div>
          ) : (
            /* Revealed state */
            <div className="space-y-5">
              <div className="p-5 rounded-3xl bg-stone-950 border border-amber-500/40 space-y-4 shadow-xl relative">
                <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Award className="w-4 h-4" />
                    <span>Official Lottery Entry</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    VERIFIED
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-stone-400 uppercase tracking-widest block">
                    Campaign
                  </span>
                  <h3 className="font-display font-bold text-lg text-stone-100 mt-0.5">
                    {coupon.campaignTitle}
                  </h3>
                  <p className="text-xs text-amber-300 font-semibold mt-1">
                    Prize: {coupon.prizeTitle} ({coupon.prizeValue})
                  </p>
                </div>

                {/* Coupon Code Block */}
                <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-bold">
                    Coupon ID Number
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono font-extrabold text-base sm:text-lg text-amber-400 tracking-wider">
                      {coupon.couponId}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 transition"
                      title="Copy code"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {copied && (
                    <span className="text-[11px] text-emerald-400 font-semibold block">
                      ✓ Coupon ID Copied!
                    </span>
                  )}
                </div>

                {/* Validity & Draw Date */}
                <div className="grid grid-cols-2 gap-2 text-left text-xs bg-stone-900/50 p-2.5 rounded-xl border border-stone-850">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Prize Validity:</span>
                    <span className="font-medium text-stone-300">Until {coupon.validUntil}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Draw Conducted:</span>
                    <span className="font-medium text-amber-300 font-mono">
                      {activeCampaign?.drawDate || 'Weekly Draw'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Admin conducts the draw. Winning coupons will be published on the café display and sent via notification. Present this Coupon ID to redeem!
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition"
              >
                Close & Return to Tracker
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
