import React, { useState } from 'react';
import { RotateCcw, Copy, Check, Sparkles, Gift, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameComponentProps, GameReward } from '../types';

export const WHEEL_PRIZES: GameReward[] = [
  { title: 'Free Hot Brownie 🍫', perk: 'Free sizzling brownie on order > ₹299', code: 'SPIN-BROWNIE-99', color: '#f59e0b' },
  { title: '₹50 Flat Discount 🎟️', perk: 'Instant ₹50 coupon deduction', code: 'SPIN-50-OFF', color: '#8b5cf6' },
  { title: 'Free Extra Cheese 🧀', perk: 'Complimentary cheese burst upgrade', code: 'SPIN-CHEESE-FREE', color: '#10b981' },
  { title: 'Free Cold Coffee ☕', perk: 'Free Hazelnut Cold Coffee glass', code: 'SPIN-COLD-BREW', color: '#ec4899' },
  { title: '15% Off Cart 🎁', perk: '15% instant reduction on total bill', code: 'SPIN-15-SAVE', color: '#3b82f6' },
  { title: 'Free Peri-Peri Dip 🥫', perk: 'Free gourmet garlic or peri dip', code: 'SPIN-DIP-FREE', color: '#f97316' },
];

export const SpinWheelGame: React.FC<GameComponentProps> = ({ onBackToHub, onRewardWon }) => {
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<GameReward | null>(null);
  const [voucherCopied, setVoucherCopied] = useState(false);

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);
    setVoucherCopied(false);

    const randomIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const segmentAngle = 360 / WHEEL_PRIZES.length;
    const extraSpins = 5 * 360;
    const targetAngle = extraSpins + (360 - (randomIndex * segmentAngle + segmentAngle / 2));

    setWheelRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = WHEEL_PRIZES[randomIndex];
      setWonPrize(prize);
      if (onRewardWon) {
        onRewardWon(prize);
      }
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }, 4000);
  };

  const copyVoucher = () => {
    if (!wonPrize) return;
    navigator.clipboard?.writeText(wonPrize.code);
    setVoucherCopied(true);
    setTimeout(() => setVoucherCopied(false), 2000);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="p-2 hover:bg-stone-800 rounded-xl text-stone-400 hover:text-stone-200 transition"
              title="Back to Lounge Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-500" />
              Spin & Win Fortune Wheel
            </h3>
            <p className="text-xs text-stone-400">Spin while your meal is cooking to unlock treats!</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full">
          1 Free Spin / Order
        </span>
      </div>

      {/* Wheel Visual */}
      <div className="flex flex-col items-center justify-center my-4 relative">
        {/* Needle indicator at top */}
        <div className="absolute -top-3 z-20 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-400 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)]" />
        </div>

        {/* Rotating Circular Wheel */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-amber-500/60 p-1.5 shadow-[0_0_35px_rgba(245,158,11,0.25)] bg-stone-950">
          <div
            className="w-full h-full rounded-full relative overflow-hidden transition-transform duration-4000 ease-[cubic-bezier(0.15,0.9,0.25,1)]"
            style={{ transform: `rotate(${wheelRotation}deg)` }}
          >
            {WHEEL_PRIZES.map((prize, idx) => {
              const rotationAngle = (360 / WHEEL_PRIZES.length) * idx;
              return (
                <div
                  key={idx}
                  className="absolute w-full h-full top-0 left-0"
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                    transformOrigin: '50% 50%',
                  }}
                >
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-32 pt-2 text-center"
                    style={{
                      color: prize.color,
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    }}
                  >
                    <span className="text-[11px] font-bold block leading-tight px-1 drop-shadow-md">
                      {prize.title}
                    </span>
                  </div>
                </div>
              );
            })}
            {/* Inner center hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-stone-900 border-2 border-amber-400 flex items-center justify-center shadow-lg z-10">
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center w-full">
          <button
            onClick={handleSpinWheel}
            disabled={isSpinning}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-stone-950 font-black rounded-2xl text-base shadow-lg shadow-amber-500/30 flex items-center gap-2 transform active:scale-95 transition-all"
          >
            <RotateCcw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? 'Spinning The Wheel...' : 'SPIN THE WHEEL NOW'}
          </button>
        </div>
      </div>

      {/* Won Prize Notification Card */}
      {wonPrize && (
        <div className="mt-6 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-500/40 rounded-2xl p-5 text-center animate-fade-in shadow-xl">
          <div className="inline-flex items-center justify-center p-2 bg-amber-500/20 rounded-full mb-2">
            <Gift className="w-6 h-6 text-amber-400 animate-bounce" />
          </div>
          <h4 className="text-lg font-black text-white">CONGRATULATIONS!</h4>
          <p className="text-amber-400 font-bold text-base mt-0.5">{wonPrize.title}</p>
          <p className="text-xs text-stone-300 mt-1">{wonPrize.perk}</p>

          <div className="mt-3 flex items-center justify-center gap-2 bg-stone-950/70 py-2.5 px-4 rounded-xl border border-stone-800 max-w-xs mx-auto">
            <span className="font-mono text-xs font-bold text-amber-400 tracking-wider">
              {wonPrize.code}
            </span>
            <button
              onClick={copyVoucher}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1 transition"
            >
              {voucherCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[10px] text-stone-400 mt-2">
            Apply this voucher code during checkout or present it at the counter!
          </p>
        </div>
      )}
    </div>
  );
};
