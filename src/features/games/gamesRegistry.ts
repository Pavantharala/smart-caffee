import { GameDefinition } from '../../types';
import { GameTab } from './types';

/**
 * ==============================================================================
 * 🎮 CAFE & RESTAURANT MODULAR GAMES REGISTRY
 * ==============================================================================
 *
 * HOW TO ADD A NEW GAME IN 3 EASY STEPS:
 * 1. Create your game component in `src/features/games/components/YourGame.tsx`.
 * 2. Add an entry to `DEFAULT_GAMES_REGISTRY` below.
 * 3. Add a case in `GamesLounge.tsx` rendering `<YourGame onBackToHub={() => setSelectedGameTab('hub')} />`.
 *
 * The game will automatically:
 * - Appear in the Café Games Lounge with its category, icon, rules, and rewards.
 * - Be togglable per-restaurant in the Admin Dashboard "Games Management" tab!
 *
 * HOW TO REMOVE A GAME:
 * - Delete the entry from `DEFAULT_GAMES_REGISTRY` below, or toggle `isEnabled: false`.
 * ==============================================================================
 */

export const DEFAULT_GAMES_REGISTRY: GameDefinition[] = [
  {
    id: 'spin-wheel',
    title: 'Spin & Win Fortune Wheel',
    category: 'single',
    icon: 'Gift',
    description: 'Spin the café wheel of fortune while your food is cooking to unlock dessert vouchers, discounts & surprises!',
    minPlayers: 1,
    maxPlayers: 1,
    difficulty: 'Quick',
    prepRewardDiscount: 'Free Brownie / ₹50 Voucher',
    tags: ['Luck', 'Instant Win', 'Daily Prize'],
    howToPlay: 'Tap the SPIN button and watch the wheel rotate. Claim whichever prize the needle lands on!',
    isEnabled: true,
  },
  {
    id: 'snake',
    title: 'Café Retro Snake',
    category: 'single',
    icon: 'Zap',
    description: 'Relive classic arcade fun! Steer the hungry snake across the board to gobble hot coffees and snacks without hitting walls.',
    minPlayers: 1,
    maxPlayers: 1,
    difficulty: 'Casual',
    prepRewardDiscount: 'Free Beverage Upgrade',
    tags: ['Arcade', 'Retro', 'Quick'],
    howToPlay: 'Use arrow keys or touch buttons to turn. Eat café items to grow. Avoid crashing into boundaries or your own tail.',
    isEnabled: true,
  },
  {
    id: 'memory-flip',
    title: 'Café Memory Match',
    category: 'single',
    icon: 'Brain',
    description: 'Flip and match pairs of gourmet coffees, burgers, and treats before the countdown runs out!',
    minPlayers: 1,
    maxPlayers: 1,
    difficulty: 'Casual',
    prepRewardDiscount: '10% Off Next Beverage',
    tags: ['Brainy', 'Fast', 'Rewarding'],
    howToPlay: 'Tap any card to flip it. Find the matching food item. Clear all pairs in fewer moves to score maximum points!',
    isEnabled: true,
  },
  {
    id: 'tictactoe-solo',
    title: 'Tic-Tac-Toe Vs Barista Bot',
    category: 'single',
    icon: 'Bot',
    description: 'Quick casual match of X vs O against our smart Barista AI bot right on your phone.',
    minPlayers: 1,
    maxPlayers: 1,
    difficulty: 'Quick',
    prepRewardDiscount: 'Winner Bragging Rights',
    tags: ['Classic', 'Casual', 'Fast'],
    howToPlay: 'Tap cells to place your mark (X). Try to achieve 3 in a row before the bot (O) blocks you.',
    isEnabled: true,
  },
  {
    id: 'cafe-quiz',
    title: 'Culinary & Spice Trivia',
    category: 'single',
    icon: 'HelpCircle',
    description: 'Test your foodie IQ! Answer rapid-fire questions about spices, brewing traditions, and famous street dishes.',
    minPlayers: 1,
    maxPlayers: 1,
    difficulty: 'Brainy',
    prepRewardDiscount: '₹50 Off Bill',
    tags: ['Trivia', 'Knowledge', 'Food Lovers'],
    howToPlay: 'Select the correct answer from 4 options before the 15-second timer per question ticks down.',
    isEnabled: true,
  },
  {
    id: 'reaction-test',
    title: 'Barista Reflex Rush',
    category: 'single',
    icon: 'Timer',
    description: 'Measure your reflex speed in milliseconds! Tap instantly when the espresso machine hits the golden extraction zone.',
    minPlayers: 1,
    maxPlayers: 1,
    difficulty: 'Quick',
    prepRewardDiscount: 'Free Extra Cheese / Shots',
    tags: ['Speed', 'Reflex', 'Exciting'],
    howToPlay: 'Wait for the screen to turn GREEN, then tap or click as fast as humanly possible to record your reflex time.',
    isEnabled: true,
  },
  {
    id: 'tictactoe-multi',
    title: 'Table Duel Tic-Tac-Toe',
    category: 'multiplayer',
    icon: 'Users',
    description: 'Challenge your dining buddy, family at the table, or a smart AI bot to the timeless grid clash with QR code room invitation.',
    minPlayers: 1,
    maxPlayers: 2,
    difficulty: 'Casual',
    prepRewardDiscount: 'Winner Bragging Rights',
    tags: ['2-Player', 'Classic', 'Pass & Play'],
    howToPlay: 'Take turns placing X and O. Get 3 in a row horizontally, vertically, or diagonally to win the round.',
    isEnabled: true,
  },
  {
    id: 'ludo',
    title: 'Ludo Express Sprint',
    category: 'multiplayer',
    icon: 'Dices',
    description: 'Roll the virtual dice, race your tokens around the board, and knock out your table friends!',
    minPlayers: 2,
    maxPlayers: 4,
    difficulty: 'Casual',
    prepRewardDiscount: 'Table Champion Badge',
    tags: ['Family Favorite', 'Board Game', 'Multiplayer'],
    howToPlay: 'Roll a 6 to enter the track, move according to dice roll, and race all tokens to the home center.',
    isEnabled: true,
  },
  {
    id: 'uno',
    title: 'Uno Card Clash Duel',
    category: 'multiplayer',
    icon: 'Layers',
    description: 'Match colors and numbers, unleash Skip and Draw-2 cards, and be the first to call UNO!',
    minPlayers: 2,
    maxPlayers: 4,
    difficulty: 'Casual',
    prepRewardDiscount: 'Card Master Title',
    tags: ['Card Game', 'Multiplayer', 'Fast-Paced'],
    howToPlay: 'Discard cards matching the top card color or number. Play action cards to slow down opponents.',
    isEnabled: true,
  },
];

/**
 * Helper to retrieve game definition by ID
 */
export const getGameById = (
  id: string,
  registry: GameDefinition[] = DEFAULT_GAMES_REGISTRY
): GameDefinition | undefined => {
  return registry.find((g) => g.id === id);
};

/**
 * Filter enabled games for a given restaurant
 */
export const getEnabledGamesForRestaurant = (
  enabledIds?: string[],
  registry: GameDefinition[] = DEFAULT_GAMES_REGISTRY
): GameDefinition[] => {
  if (!enabledIds || enabledIds.length === 0) {
    return registry.filter((g) => g.isEnabled);
  }
  return registry.filter((g) => enabledIds.includes(g.id) && g.isEnabled);
};
