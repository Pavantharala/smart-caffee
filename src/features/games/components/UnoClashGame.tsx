import React, { useState, useEffect } from 'react';
import { Layers, RotateCcw, ArrowLeft, Trophy, Bot, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameComponentProps, UnoCard } from '../types';

export const UnoClashGame: React.FC<GameComponentProps> = ({ onBackToHub }) => {
  const createRandomUnoCard = (): UnoCard => {
    const colors: ('red' | 'blue' | 'green' | 'yellow')[] = ['red', 'blue', 'green', 'yellow'];
    const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', '+2'];
    const isWild = Math.random() < 0.08;

    if (isWild) {
      return {
        id: 'c-' + Math.random().toString(36).substr(2, 6),
        color: 'wild',
        value: 'wild',
        symbol: '🌈',
      };
    }

    const c = colors[Math.floor(Math.random() * colors.length)];
    const v = values[Math.floor(Math.random() * values.length)];
    const sym = v === 'skip' ? '🚫' : v === '+2' ? '+2' : v;
    return {
      id: 'c-' + Math.random().toString(36).substr(2, 6),
      color: c,
      value: v,
      symbol: sym,
    };
  };

  const [playerHand, setPlayerHand] = useState<UnoCard[]>([]);
  const [botHandCount, setBotHandCount] = useState<number>(5);
  const [topDiscard, setTopDiscard] = useState<UnoCard | null>(null);
  const [unoTurn, setUnoTurn] = useState<'player' | 'bot'>('player');
  const [unoWinner, setUnoWinner] = useState<string | null>(null);
  const [unoStatusMessage, setUnoStatusMessage] = useState('Your turn! Match the color or value.');

  const initUnoGame = () => {
    const pCards = Array.from({ length: 5 }).map(() => createRandomUnoCard());
    let initialTop = createRandomUnoCard();
    while (initialTop.color === 'wild') {
      initialTop = createRandomUnoCard();
    }
    setPlayerHand(pCards);
    setBotHandCount(5);
    setTopDiscard(initialTop);
    setUnoTurn('player');
    setUnoWinner(null);
    setUnoStatusMessage('Your turn! Match the color (' + initialTop.color + ') or value (' + initialTop.value + ').');
  };

  useEffect(() => {
    initUnoGame();
  }, []);

  const isCardPlayable = (card: UnoCard): boolean => {
    if (!topDiscard) return true;
    if (card.color === 'wild') return true;
    if (card.color === topDiscard.color) return true;
    if (card.value === topDiscard.value) return true;
    return false;
  };

  const handleBotUnoMove = (currentTop: UnoCard) => {
    const botCanPlay = Math.random() < 0.65;
    if (botCanPlay) {
      const colors: ('red' | 'blue' | 'green' | 'yellow')[] = ['red', 'blue', 'green', 'yellow'];
      const botCard: UnoCard = {
        id: 'bot-' + Date.now(),
        color: Math.random() < 0.7 ? currentTop.color : colors[Math.floor(Math.random() * colors.length)],
        value: Math.floor(Math.random() * 9).toString(),
        symbol: '⚡',
      };
      setTopDiscard(botCard);
      setBotHandCount((cnt) => {
        const next = Math.max(0, cnt - 1);
        if (next === 0) {
          setUnoWinner('Barista');
          setUnoStatusMessage('Barista won this round! Try a rematch.');
        }
        return next;
      });
      setUnoStatusMessage('Barista played a card! Your turn.');
    } else {
      setBotHandCount((b) => b + 1);
      setUnoStatusMessage('Barista had no match and drew a card. Your turn!');
    }
    setUnoTurn('player');
  };

  const handlePlayCard = (card: UnoCard) => {
    if (unoTurn !== 'player' || unoWinner) return;
    if (!isCardPlayable(card)) {
      setUnoStatusMessage('Cannot play that card! Must match color ' + topDiscard?.color + ' or value.');
      return;
    }

    const nextHand = playerHand.filter((c) => c.id !== card.id);
    setPlayerHand(nextHand);

    let nextDiscard = card;
    if (card.color === 'wild') {
      const colors: ('red' | 'blue' | 'green' | 'yellow')[] = ['red', 'blue', 'green', 'yellow'];
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];
      nextDiscard = { ...card, color: chosenColor, symbol: '🌈 ' + chosenColor };
    }
    setTopDiscard(nextDiscard);

    if (nextHand.length === 0) {
      setUnoWinner('You');
      setUnoStatusMessage('🎉 VICTORY! You emptied your hand first!');
      try {
        confetti({ particleCount: 80, spread: 70 });
      } catch (e) {}
      return;
    }

    if (card.value === '+2') {
      setBotHandCount((b) => b + 2);
      setUnoStatusMessage('You played +2! Barista draws 2 cards. Your turn again!');
      return;
    }
    if (card.value === 'skip') {
      setUnoStatusMessage('You played Skip! Barista skipped. Your turn again!');
      return;
    }

    setUnoTurn('bot');
    setUnoStatusMessage('Barista is thinking...');

    setTimeout(() => {
      handleBotUnoMove(nextDiscard);
    }, 1200);
  };

  const handleDrawCard = () => {
    if (unoTurn !== 'player' || unoWinner) return;
    const drawn = createRandomUnoCard();
    setPlayerHand((prev) => [...prev, drawn]);
    setUnoStatusMessage(`You drew a ${drawn.color} ${drawn.value} card.`);

    setUnoTurn('bot');
    setTimeout(() => {
      if (topDiscard) handleBotUnoMove(topDiscard);
    }, 1200);
  };

  const getColorBg = (c: string) => {
    switch (c) {
      case 'red':
        return 'bg-red-600 border-red-400 text-white';
      case 'blue':
        return 'bg-blue-600 border-blue-400 text-white';
      case 'green':
        return 'bg-emerald-600 border-emerald-400 text-white';
      case 'yellow':
        return 'bg-amber-500 border-amber-300 text-stone-950 font-black';
      case 'wild':
        return 'bg-gradient-to-r from-red-500 via-emerald-500 to-blue-500 border-white text-white font-black';
      default:
        return 'bg-stone-800 border-stone-600 text-white';
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-lg mx-auto shadow-2xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-800">
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
              <Layers className="w-5 h-5 text-amber-500" />
              Uno Card Clash
            </h3>
            <p className="text-xs text-stone-400">Match colors & numbers to empty hand</p>
          </div>
        </div>

        <button
          onClick={initUnoGame}
          className="p-2 bg-stone-800 hover:bg-stone-750 text-stone-300 rounded-xl border border-stone-700 transition"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Opponent Barista Hand */}
      <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-stone-800 rounded-xl">
            <Bot className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Barista Bot</p>
            <p className="text-[10px] text-stone-400">{botHandCount} cards remaining</p>
          </div>
        </div>
        <div className="flex -space-x-2">
          {Array.from({ length: Math.min(botHandCount, 7) }).map((_, i) => (
            <div
              key={i}
              className="w-6 h-9 rounded-md bg-stone-800 border border-stone-700 shadow-sm"
            />
          ))}
        </div>
      </div>

      {/* Discard Pile & Draw Deck */}
      <div className="py-4 flex items-center justify-center gap-6 bg-stone-950 rounded-2xl border border-stone-800/80 mb-4">
        {/* Draw Pile */}
        <button
          onClick={handleDrawCard}
          disabled={unoTurn !== 'player' || Boolean(unoWinner)}
          className="w-16 h-24 rounded-xl bg-stone-800 hover:bg-stone-700 border-2 border-stone-600 flex flex-col items-center justify-center text-xs font-bold text-stone-300 shadow-md transform active:scale-95 transition"
        >
          <span>DRAW</span>
          <span className="text-[10px] text-stone-400">+1</span>
        </button>

        {/* Current Discard Card */}
        {topDiscard && (
          <div
            className={`w-16 h-24 rounded-xl border-2 flex flex-col items-center justify-center shadow-xl animate-fade-in ${getColorBg(
              topDiscard.color
            )}`}
          >
            <span className="text-xl font-black">{topDiscard.symbol}</span>
            <span className="text-[9px] uppercase tracking-wider">{topDiscard.color}</span>
          </div>
        )}
      </div>

      {/* Turn & Status Message */}
      <div className="text-center mb-4">
        <p className="text-xs text-amber-400 font-medium px-2 py-1 bg-amber-500/10 rounded-lg inline-block border border-amber-500/20">
          {unoStatusMessage}
        </p>
      </div>

      {/* Player's Cards Hand */}
      <div>
        <div className="flex justify-between items-center mb-2 px-1 text-xs">
          <span className="font-bold text-stone-300">Your Hand ({playerHand.length})</span>
          <span className="text-[11px] text-stone-400">Tap a card to play</span>
        </div>
        <div className="flex flex-wrap gap-2 justify-center max-h-36 overflow-y-auto p-1">
          {playerHand.map((card) => {
            const playable = isCardPlayable(card) && unoTurn === 'player' && !unoWinner;
            return (
              <button
                key={card.id}
                onClick={() => handlePlayCard(card)}
                disabled={!playable}
                className={`w-14 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${getColorBg(
                  card.color
                )} ${
                  playable
                    ? 'hover:-translate-y-2 cursor-pointer shadow-md hover:shadow-amber-500/20'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <span className="text-lg font-black">{card.symbol}</span>
                <span className="text-[8px] uppercase">{card.color}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Winner Modal */}
      {unoWinner && (
        <div className="mt-4 p-4 bg-stone-950 border border-stone-800 rounded-2xl text-center">
          <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-1 animate-bounce" />
          <h4 className="text-base font-black text-white">{unoWinner} Won the Match!</h4>
          <button
            onClick={initUnoGame}
            className="mt-3 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition"
          >
            Play Rematch
          </button>
        </div>
      )}
    </div>
  );
};
