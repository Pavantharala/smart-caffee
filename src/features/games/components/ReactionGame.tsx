import React, { useState, useRef } from 'react';
import { Timer, RotateCcw, ArrowLeft, Trophy, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameComponentProps } from '../types';

export const ReactionGame: React.FC<GameComponentProps> = ({ onBackToHub }) => {
  const [reactionState, setReactionState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestReactionTime, setBestReactionTime] = useState<number | null>(null);
  const reactionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reactionStartTimeRef = useRef<number>(0);

  const startReactionTest = () => {
    setReactionState('waiting');
    setReactionTime(null);
    const delay = 1800 + Math.random() * 2500;
    reactionTimerRef.current = setTimeout(() => {
      setReactionState('ready');
      reactionStartTimeRef.current = Date.now();
    }, delay);
  };

  const handleReactionClick = () => {
    if (reactionState === 'waiting') {
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
      setReactionState('idle');
      alert('Too early! Wait for the cup to turn bright green.');
    } else if (reactionState === 'ready') {
      const elapsed = Date.now() - reactionStartTimeRef.current;
      setReactionTime(elapsed);
      setBestReactionTime((prev) => (prev ? Math.min(prev, elapsed) : elapsed));
      setReactionState('result');
      if (elapsed < 300) {
        try {
          confetti({ particleCount: 40, spread: 50 });
        } catch (e) {}
      }
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-md mx-auto shadow-2xl">
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
              <Timer className="w-5 h-5 text-amber-500" />
              Barista Reflex Rush
            </h3>
            <p className="text-xs text-stone-400">Test your reflex speed in milliseconds</p>
          </div>
        </div>

        <div className="bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700/60 text-center">
          <span className="text-[10px] text-stone-400 uppercase font-bold block flex items-center gap-1 justify-center">
            <Trophy className="w-2.5 h-2.5 text-amber-500" /> Best
          </span>
          <span className="text-emerald-400 font-mono font-bold text-sm">
            {bestReactionTime ? `${bestReactionTime}ms` : '--'}
          </span>
        </div>
      </div>

      {/* Target Zone Button */}
      <button
        onClick={handleReactionClick}
        disabled={reactionState === 'idle' || reactionState === 'result'}
        className={`w-full aspect-[4/3] rounded-3xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer shadow-inner mb-6 ${
          reactionState === 'waiting'
            ? 'bg-rose-950/60 border-4 border-rose-600/80 animate-pulse'
            : reactionState === 'ready'
            ? 'bg-emerald-500 border-4 border-emerald-300 text-stone-950 scale-105'
            : 'bg-stone-950 border-2 border-stone-800'
        }`}
      >
        {reactionState === 'idle' && (
          <div className="text-stone-400">
            <Coffee className="w-12 h-12 mx-auto mb-2 text-stone-500" />
            <p className="font-bold text-base text-stone-300">Ready to test your reflexes?</p>
            <p className="text-xs text-stone-500 mt-1">Tap START below to begin countdown</p>
          </div>
        )}

        {reactionState === 'waiting' && (
          <div className="text-rose-300">
            <p className="text-xl font-black">HOLD ON...</p>
            <p className="text-xs opacity-80 mt-1">Wait until it turns bright GREEN!</p>
          </div>
        )}

        {reactionState === 'ready' && (
          <div className="text-stone-950">
            <p className="text-3xl font-black animate-bounce">TAP NOW! ☕</p>
          </div>
        )}

        {reactionState === 'result' && (
          <div className="text-center animate-fade-in">
            <p className="text-xs uppercase font-bold text-stone-400 mb-1">Your Reaction Time</p>
            <p className="text-4xl font-black font-mono text-amber-400">{reactionTime} ms</p>
            <p className="text-xs text-stone-300 mt-2">
              {reactionTime! < 250
                ? '⚡ World-Class Master Barista!'
                : reactionTime! < 350
                ? '👌 Great reflexes, perfectly extracted!'
                : '☕ Needs an espresso shot boost!'}
            </p>
          </div>
        )}
      </button>

      {/* Control Buttons */}
      <div className="flex justify-center">
        {reactionState === 'idle' || reactionState === 'result' ? (
          <button
            onClick={startReactionTest}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-sm transition transform active:scale-95 shadow-lg shadow-amber-500/20"
          >
            {reactionState === 'result' ? 'Try Again' : 'Start Reflex Rush'}
          </button>
        ) : (
          <button
            onClick={() => {
              if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
              setReactionState('idle');
            }}
            className="px-6 py-2 bg-stone-800 hover:bg-stone-750 text-stone-300 font-semibold rounded-xl text-xs transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
