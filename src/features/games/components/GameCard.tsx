import React from 'react';
import {
  Gamepad2,
  Gift,
  Brain,
  Zap,
  HelpCircle,
  Timer,
  Users,
  Sparkles,
  Dices,
  Layers,
  ChevronRight,
  Trophy,
} from 'lucide-react';
import { GameDefinition } from '../../../types';
import { GameTab } from '../types';

interface GameCardProps {
  game: GameDefinition;
  onSelect: (tab: GameTab) => void;
  activeOrderNumber?: string;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onSelect, activeOrderNumber }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gift':
        return <Gift className="w-5 h-5 text-amber-400" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-indigo-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5 text-rose-400" />;
      case 'Timer':
        return <Timer className="w-5 h-5 text-cyan-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-purple-400" />;
      case 'Dices':
        return <Dices className="w-5 h-5 text-orange-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-blue-400" />;
      default:
        return <Gamepad2 className="w-5 h-5 text-amber-400" />;
    }
  };

  // Map game definition id to game tab
  const mapGameTab = (id: string): GameTab => {
    switch (id) {
      case 'spin-wheel':
        return 'spin-wheel';
      case 'snake':
        return 'snake';
      case 'memory-flip':
        return 'memory';
      case 'cafe-quiz':
        return 'quiz';
      case 'reaction-test':
        return 'reaction';
      case 'ludo':
        return 'ludo';
      case 'uno':
        return 'uno';
      case 'tictactoe-multi':
        return 'multiplayer-ttt';
      case 'tictactoe-solo':
        return 'tictactoe-solo';
      default:
        return 'tictactoe-solo';
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="p-2.5 bg-stone-950 rounded-2xl border border-stone-800/80 group-hover:scale-110 transition-transform">
            {getIcon(game.icon)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-[10px] font-semibold text-stone-300 uppercase tracking-wider">
              {game.category === 'multiplayer' ? '2+ Players' : 'Solo'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
              {game.difficulty}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
          {game.title}
        </h4>
        <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
          {game.description}
        </p>

        {/* Reward Discount Tag if present */}
        {game.prepRewardDiscount && (
          <div className="mt-3 py-1.5 px-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-1.5 text-[11px] text-amber-300 font-medium">
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Prize: {game.prepRewardDiscount}</span>
          </div>
        )}
      </div>

      {/* Action Play Button */}
      <div className="mt-5 pt-3 border-t border-stone-800/60 flex items-center justify-between">
        <span className="text-[11px] text-stone-400">
          {game.category === 'multiplayer' ? 'Table Duel / QR' : 'Instant Play'}
        </span>
        <button
          onClick={() => onSelect(mapGameTab(game.id))}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition transform active:scale-95 shadow-md shadow-amber-500/20"
        >
          <span>Play Now</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
