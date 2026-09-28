import React, { useState } from 'react';
import { Dices, RotateCcw, ArrowLeft, Trophy, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameComponentProps } from '../types';

export const LudoSprintGame: React.FC<GameComponentProps> = ({ onBackToHub }) => {
  const [ludoDice, setLudoDice] = useState<number>(1);
  const [ludoTokens, setLudoTokens] = useState<{ p1: number; p2: number }>({ p1: 0, p2: 0 });
  const [ludoTurn, setLudoTurn] = useState<'p1' | 'p2'>('p1');
  const [ludoWinner, setLudoWinner] = useState<string | null>(null);

  const rollLudoDice = () => {
    if (ludoWinner) return;
    const rolled = Math.floor(1 + Math.random() * 6);
    setLudoDice(rolled);

    setLudoTokens((prev) => {
      const curr = prev[ludoTurn];
      const nextPos = Math.min(25, curr + rolled);
      const updated = { ...prev, [ludoTurn]: nextPos };

      if (nextPos >= 25) {
        setLudoWinner(ludoTurn === 'p1' ? 'Player 1 (Gold)' : 'Player 2 (Emerald)');
        try {
          confetti({ particleCount: 70, spread: 70 });
        } catch (e) {}
      }

      return updated;
    });

    setLudoTurn((t) => (t === 'p1' ? 'p2' : 'p1'));
  };

  const resetLudo = () => {
    setLudoTokens({ p1: 0, p2: 0 });
    setLudoWinner(null);
    setLudoTurn('p1');
    setLudoDice(1);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-lg mx-auto shadow-2xl">
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
              <Dices className="w-5 h-5 text-amber-500" />
              Ludo Express Sprint
            </h3>
            <p className="text-xs text-stone-400">Race your token to square #25 first</p>
          </div>
        </div>

        <button
          onClick={resetLudo}
          className="p-2 bg-stone-800 hover:bg-stone-750 text-stone-300 rounded-xl border border-stone-700 transition"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Track Visualization */}
      <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 mb-6">
        <div className="flex items-center justify-between text-xs text-stone-400 mb-2 font-mono">
          <span>START (0)</span>
          <span>GOAL (25) 🏆</span>
        </div>

        {/* Player 1 Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-amber-400 font-bold">Player 1 (Gold)</span>
            <span className="font-mono text-amber-400">{ludoTokens.p1} / 25</span>
          </div>
          <div className="w-full h-4 bg-stone-900 rounded-full overflow-hidden border border-stone-800 p-0.5">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${(ludoTokens.p1 / 25) * 100}%` }}
            />
          </div>
        </div>

        {/* Player 2 Progress */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-emerald-400 font-bold">Player 2 (Emerald)</span>
            <span className="font-mono text-emerald-400">{ludoTokens.p2} / 25</span>
          </div>
          <div className="w-full h-4 bg-stone-900 rounded-full overflow-hidden border border-stone-800 p-0.5">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${(ludoTokens.p2 / 25) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dice & Turn Control */}
      {!ludoWinner ? (
        <div className="text-center">
          <div className="mb-4 text-xs font-bold text-stone-300 uppercase tracking-wider">
            Current Turn:{' '}
            <span className={ludoTurn === 'p1' ? 'text-amber-400' : 'text-emerald-400'}>
              {ludoTurn === 'p1' ? 'Player 1' : 'Player 2'}
            </span>
          </div>

          <div className="inline-block p-4 bg-stone-950 border border-stone-800 rounded-2xl mb-5 shadow-lg">
            <span className="text-5xl font-black text-amber-400 font-mono">{ludoDice}</span>
          </div>

          <div>
            <button
              onClick={rollLudoDice}
              className={`px-8 py-3.5 text-stone-950 font-black rounded-xl text-base shadow-lg transition transform active:scale-95 flex items-center gap-2 mx-auto ${
                ludoTurn === 'p1'
                  ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-400/20'
                  : 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-400/20'
              }`}
            >
              <Dices className="w-5 h-5" /> Roll Dice
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 bg-stone-950 border border-stone-800 rounded-2xl text-center animate-fade-in">
          <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-2 animate-bounce" />
          <h4 className="text-lg font-black text-white">{ludoWinner} Won the Race!</h4>
          <p className="text-xs text-stone-400 mt-1 mb-4">First token to cross #25 home plate.</p>
          <button
            onClick={resetLudo}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition"
          >
            Play Rematch
          </button>
        </div>
      )}
    </div>
  );
};
