export type GameTab =
  | 'hub'
  | 'spin-wheel'
  | 'snake'
  | 'tictactoe-solo'
  | 'memory'
  | 'quiz'
  | 'reaction'
  | 'ludo'
  | 'uno'
  | 'multiplayer-ttt';

export interface GameReward {
  title: string;
  perk: string;
  code: string;
  color?: string;
}

export interface GameComponentProps {
  onBackToHub?: () => void;
  onRewardWon?: (reward: GameReward) => void;
}

export interface UnoCard {
  id: string;
  color: 'red' | 'blue' | 'green' | 'yellow' | 'wild';
  value: string; // '0'-'9', 'skip', '+2', 'wild'
  symbol: string;
}
