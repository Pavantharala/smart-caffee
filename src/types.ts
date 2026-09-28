export type OrderType = 'dine_in' | 'parcel';

export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'ready' | 'served' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'online' | 'counter';

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export type TableQueueStatus = 'none' | 'queued' | 'assigned' | 'seated' | 'cancelled';

export interface Table {
  id: string;
  number: number;
  seats: number;
  status: TableStatus;
  currentOrderId?: string;
  qrToken: string; // Café Table QR (Identifies table seating)
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ProductCustomization {
  milkOptions?: string[];
  sweetnessLevels?: string[];
  temperatureOptions?: ('Hot' | 'Iced')[];
  spiceLevels?: ('Mild' | 'Medium' | 'Spicy')[];
  sizeOptions?: { name: string; extraPrice: number }[];
  addExtraCheese?: boolean;
  dipOptions?: string[];
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number; // in ₹ INR
  prepTimeMinutes: number;
  imageUrl: string;
  popular?: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
  chefSpecial?: boolean;
  tags?: string[];
  customization?: ProductCustomization;
  available: boolean;
}

export interface SelectedCustomization {
  milk?: string;
  sweetness?: string;
  temperature?: 'Hot' | 'Iced';
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
  size?: string;
  extraPrice: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customization?: SelectedCustomization;
  specialInstructions?: string;
  itemTotal: number;
}

export interface LuckyDrawWinner {
  id: string;
  campaignId: string;
  couponId: string;
  orderNumber: string;
  winnerName?: string; // Optional / masked for privacy (e.g., "Rahul" or "Order #ORD-1024")
  prizeTitle: string;
  prizeValue: string;
  drawTimestamp: string;
  validUntil: string;
  isRedeemed: boolean;
}

export interface LuckyDrawCampaign {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate: string;
  drawDate: string; // e.g. "Sunday 8:00 PM"
  prizeTitle: string; // e.g. "₹500 Café Voucher"
  prizeValue: string; // e.g. "₹500"
  prizeValidityDays: number; // e.g. 2 days
  maxWinners: number;
  isActive: boolean;
  winners: LuckyDrawWinner[];
}

export interface LuckyDrawCoupon {
  couponId: string; // e.g. CAF-20260920-X82K
  orderId: string;
  orderNumber: string;
  campaignId: string;
  campaignTitle: string;
  prizeTitle: string;
  prizeValue: string;
  validUntil: string;
  createdAt: string;
  isRevealed: boolean;
  isRedeemed: boolean;
  redeemedAt?: string;
}

export interface CustomerFeedback {
  orderId: string;
  orderNumber: string;
  customerName?: string;
  foodRating: number; // 1 to 5
  serviceRating: number; // 1 to 5
  waitingRating: number; // 1 to 5 (Crucial waiting experience metric)
  comments?: string;
  createdAt: string;
}

export interface TimelineEvent {
  status: OrderStatus | 'payment_confirmed';
  title: string;
  description: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ORD-1024
  customerSessionId: string;
  customerName?: string;
  customerPhone?: string;
  orderType: OrderType;
  tableNumber?: number;
  tableQueueStatus: TableQueueStatus;
  queuePosition?: number;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number; // in ₹ INR
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  confirmedAt?: string;
  estimatedPrepMinutes: number;
  kitchenNotes?: string;
  // 60-Minute Engagement Access Rule:
  engagementExpiresAt: number; // timestamp = confirmation time + engagementAccessDurationMinutes * 60 * 1000
  gameEligible: boolean;
  // Lucky Draw Coupon: ONLY generated if active campaign exists AND order is confirmed/paid
  luckyDrawCoupon?: LuckyDrawCoupon;
  feedback?: CustomerFeedback;
  timeline: TimelineEvent[];
  cancellationAllowed?: boolean;
}

export interface TableQueueEntry {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  partySize: number;
  joinedAt: string;
  status: TableQueueStatus;
  assignedTableNumber?: number;
  estimatedWaitMinutes: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'table' | 'game' | 'lucky_draw' | 'payment';
  timestamp: string;
  read: boolean;
  orderId?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
}

export interface GameMeta {
  id: string;
  title: string;
  category: 'single' | 'multiplayer';
  icon: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  isEnabled: boolean;
}

export interface MultiplayerPlayer {
  orderId: string;
  name: string;
  isHost: boolean;
  symbol?: 'X' | 'O';
  score?: number;
}

export interface MultiplayerRoom {
  id: string;
  code: string; // 4-digit room code
  gameType: 'tictactoe' | 'ludo' | 'uno' | 'quiz_battle';
  gameTitle: string;
  gameQrToken: string; // Distinct Game Invitation QR token!
  hostOrderId: string;
  hostName: string;
  players: MultiplayerPlayer[];
  isOpenToCafePlayers: boolean; // "Open to Café Players"
  lobbyExpiresAt: number; // 60-second lobby countdown
  status: 'waiting' | 'starting' | 'active' | 'finished';
  board?: (string | null)[]; // For tic-tac-toe
  turn?: string;
  winner?: string | null;
  createdAt: number;
}

export interface PromotionalBanner {
  id: string;
  title: string;
  description: string;
  badge: string;
  imageUrl?: string;
  campaignId?: string;
  winnerAnnouncement?: boolean;
  winnerInfo?: {
    couponCode: string;
    winnerName: string;
    prize: string;
    validUntil: string;
  };
  isActive: boolean;
}

export interface SystemSettings {
  gameAccessDurationMinutes: number; // default: 60
  multiplayerLobbyDurationSeconds: number; // default: 60
  allowRandomCafePlayers: boolean; // default: true
  allowDineInToParcel: boolean; // default: true
  luckyDrawEnabled: boolean; // default: true
  counterPaymentEnabled: boolean; // default: true
  cancellationPolicy: 'strict' | 'flexible'; // strict: before kitchen accepts; flexible: before preparing
  taxRatePercent: number; // default: 5% (standard Indian café GST)
}

export type RestaurantTheme = 'amber' | 'emerald' | 'rose' | 'indigo' | 'orange' | 'cyan';

export interface RestaurantProfile {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  badge?: string;
  logo: string;
  heroBanner: string;
  accentColor: RestaurantTheme;
  address: string;
  phone: string;
  gstNumber: string;
  openingHours: string;
  currencySymbol: string;
  taxRatePercent: number;
  rating: number;
  totalReviews: number;
  wifiDetails?: {
    ssid: string;
    password: string;
  };
  tableCount: number;
  tables: Table[];
  categories: ProductCategory[];
  products: Product[];
  enabledGameIds: string[];
}

export interface GameDefinition {
  id: string;
  title: string;
  category: 'single' | 'multiplayer';
  icon: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  difficulty: 'Casual' | 'Quick' | 'Medium' | 'Brainy';
  prepRewardDiscount?: string;
  tags: string[];
  howToPlay: string;
  isEnabled: boolean;
}

