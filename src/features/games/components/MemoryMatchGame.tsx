import React, { useState, useEffect } from 'react';
import { Brain, RotateCcw, ArrowLeft, Trophy, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameComponentProps } from '../types';

export const MemoryMatchGame: React.FC<GameComponentProps> = ({ onBackToHub }) => {
  const MEMORY_ICONS = ['☕', '🥟', '🍛', '🍰', '🧋', '🥭'];
  const [cards, setCards] = useState<
    Array<{ id: number; icon: string; flipped: boolean; matched: boolean }>
  >([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);

  const initializeMemoryGame = () => {
    const deck = [...MEMORY_ICONS, ...MEMORY_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, idx) => ({
        id: idx,
        icon,
        flipped: false,
        matched: false,
      }));
    setCards(deck);
    setFlippedIndices([]);
    setMemoryMoves(0);
    setMemoryWon(false);
  };

  useEffect(() => {
    initializeMemoryGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || flippedIndices.length === 2) return;

    const newIndices = [...flippedIndices, index];
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setFlippedIndices(newIndices);

    if (newIndices.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [first, second] = newIndices;
      if (newCards[first].icon === newCards[second].icon) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlippedIndices([]);

        if (newCards.every((c) => c.matched)) {
          setMemoryWon(true);
          try {
            confetti({ particleCount: 70, spread: 60 });
          } catch (e) {}
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
        }, 900);
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
              <Brain className="w-5 h-5 text-amber-500" />
              Café Memory Match
            </h3>
            <p className="text-xs text-stone-400">Match 6 pairs of delicious café treats</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700/60 text-center">
            <span className="text-[10px] text-stone-400 uppercase font-bold block">Moves</span>
            <span className="text-amber-400 font-mono font-bold text-sm">{memoryMoves}</span>
          </div>
          <button
            onClick={initializeMemoryGame}
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl border border-stone-700 transition"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-4 gap-3 max-w-[320px] mx-auto mb-6">
        {cards.map((c, i) => (
          <button
            key={i}
            onClick={() => handleCardClick(i)}
            disabled={c.flipped || c.matched}
            className={`aspect-square rounded-2xl flex items-center justify-center text-3xl font-bold transition-all duration-300 transform select-none shadow-md ${
              c.flipped || c.matched
                ? 'bg-amber-500/20 border-2 border-amber-500 text-white scale-100 rotate-0'
                : 'bg-stone-800 hover:bg-stone-700 border border-stone-700 text-transparent hover:scale-105 active:scale-95'
            }`}
          >
            {c.flipped || c.matched ? c.icon : '?'}
          </button>
        ))}
      </div>

      {memoryWon && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center animate-fade-in shadow-lg">
          <Trophy className="w-8 h-8 text-emerald-400 mx-auto mb-1 animate-bounce" />
          <h4 className="text-base font-black text-white">BRAVO! ALL PAIRS MATCHED!</h4>
          <p className="text-xs text-stone-300 mt-1">
            Completed in <strong className="text-amber-400">{memoryMoves} moves</strong>!
          </p>
          <button
            onClick={initializeMemoryGame}
            className="mt-3 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl transition"
          >
            Play Another Round
          </button>
        </div>
      )}
    </div>
  );
};
