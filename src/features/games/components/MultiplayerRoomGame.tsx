import React, { useState, useEffect } from 'react';
import { Users, RotateCcw, ArrowLeft, QrCode, Sparkles, CheckCircle, Bot, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameComponentProps } from '../types';
import { useCafe } from '../../../context/CafeContext';
import { GameRoomQrCode } from './GameRoomQrCode';

export const MultiplayerRoomGame: React.FC<GameComponentProps> = ({ onBackToHub }) => {
  const {
    activeOrder,
    customerName,
    multiplayerRooms,
    createMultiplayerRoom,
    joinGameRoom,
    makeMove,
    resetGameRoom,
  } = useCafe();

  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [lobbySecondsLeft, setLobbySecondsLeft] = useState<number>(60);
  const [openToCafeToggled, setOpenToCafeToggled] = useState(true);

  const activeMultiplayerRoom = multiplayerRooms.find((r) => r.id === currentRoomId);

  // 1-minute lobby countdown timer
  useEffect(() => {
    if (!activeMultiplayerRoom || activeMultiplayerRoom.status !== 'waiting') return;

    const interval = setInterval(() => {
      const nowMs = Date.now();
      const diffSec = Math.max(0, Math.ceil((activeMultiplayerRoom.lobbyExpiresAt - nowMs) / 1000));
      setLobbySecondsLeft(diffSec);

      // Auto-simulate partner joining if open to café players and time expires
      if (diffSec <= 0 && activeMultiplayerRoom.players.length === 1) {
        joinGameRoom(activeMultiplayerRoom.code, 'patron-sim-queue', 'Patron @ Table #4');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeMultiplayerRoom, joinGameRoom]);

  const handleCreateRoom = (type: 'tictactoe' | 'ludo' | 'uno' = 'tictactoe') => {
    const orderId = activeOrder?.id || 'demo-order-' + Date.now();
    const name = customerName || 'Player 1';
    const room = createMultiplayerRoom(orderId, name, type, openToCafeToggled);
    setCurrentRoomId(room.id);
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    const orderId = activeOrder?.id || 'demo-order-p2';
    const name = customerName ? `${customerName} (P2)` : 'Guest @ Table';
    const room = joinGameRoom(joinCodeInput.trim().toUpperCase(), orderId, name);
    if (room) {
      setCurrentRoomId(room.id);
      setJoinCodeInput('');
    } else {
      alert('Room not found or already full. Please check the 4-digit code.');
    }
  };

  const handleCellClick = (index: number) => {
    if (!activeMultiplayerRoom || activeMultiplayerRoom.status !== 'active') return;
    const board = activeMultiplayerRoom.board || Array(9).fill(null);
    if (board[index]) return;

    const isHost = activeMultiplayerRoom.players[0]?.orderId === activeOrder?.id;
    const mySymbol = isHost ? 'X' : 'O';

    if (activeMultiplayerRoom.turn !== mySymbol) return;

    makeMove(activeMultiplayerRoom.id, index, mySymbol);

    // If opponent is simulated, trigger bot response
    const opponent = activeMultiplayerRoom.players[1];
    if (opponent && opponent.orderId.includes('sim')) {
      setTimeout(() => {
        const nextBoard = [...board];
        nextBoard[index] = mySymbol;
        const emptyIndices = nextBoard
          .map((v, i) => (v === null ? i : null))
          .filter((v): v is number => v !== null);
        if (emptyIndices.length > 0) {
          const botChoice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          makeMove(activeMultiplayerRoom.id, botChoice, isHost ? 'O' : 'X');
        }
      }, 900);
    }
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
              <Users className="w-5 h-5 text-amber-500" />
              Table Duel Room
            </h3>
            <p className="text-xs text-stone-400">Play with friends via Table QR or join an open room</p>
          </div>
        </div>

        {activeMultiplayerRoom && (
          <button
            onClick={() => setCurrentRoomId(null)}
            className="text-xs text-stone-400 hover:text-stone-200 underline"
          >
            Leave Room
          </button>
        )}
      </div>

      {!activeMultiplayerRoom ? (
        <div className="space-y-6">
          {/* Create Room Box */}
          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 text-center">
            <h4 className="text-base font-bold text-white mb-1">Create a New Table Game</h4>
            <p className="text-xs text-stone-400 mb-4 max-w-sm mx-auto">
              Get an instant 4-digit code & QR code to invite friends sitting with you or nearby tables.
            </p>

            <div className="flex items-center justify-center gap-2 mb-4">
              <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={openToCafeToggled}
                  onChange={(e) => setOpenToCafeToggled(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4 bg-stone-800 border-stone-700"
                />
                Allow other café tables to join if empty after 60s
              </label>
            </div>

            <button
              onClick={() => handleCreateRoom('tictactoe')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-sm shadow-md transition"
            >
              Host Tic-Tac-Toe Room
            </button>
          </div>

          {/* Join Existing Room Box */}
          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800">
            <h4 className="text-base font-bold text-white mb-1">Have a Room Code?</h4>
            <p className="text-xs text-stone-400 mb-4">
              Enter the 4-digit code shown on your friend's screen.
            </p>

            <form onSubmit={handleJoinByCode} className="flex gap-2">
              <input
                type="text"
                maxLength={4}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="4-DIGIT CODE"
                className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-center font-mono text-base font-bold text-amber-400 uppercase tracking-widest focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!joinCodeInput.trim()}
                className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      ) : activeMultiplayerRoom.status === 'waiting' ? (
        /* Waiting in Lobby */
        <div className="text-center">
          <GameRoomQrCode
            code={activeMultiplayerRoom.code}
            gameTitle={activeMultiplayerRoom.gameTitle}
            onSimulateFriendJoin={() =>
              joinGameRoom(activeMultiplayerRoom.code, 'patron-sim-qr', 'Friend @ Table')
            }
          />

          <div className="mt-4 p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300">
            <span className="font-bold text-amber-400 block mb-0.5">
              Lobby auto-match countdown: {lobbySecondsLeft}s
            </span>
            Waiting for a table buddy to scan or enter code...
          </div>
        </div>
      ) : (
        /* Active Multiplayer Match */
        <div className="space-y-4">
          {/* Players Bar */}
          <div className="grid grid-cols-2 gap-3">
            {activeMultiplayerRoom.players.map((p, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center ${
                  activeMultiplayerRoom.turn === p.symbol
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400'
                }`}
              >
                <span className="text-[10px] uppercase font-bold block">
                  {p.symbol === 'X' ? 'Player 1 (X)' : 'Player 2 (O)'}
                </span>
                <span className="text-xs font-bold text-white truncate block">{p.name}</span>
              </div>
            ))}
          </div>

          {/* Turn Indicator */}
          <div className="text-center text-xs font-medium text-stone-400">
            {activeMultiplayerRoom.winner ? (
              <span className="text-amber-400 font-bold">
                {activeMultiplayerRoom.winner === 'draw'
                  ? 'Game ended in a draw!'
                  : `Winner: ${activeMultiplayerRoom.winner}!`}
              </span>
            ) : (
              <span>
                Current Turn:{' '}
                <strong className="text-amber-400">{activeMultiplayerRoom.turn}</strong>
              </span>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-3 aspect-square max-w-[280px] mx-auto">
            {(activeMultiplayerRoom.board || Array(9).fill(null)).map((cell, idx) => (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={Boolean(cell || activeMultiplayerRoom.winner)}
                className={`aspect-square rounded-2xl flex items-center justify-center text-4xl font-black transition-all ${
                  cell === 'X'
                    ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-400 shadow-md'
                    : cell === 'O'
                    ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-400 shadow-md'
                    : 'bg-stone-950 hover:bg-stone-850 border border-stone-800'
                }`}
              >
                {cell}
              </button>
            ))}
          </div>

          {activeMultiplayerRoom.winner && (
            <div className="text-center pt-2">
              <button
                onClick={() => resetGameRoom(activeMultiplayerRoom.id)}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition"
              >
                Play Rematch
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
