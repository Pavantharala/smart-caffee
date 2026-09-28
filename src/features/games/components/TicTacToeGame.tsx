import React, { useState } from 'react';
import { Bot, Users, RotateCcw, ArrowLeft, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameComponentProps } from '../types';

export const TicTacToeGame: React.FC<GameComponentProps> = ({ onBackToHub }) => {
  const [mode, setMode] = useState<'bot' | 'pvp'>('bot');
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<'X' | 'O' | 'draw' | null>(null);
  const [streak, setStreak] = useState({ x: 0, o: 0 });

  const checkGridWinner = (b: (string | null)[]): 'X' | 'O' | 'draw' | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [x, y, z] of lines) {
      if (b[x] && b[x] === b[y] && b[x] === b[z]) return b[x] as 'X' | 'O';
    }
    if (b.every((c) => c !== null)) return 'draw';
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    if (mode === 'bot') {
      const newBoard = [...board];
      newBoard[index] = 'X';
      const w = checkGridWinner(newBoard);
      if (w) {
        setBoard(newBoard);
        setWinner(w);
        if (w === 'X') {
          setStreak((s) => ({ ...s, x: s.x + 1 }));
          try {
            confetti({ particleCount: 50, spread: 60 });
          } catch (e) {}
        }
        return;
      }

      // Bot move
      const emptyIndices = newBoard
        .map((val, idx) => (val === null ? idx : null))
        .filter((v): v is number => v !== null);

      if (emptyIndices.length > 0) {
        const botPick = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        newBoard[botPick] = 'O';
        const botW = checkGridWinner(newBoard);
        setBoard(newBoard);
        if (botW) {
          setWinner(botW);
          if (botW === 'O') setStreak((s) => ({ ...s, o: s.o + 1 }));
        }
      } else {
        setBoard(newBoard);
        setWinner('draw');
      }
    } else {
      // 2-Player pass & play
      const newBoard = [...board];
      newBoard[index] = turn;
      const w = checkGridWinner(newBoard);
      setBoard(newBoard);

      if (w) {
        setWinner(w);
        if (w === 'X') setStreak((s) => ({ ...s, x: s.x + 1 }));
        if (w === 'O') setStreak((s) => ({ ...s, o: s.o + 1 }));
        try {
          confetti({ particleCount: 60, spread: 60 });
        } catch (e) {}
      } else {
        setTurn((t) => (t === 'X' ? 'O' : 'X'));
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setTurn('X');
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
              <Bot className="w-5 h-5 text-amber-500" />
              Café Tic-Tac-Toe
            </h3>
            <p className="text-xs text-stone-400">
              {mode === 'bot' ? 'You (X) vs Smart Barista Bot (O)' : 'Pass & Play: Player 1 (X) vs Player 2 (O)'}
            </p>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl border border-stone-700 transition"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-stone-950 p-1 rounded-xl mb-5 border border-stone-800">
        <button
          onClick={() => {
            setMode('bot');
            resetGame();
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            mode === 'bot' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5" /> Vs Barista AI
        </button>
        <button
          onClick={() => {
            setMode('pvp');
            resetGame();
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            mode === 'pvp' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> 2-Player Pass & Play
        </button>
      </div>

      {/* Score Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-stone-950/60 rounded-xl mb-4 border border-stone-800/80 text-xs">
        <span className="text-amber-400 font-bold">X Wins: {streak.x}</span>
        <span className="text-stone-400 font-medium">
          {mode === 'pvp' ? `Turn: Player ${turn}` : 'You are X'}
        </span>
        <span className="text-blue-400 font-bold">O Wins: {streak.o}</span>
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-3 aspect-square max-w-[280px] mx-auto mb-6">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            disabled={Boolean(cell || winner)}
            className={`aspect-square rounded-2xl flex items-center justify-center text-4xl font-black transition-all ${
              cell === 'X'
                ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-400 shadow-md'
                : cell === 'O'
                ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-400 shadow-md'
                : 'bg-stone-800 hover:bg-stone-750 border border-stone-700 hover:border-amber-500/40'
            }`}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Result Status */}
      {winner && (
        <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl text-center animate-fade-in">
          <p className="text-sm font-bold text-white mb-2">
            {winner === 'draw'
              ? '🤝 Round Ended in a Draw!'
              : winner === 'X'
              ? '🎉 Player X Won the Duel!'
              : '⚡ Player O Took the Victory!'}
          </p>
          <button
            onClick={resetGame}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition"
          >
            Play Next Round
          </button>
        </div>
      )}
    </div>
  );
};
