import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, Zap, ArrowLeft, ArrowUp, ArrowDown, ArrowLeft as ArrowL, ArrowRight as ArrowR } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameComponentProps } from '../types';

export const SnakeGame: React.FC<GameComponentProps> = ({ onBackToHub }) => {
  const GRID_SIZE = 14;
  const [snake, setSnake] = useState<Array<{ x: number; y: number }>>([
    { x: 5, y: 7 },
    { x: 4, y: 7 },
  ]);
  const [food, setFood] = useState<{ x: number; y: number; type: string }>({
    x: 10,
    y: 7,
    type: '☕',
  });
  const [snakeDir, setSnakeDir] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeHighScore, setSnakeHighScore] = useState(0);
  const [snakeGameOver, setSnakeGameOver] = useState(false);
  const [snakeRunning, setSnakeRunning] = useState(false);
  const snakeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const spawnFood = () => {
    const foodIcons = ['☕', '🥪', '🍛', '🍰', '🥟', '🍔'];
    const rx = Math.floor(Math.random() * GRID_SIZE);
    const ry = Math.floor(Math.random() * GRID_SIZE);
    const ftype = foodIcons[Math.floor(Math.random() * foodIcons.length)];
    setFood({ x: rx, y: ry, type: ftype });
  };

  const startSnakeGame = () => {
    setSnake([
      { x: 5, y: 7 },
      { x: 4, y: 7 },
    ]);
    setSnakeDir('RIGHT');
    setSnakeScore(0);
    setSnakeGameOver(false);
    setSnakeRunning(true);
    spawnFood();
  };

  useEffect(() => {
    if (!snakeRunning || snakeGameOver) {
      if (snakeIntervalRef.current) clearInterval(snakeIntervalRef.current);
      return;
    }

    snakeIntervalRef.current = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        if (snakeDir === 'UP') head.y -= 1;
        if (snakeDir === 'DOWN') head.y += 1;
        if (snakeDir === 'LEFT') head.x -= 1;
        if (snakeDir === 'RIGHT') head.x += 1;

        // Collision with walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setSnakeGameOver(true);
          setSnakeRunning(false);
          return prev;
        }

        // Collision with self
        if (prev.some((seg) => seg.x === head.x && seg.y === head.y)) {
          setSnakeGameOver(true);
          setSnakeRunning(false);
          return prev;
        }

        const newSnake = [head, ...prev];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setSnakeScore((s) => {
            const next = s + 10;
            setSnakeHighScore((h) => Math.max(h, next));
            if (next >= 100) {
              try {
                confetti({ particleCount: 30, spread: 40 });
              } catch (e) {}
            }
            return next;
          });
          spawnFood();
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 180);

    return () => {
      if (snakeIntervalRef.current) clearInterval(snakeIntervalRef.current);
    };
  }, [snakeRunning, snakeGameOver, snakeDir, food]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && snakeDir !== 'DOWN') setSnakeDir('UP');
      if (e.key === 'ArrowDown' && snakeDir !== 'UP') setSnakeDir('DOWN');
      if (e.key === 'ArrowLeft' && snakeDir !== 'RIGHT') setSnakeDir('LEFT');
      if (e.key === 'ArrowRight' && snakeDir !== 'LEFT') setSnakeDir('RIGHT');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [snakeDir]);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-lg mx-auto shadow-2xl">
      <div className="flex items-center justify-between mb-4">
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
              <Zap className="w-5 h-5 text-amber-500" />
              Café Retro Snake
            </h3>
            <p className="text-xs text-stone-400">Collect coffees and bites to grow your snake</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700/60 text-center">
            <span className="text-[10px] text-stone-400 uppercase font-bold block">Score</span>
            <span className="text-amber-400 font-mono font-bold text-base">{snakeScore}</span>
          </div>
          <div className="bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700/60 text-center">
            <span className="text-[10px] text-stone-400 uppercase font-bold block flex items-center gap-1 justify-center">
              <Trophy className="w-2.5 h-2.5 text-amber-500" /> Best
            </span>
            <span className="text-emerald-400 font-mono font-bold text-base">{snakeHighScore}</span>
          </div>
        </div>
      </div>

      {/* Game Canvas Board */}
      <div className="relative aspect-square w-full max-w-[340px] mx-auto bg-stone-950 border-2 border-stone-800 rounded-2xl overflow-hidden p-1 shadow-inner">
        <div
          className="w-full h-full grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isHead = snake[0]?.x === x && snake[0]?.y === y;
            const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className="flex items-center justify-center border border-stone-900/40 relative"
              >
                {isHead && (
                  <div className="w-full h-full bg-amber-400 rounded-sm shadow-[0_0_8px_rgba(245,158,11,0.8)] z-10" />
                )}
                {isBody && <div className="w-4/5 h-4/5 bg-amber-600/80 rounded-sm" />}
                {isFood && <span className="text-xs select-none animate-bounce">{food.type}</span>}
              </div>
            );
          })}
        </div>

        {/* Start / Game Over Overlay */}
        {(!snakeRunning || snakeGameOver) && (
          <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
            {snakeGameOver ? (
              <>
                <span className="text-3xl mb-1">💥</span>
                <h4 className="text-lg font-black text-red-400">GAME OVER</h4>
                <p className="text-xs text-stone-300 mt-1 mb-4">
                  Final Score: <strong className="text-amber-400">{snakeScore} pts</strong>
                </p>
                <button
                  onClick={startSnakeGame}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-sm flex items-center gap-2 transition transform active:scale-95 shadow-lg shadow-amber-500/20"
                >
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
              </>
            ) : (
              <>
                <span className="text-3xl mb-1">🐍</span>
                <h4 className="text-lg font-black text-white">Classic Café Snake</h4>
                <p className="text-xs text-stone-400 mt-1 mb-4 max-w-xs">
                  Use arrow keys or directional buttons to navigate and collect goodies.
                </p>
                <button
                  onClick={startSnakeGame}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-sm flex items-center gap-2 transition transform active:scale-95 shadow-lg shadow-amber-500/20"
                >
                  <Play className="w-4 h-4 fill-stone-950" /> Start Game
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Touch Directional Controls */}
      <div className="mt-4 flex flex-col items-center gap-1 sm:hidden">
        <button
          onClick={() => snakeDir !== 'DOWN' && setSnakeDir('UP')}
          disabled={!snakeRunning}
          className="p-3 bg-stone-800 active:bg-amber-500 rounded-xl text-stone-200 border border-stone-700"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => snakeDir !== 'RIGHT' && setSnakeDir('LEFT')}
            disabled={!snakeRunning}
            className="p-3 bg-stone-800 active:bg-amber-500 rounded-xl text-stone-200 border border-stone-700"
          >
            <ArrowL className="w-5 h-5" />
          </button>
          <button
            onClick={() => snakeDir !== 'UP' && setSnakeDir('DOWN')}
            disabled={!snakeRunning}
            className="p-3 bg-stone-800 active:bg-amber-500 rounded-xl text-stone-200 border border-stone-700"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => snakeDir !== 'LEFT' && setSnakeDir('RIGHT')}
            disabled={!snakeRunning}
            className="p-3 bg-stone-800 active:bg-amber-500 rounded-xl text-stone-200 border border-stone-700"
          >
            <ArrowR className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
