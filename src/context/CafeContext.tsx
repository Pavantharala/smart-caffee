import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Order,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  Table,
  TableStatus,
  TableQueueEntry,
  Product,
  ProductCategory,
  CartItem,
  NotificationItem,
  LuckyDrawCampaign,
  LuckyDrawCoupon,
  LuckyDrawWinner,
  CustomerFeedback,
  PromotionalBanner,
  GameMeta,
  MultiplayerRoom,
  SystemSettings,
  TimelineEvent,
  RestaurantProfile,
  GameDefinition,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_TABLES,
  INITIAL_CAMPAIGNS,
  INITIAL_PROMOTIONAL_BANNERS,
  INITIAL_GAMES,
  INITIAL_SYSTEM_SETTINGS,
} from '../data/initialData';
import { INITIAL_RESTAURANTS, createDefaultTables } from '../data/restaurants';
import { DEFAULT_GAMES_REGISTRY } from '../data/gamesRegistry';

interface CafeContextType {
  // Multi-Restaurant Tenant Management
  restaurants: RestaurantProfile[];
  currentRestaurantId: string;
  currentRestaurant: RestaurantProfile;
  switchRestaurant: (restaurantId: string) => void;
  addRestaurant: (newRestaurant: Omit<RestaurantProfile, 'id'>) => void;
  updateCurrentRestaurant: (updates: Partial<RestaurantProfile>) => void;
  deleteRestaurant: (restaurantId: string) => void;
  importRestaurantData: (data: RestaurantProfile) => void;
  exportRestaurantData: () => string;

  // Extensible Games Registry
  gamesRegistry: GameDefinition[];
  toggleGameForRestaurant: (gameId: string) => void;
  addCustomGame: (game: GameDefinition) => void;

  // Navigation & Role
  viewRole: 'customer' | 'staff' | 'admin';
  setViewRole: (role: 'customer' | 'staff' | 'admin') => void;
  scannedTableNumber: number | null;
  setScannedTableNumber: (tableNumber: number | null) => void;

  // Catalog
  categories: ProductCategory[];
  products: Product[];
  addCategory: (category: Omit<ProductCategory, 'id'>) => void;
  updateCategory: (category: ProductCategory) => void;
  deleteCategory: (categoryId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleProductAvailability: (productId: string) => void;

  // Tables & Seating
  tables: Table[];
  tableQueue: TableQueueEntry[];
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  assignTableFromQueue: (queueEntryId: string, tableNumber: number) => void;
  leaveQueue: (queueEntryId: string) => void;

  // Cart
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  // Ordering & Lifecycle
  orders: Order[];
  activeOrderId: string | null;
  activeOrder: Order | undefined;
  setActiveOrderId: (id: string | null) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  createOrder: (params: {
    orderType: OrderType;
    tableNumber?: number;
    paymentMethod: PaymentMethod;
    customerName?: string;
    customerPhone?: string;
    kitchenNotes?: string;
  }) => Order;
  convertDineInToParcel: (orderId: string) => void;
  cancelOrder: (orderId: string, reason?: string) => { success: boolean; message: string };
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  confirmCounterPayment: (orderId: string) => void;
  submitFeedback: (feedback: {
    orderId: string;
    foodRating: number;
    serviceRating: number;
    waitingRating: number;
    comments?: string;
  }) => void;
  feedbacks: CustomerFeedback[];
  customerFeedbacks?: CustomerFeedback[];
  addPromotionalBanner?: (banner: Omit<PromotionalBanner, 'id'>) => void;

  // Lucky Draw Campaigns
  campaigns: LuckyDrawCampaign[];
  activeCampaign: LuckyDrawCampaign | undefined;
  createCampaign: (campaign: Omit<LuckyDrawCampaign, 'id' | 'winners'>) => void;
  updateCampaign: (campaign: LuckyDrawCampaign) => void;
  toggleCampaignStatus: (campaignId: string) => void;
  conductCampaignDraw: (campaignId: string) => { success: boolean; winners: LuckyDrawWinner[] };
  verifyAndRedeemPrize: (couponId: string) => { success: boolean; message: string };

  // Promotional Banners
  promotionalBanners: PromotionalBanner[];
  addBanner: (banner: Omit<PromotionalBanner, 'id'>) => void;
  updateBanner: (banner: PromotionalBanner) => void;
  toggleBannerStatus: (bannerId: string) => void;
  deleteBanner: (bannerId: string) => void;

  // Games & Lounge
  games: GameMeta[];
  toggleGameEnabled: (gameId: string) => void;
  multiplayerRooms: MultiplayerRoom[];
  createMultiplayerRoom: (
    hostOrderId: string,
    hostName: string,
    gameType?: 'tictactoe' | 'ludo' | 'uno',
    isOpenToCafe?: boolean
  ) => MultiplayerRoom;
  joinMultiplayerRoom: (code: string, guestOrderId: string, guestName: string) => MultiplayerRoom | null;
  joinGameRoom: (code: string, guestOrderId: string, guestName: string) => MultiplayerRoom | null;
  makeMove: (roomId: string, index: number, symbol: 'X' | 'O') => void;
  resetGameRoom: (roomId: string) => void;

  // System Settings (Admin Configurable)
  systemSettings: SystemSettings;
  updateSystemSettings: (newSettings: Partial<SystemSettings>) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (
    title: string,
    message: string,
    type: 'order' | 'table' | 'game' | 'lucky_draw' | 'payment',
    orderId?: string
  ) => void;

  // Demo state reset
  resetAllDemoData: () => void;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  RESTAURANTS: 'smart_cafe_restaurants_v3',
  CURRENT_RESTAURANT: 'smart_cafe_cur_rest_v3',
  GAMES_REGISTRY: 'smart_cafe_games_registry_v3',
  PRODUCTS: 'smart_cafe_products_v2',
  CATEGORIES: 'smart_cafe_categories_v2',
  TABLES: 'smart_cafe_tables_v2',
  ORDERS: 'smart_cafe_orders_v2',
  QUEUE: 'smart_cafe_queue_v2',
  NOTIFS: 'smart_cafe_notifs_v2',
  ACTIVE_ORDER: 'smart_cafe_active_order_v2',
  ROOMS: 'smart_cafe_rooms_v2',
  CAMPAIGNS: 'smart_cafe_campaigns_v2',
  SETTINGS: 'smart_cafe_settings_v2',
  BANNERS: 'smart_cafe_banners_v2',
  FEEDBACKS: 'smart_cafe_feedbacks_v2',
  GAMES: 'smart_cafe_games_v2',
};

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewRole, setViewRole] = useState<'customer' | 'staff' | 'admin'>('customer');
  const [scannedTableNumber, setScannedTableNumber] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string>('Patron');
  const [cart, setCart] = useState<CartItem[]>([]);

  // Multi-Restaurant Tenants
  const [restaurants, setRestaurants] = useState<RestaurantProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved restaurants', e);
      }
    }
    return INITIAL_RESTAURANTS;
  });

  const [currentRestaurantId, setCurrentRestaurantId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_RESTAURANT) || INITIAL_RESTAURANTS[0].id;
  });

  const currentRestaurant = useMemo(() => {
    return restaurants.find((r) => r.id === currentRestaurantId) || restaurants[0] || INITIAL_RESTAURANTS[0];
  }, [restaurants, currentRestaurantId]);

  // Extensible Games Registry
  const [gamesRegistry, setGamesRegistry] = useState<GameDefinition[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GAMES_REGISTRY);
    return saved ? JSON.parse(saved) : DEFAULT_GAMES_REGISTRY;
  });

  // Categories (defaults to current restaurant's categories)
  const [categories, setCategories] = useState<ProductCategory[]>(() => {
    return currentRestaurant.categories || INITIAL_CATEGORIES;
  });

  // Products (defaults to current restaurant's products)
  const [products, setProducts] = useState<Product[]>(() => {
    return currentRestaurant.products || INITIAL_PRODUCTS;
  });

  // Tables (defaults to current restaurant's tables)
  const [tables, setTables] = useState<Table[]>(() => {
    return currentRestaurant.tables || INITIAL_TABLES;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : [];
  });

  // Active Order ID
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ORDER) || null;
  });

  // Table Queue
  const [tableQueue, setTableQueue] = useState<TableQueueEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUEUE);
    return saved ? JSON.parse(saved) : [];
  });

  // Campaigns (Lucky Draw)
  const [campaigns, setCampaigns] = useState<LuckyDrawCampaign[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  // Promotional Banners
  const [promotionalBanners, setPromotionalBanners] = useState<PromotionalBanner[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BANNERS);
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONAL_BANNERS;
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_SETTINGS;
  });

  // Games
  const [games, setGames] = useState<GameMeta[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GAMES);
    return saved ? JSON.parse(saved) : INITIAL_GAMES;
  });

  // Feedbacks
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
    return saved ? JSON.parse(saved) : [];
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    return saved ? JSON.parse(saved) : [];
  });

  // Multiplayer Rooms
  const [multiplayerRooms, setMultiplayerRooms] = useState<MultiplayerRoom[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROOMS);
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(tableQueue));
  }, [tableQueue]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(promotionalBanners));
  }, [promotionalBanners]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ORDER, activeOrderId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ORDER);
    }
  }, [activeOrderId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(multiplayerRooms));
  }, [multiplayerRooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_RESTAURANT, currentRestaurantId);
  }, [currentRestaurantId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GAMES_REGISTRY, JSON.stringify(gamesRegistry));
  }, [gamesRegistry]);

  // Notifications Helper
  const addNotification = useCallback(
    (
      title: string,
      message: string,
      type: 'order' | 'table' | 'game' | 'lucky_draw' | 'payment',
      orderId?: string
    ) => {
      const newNotif: NotificationItem = {
        id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        title,
        message,
        type,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        orderId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );

  // Cart Management
  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) =>
          ci.product.id === item.product.id &&
          JSON.stringify(ci.customization) === JSON.stringify(item.customization)
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        const current = updated[existingIndex];
        const newQty = current.quantity + item.quantity;
        const unitPrice = current.product.price + (current.customization?.extraPrice || 0);
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          itemTotal: unitPrice * newQty,
        };
        return updated;
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  }, []);

  const updateCartQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const unitPrice = item.product.price + (item.customization?.extraPrice || 0);
          return {
            ...item,
            quantity,
            itemTotal: unitPrice * quantity,
          };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Active Order
  const activeOrder = orders.find((o) => o.id === activeOrderId);

  // Active Lucky Draw Campaign
  const activeCampaign = campaigns.find((c) => c.isActive);

  // Helper to generate a standardized Lucky Draw coupon ID
  const generateCouponId = (orderNumber: string): string => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CAF-${dateStr}-${orderNumber.replace('ORD-', '')}${rand}`;
  };

  // Helper to construct Lucky Draw Coupon object
  const buildLuckyDrawCoupon = (
    orderId: string,
    orderNumber: string,
    campaign: LuckyDrawCampaign
  ): LuckyDrawCoupon => {
    const couponId = generateCouponId(orderNumber);
    const validDate = new Date();
    validDate.setDate(validDate.getDate() + (campaign.prizeValidityDays || 2));
    const validUntil = validDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return {
      couponId,
      orderId,
      orderNumber,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      prizeTitle: campaign.prizeTitle,
      prizeValue: campaign.prizeValue,
      validUntil,
      createdAt: new Date().toISOString(),
      isRevealed: false,
      isRedeemed: false,
    };
  };

  // Create Order
  const createOrder = useCallback(
    ({
      orderType,
      tableNumber,
      paymentMethod,
      customerName: nameParam,
      customerPhone,
      kitchenNotes,
    }: {
      orderType: OrderType;
      tableNumber?: number;
      paymentMethod: PaymentMethod;
      customerName?: string;
      customerPhone?: string;
      kitchenNotes?: string;
    }): Order => {
      const randomOrderDigits = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `ORD-${randomOrderDigits}`;
      const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
      const taxRate = (systemSettings.taxRatePercent || 5) / 100;
      const tax = Math.round(subtotal * taxRate);
      const total = subtotal + tax;

      // Estimated prep time
      const maxItemPrep = cart.reduce((max, item) => Math.max(max, item.product.prepTimeMinutes), 4);
      const estimatedPrepMinutes = Math.min(25, 3 + maxItemPrep);

      // Seating / Queue state
      let assignedTable = tableNumber;
      let queueStatus: Order['tableQueueStatus'] = 'none';

      if (orderType === 'dine_in') {
        if (assignedTable) {
          const targetTable = tables.find((t) => t.number === assignedTable);
          if (targetTable && targetTable.status === 'available') {
            queueStatus = 'seated';
            setTables((prev) =>
              prev.map((t) =>
                t.number === assignedTable
                  ? { ...t, status: 'occupied', currentOrderId: orderNumber }
                  : t
              )
            );
          } else {
            queueStatus = 'queued';
            assignedTable = undefined;
          }
        } else {
          const freeTable = tables.find((t) => t.status === 'available');
          if (freeTable) {
            assignedTable = freeTable.number;
            queueStatus = 'seated';
            setTables((prev) =>
              prev.map((t) =>
                t.id === freeTable.id
                  ? { ...t, status: 'occupied', currentOrderId: orderNumber }
                  : t
              )
            );
          } else {
            queueStatus = 'queued';
          }
        }
      }

      const now = Date.now();
      const engagementDuration = (systemSettings.gameAccessDurationMinutes || 60) * 60 * 1000;
      const engagementExpiresAt = now + engagementDuration;

      const orderId = 'ord-' + Date.now();
      const initialTimeline: TimelineEvent[] = [
        {
          status: 'placed',
          title: 'Order Placed',
          description: `Order #${orderNumber} registered at Smart Café`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];

      // LUCKY DRAW RULE:
      // If paymentMethod is ONLINE, payment is instant -> If an active campaign exists, generate coupon!
      // If paymentMethod is COUNTER, payment is PENDING -> DO NOT generate coupon until staff confirms payment!
      let coupon: LuckyDrawCoupon | undefined = undefined;
      const isOnline = paymentMethod === 'online';

      if (isOnline && activeCampaign && systemSettings.luckyDrawEnabled) {
        coupon = buildLuckyDrawCoupon(orderId, orderNumber, activeCampaign);
        initialTimeline.push({
          status: 'payment_confirmed',
          title: 'Online Payment Confirmed',
          description: 'Payment processed digitally. Lucky Draw Coupon issued.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }

      const newOrder: Order = {
        id: orderId,
        orderNumber,
        customerSessionId: 'sess-' + Math.random().toString(36).substring(2, 9),
        customerName: nameParam || customerName || 'Patron',
        customerPhone,
        orderType,
        tableNumber: assignedTable,
        tableQueueStatus: queueStatus,
        items: [...cart],
        subtotal,
        tax,
        total,
        paymentMethod,
        paymentStatus: isOnline ? 'paid' : 'pending',
        orderStatus: 'placed',
        createdAt: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
        estimatedPrepMinutes,
        kitchenNotes,
        engagementExpiresAt,
        gameEligible: true,
        luckyDrawCoupon: coupon,
        timeline: initialTimeline,
        cancellationAllowed: true,
      };

      if (queueStatus === 'queued') {
        const newQueueEntry: TableQueueEntry = {
          id: 'q-' + Date.now(),
          orderId: newOrder.id,
          orderNumber: newOrder.orderNumber,
          customerName: newOrder.customerName || 'Patron',
          partySize: 2,
          joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'queued',
          estimatedWaitMinutes: (tableQueue.length + 1) * 7,
        };
        setTableQueue((prev) => [...prev, newQueueEntry]);
        newOrder.queuePosition = tableQueue.length + 1;
      }

      setOrders((prev) => [newOrder, ...prev]);
      setActiveOrderId(newOrder.id);
      setCart([]);

      // Customer notifications
      addNotification(
        `Order ${orderNumber} Confirmed!`,
        orderType === 'dine_in'
          ? assignedTable
            ? `Seated at Table #${assignedTable}. Parallel kitchen prep has begun!`
            : `Joined Table Queue #${tableQueue.length + 1}. Parallel kitchen prep is active!`
          : `Parcel takeaway placed. Estimated prep: ~${estimatedPrepMinutes} mins.`,
        'order',
        newOrder.id
      );

      if (coupon) {
        addNotification(
          '🎟️ Lucky Draw Coupon Issued!',
          `Official Coupon #${coupon.couponId} for "${activeCampaign.title}". Draw on ${activeCampaign.drawDate}!`,
          'lucky_draw',
          newOrder.id
        );
      } else if (paymentMethod === 'counter' && activeCampaign) {
        addNotification(
          'Payment Pending at Counter',
          `Pay ₹${total} at the counter. Your Lucky Draw coupon will be generated as soon as payment is confirmed!`,
          'payment',
          newOrder.id
        );
      }

      return newOrder;
    },
    [cart, customerName, tables, tableQueue.length, activeCampaign, systemSettings, addNotification]
  );

  // Convert Dine-in to Parcel
  const convertDineInToParcel = useCallback(
    (orderId: string) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            if (o.tableNumber) {
              setTables((prevT) =>
                prevT.map((t) =>
                  t.number === o.tableNumber
                    ? { ...t, status: 'cleaning', currentOrderId: undefined }
                    : t
                )
              );
            }
            setTableQueue((prevQ) => prevQ.filter((q) => q.orderId !== orderId));

            const updatedTimeline: TimelineEvent[] = [
              ...o.timeline,
              {
                status: 'ready',
                title: 'Switched to Parcel Takeaway',
                description: 'Customer elected to takeaway; kitchen continues preparation.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ];

            return {
              ...o,
              orderType: 'parcel',
              tableNumber: undefined,
              tableQueueStatus: 'none',
              queuePosition: undefined,
              timeline: updatedTimeline,
            };
          }
          return o;
        })
      );

      addNotification(
        'Converted to Parcel Takeaway',
        'Your order was switched to Parcel Takeaway. Food prep continues uninterrupted!',
        'order',
        orderId
      );
    },
    [addNotification]
  );

  // Cancel Order
  const cancelOrder = useCallback(
    (orderId: string, reason?: string) => {
      const target = orders.find((o) => o.id === orderId);
      if (!target) return { success: false, message: 'Order not found' };

      const policy = systemSettings.cancellationPolicy;
      const isCancellable =
        policy === 'strict'
          ? target.orderStatus === 'placed'
          : target.orderStatus === 'placed' || target.orderStatus === 'accepted';

      if (!isCancellable) {
        return {
          success: false,
          message: 'Cannot cancel: kitchen is already handcrafting your food.',
        };
      }

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            if (o.tableNumber) {
              setTables((prevT) =>
                prevT.map((t) =>
                  t.number === o.tableNumber
                    ? { ...t, status: 'available', currentOrderId: undefined }
                    : t
                )
              );
            }
            setTableQueue((prevQ) => prevQ.filter((q) => q.orderId !== orderId));

            const updatedTimeline: TimelineEvent[] = [
              ...o.timeline,
              {
                status: 'cancelled',
                title: 'Order Cancelled',
                description: reason || 'Cancelled by customer',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ];

            return {
              ...o,
              orderStatus: 'cancelled',
              cancellationAllowed: false,
              gameEligible: false,
              timeline: updatedTimeline,
            };
          }
          return o;
        })
      );

      addNotification(
        'Order Cancelled',
        `Order #${target.orderNumber} has been cancelled.`,
        'order',
        orderId
      );

      return { success: true, message: 'Order successfully cancelled.' };
    },
    [orders, systemSettings.cancellationPolicy, addNotification]
  );

  // Update order status (Kitchen Staff)
  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            let title = 'Order Update';
            let desc = `Status updated to ${status}`;
            if (status === 'accepted') {
              title = 'Kitchen Accepted Order';
              desc = 'Chef has accepted order into kitchen queue';
            } else if (status === 'preparing') {
              title = 'Cooking & Brewing';
              desc = 'Barista and kitchen team are actively preparing your items';
            } else if (status === 'ready') {
              title = 'Order Ready for Pickup/Serving';
              desc =
                o.orderType === 'dine_in' && o.tableNumber
                  ? `Dispatched to Table #${o.tableNumber}`
                  : 'Ready at pickup counter';
            } else if (status === 'served') {
              title = 'Order Completed & Served';
              desc = 'Customer served. Enjoy your culinary experience at Smart Café!';
            }

            const updatedTimeline: TimelineEvent[] = [
              ...o.timeline,
              {
                status,
                title,
                description: desc,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ];

            return {
              ...o,
              orderStatus: status,
              cancellationAllowed: status === 'placed',
              timeline: updatedTimeline,
            };
          }
          return o;
        })
      );

      const target = orders.find((o) => o.id === orderId);
      if (!target) return;

      if (status === 'accepted') {
        addNotification('Kitchen Accepted', `Chef accepted #${target.orderNumber}.`, 'order', orderId);
      } else if (status === 'preparing') {
        addNotification('Preparing Food', `Your dishes for #${target.orderNumber} are on the stove & espresso machine!`, 'order', orderId);
      } else if (status === 'ready') {
        addNotification('🔔 Food is Ready!', `#${target.orderNumber} is ready to enjoy!`, 'order', orderId);
      } else if (status === 'served') {
        addNotification('Served!', `#${target.orderNumber} served. Hope you love every bite!`, 'order', orderId);
      }
    },
    [orders, addNotification]
  );

  // Confirm Counter Payment (Staff Cashier action)
  // CRITICAL RULE: If payment is confirmed at counter AND an active Lucky Draw campaign exists,
  // GENERATE the Lucky Draw coupon now!
  const confirmCounterPayment = useCallback(
    (orderId: string) => {
      let generatedCoupon: LuckyDrawCoupon | undefined = undefined;

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            let couponToAttach = o.luckyDrawCoupon;

            if (!couponToAttach && activeCampaign && systemSettings.luckyDrawEnabled) {
              couponToAttach = buildLuckyDrawCoupon(o.id, o.orderNumber, activeCampaign);
              generatedCoupon = couponToAttach;
            }

            const updatedTimeline: TimelineEvent[] = [
              ...o.timeline,
              {
                status: 'payment_confirmed',
                title: 'Counter Payment Received',
                description: `Cashier confirmed payment of ₹${o.total}. ${
                  couponToAttach ? `Lucky Draw Coupon #${couponToAttach.couponId} generated.` : ''
                }`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ];

            return {
              ...o,
              paymentStatus: 'paid',
              luckyDrawCoupon: couponToAttach,
              timeline: updatedTimeline,
            };
          }
          return o;
        })
      );

      addNotification(
        'Payment Received at Counter',
        `Cashier confirmed receipt of payment for order.`,
        'payment',
        orderId
      );

      if (generatedCoupon) {
        addNotification(
          '🎟️ Lucky Draw Coupon Generated!',
          `Payment received! Coupon #${generatedCoupon.couponId} issued for "${activeCampaign?.title}".`,
          'lucky_draw',
          orderId
        );
      }
    },
    [activeCampaign, systemSettings.luckyDrawEnabled, addNotification]
  );

  // Submit Feedback
  const submitFeedback = useCallback(
    (feedback: {
      orderId: string;
      foodRating: number;
      serviceRating: number;
      waitingRating: number;
      comments?: string;
    }) => {
      const order = orders.find((o) => o.id === feedback.orderId);
      const newFeedback: CustomerFeedback = {
        orderId: feedback.orderId,
        orderNumber: order?.orderNumber || 'ORD-UNKNOWN',
        customerName: order?.customerName || customerName || 'Patron',
        foodRating: feedback.foodRating,
        serviceRating: feedback.serviceRating,
        waitingRating: feedback.waitingRating,
        comments: feedback.comments,
        createdAt: new Date().toISOString(),
      };

      setFeedbacks((prev) => [newFeedback, ...prev]);

      setOrders((prev) =>
        prev.map((o) => (o.id === feedback.orderId ? { ...o, feedback: newFeedback } : o))
      );

      addNotification(
        'Thank You for Your Feedback!',
        'Your ratings help us optimize our parallel kitchen & waiting experience.',
        'order',
        feedback.orderId
      );
    },
    [orders, customerName, addNotification]
  );

  // Assign Table from Queue
  const assignTableFromQueue = useCallback(
    (queueEntryId: string, tableNumber: number) => {
      const queueEntry = tableQueue.find((q) => q.id === queueEntryId);
      if (!queueEntry) return;

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === queueEntry.orderId) {
            return {
              ...o,
              tableNumber,
              tableQueueStatus: 'assigned',
              queuePosition: undefined,
            };
          }
          return o;
        })
      );

      setTables((prev) =>
        prev.map((t) =>
          t.number === tableNumber
            ? { ...t, status: 'occupied', currentOrderId: queueEntry.orderNumber }
            : t
        )
      );

      setTableQueue((prev) => prev.filter((q) => q.id !== queueEntryId));

      addNotification(
        '🎉 Table is Ready!',
        `Table #${tableNumber} is ready for you. Please proceed and take your seat.`,
        'table',
        queueEntry.orderId
      );
    },
    [tableQueue, addNotification]
  );

  const leaveQueue = useCallback((queueEntryId: string) => {
    setTableQueue((prev) => prev.filter((q) => q.id !== queueEntryId));
  }, []);

  const updateTableStatus = useCallback((tableId: string, status: TableStatus) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status, currentOrderId: status === 'available' ? undefined : t.currentOrderId } : t))
    );
  }, []);

  // Multi-Restaurant Management Handlers
  const switchRestaurant = useCallback(
    (restaurantId: string) => {
      const target = restaurants.find((r) => r.id === restaurantId);
      if (!target) return;
      setCurrentRestaurantId(restaurantId);
      localStorage.setItem(STORAGE_KEYS.CURRENT_RESTAURANT, restaurantId);
      setCategories(target.categories);
      setProducts(target.products);
      setTables(target.tables);
      setCart([]);
      setScannedTableNumber(null);
      addNotification(
        'Restaurant Switched',
        `Switched to "${target.name}" (${target.cuisine})`,
        'table'
      );
    },
    [restaurants, addNotification]
  );

  const addRestaurant = useCallback(
    (newRest: Omit<RestaurantProfile, 'id'>) => {
      const id = newRest.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
      const generatedTables =
        newRest.tables && newRest.tables.length > 0
          ? newRest.tables
          : createDefaultTables(newRest.tableCount || 10, id.substring(0, 3).toUpperCase());
      const fullRestaurant: RestaurantProfile = {
        ...newRest,
        id,
        tables: generatedTables,
        categories: newRest.categories && newRest.categories.length > 0 ? newRest.categories : INITIAL_CATEGORIES,
        products: newRest.products && newRest.products.length > 0 ? newRest.products : INITIAL_PRODUCTS,
        enabledGameIds:
          newRest.enabledGameIds || [
            'memory-flip',
            'spin-wheel',
            'cafe-quiz',
            'reaction-test',
            'tictactoe-multi',
          ],
      };
      setRestaurants((prev) => [...prev, fullRestaurant]);
      setCurrentRestaurantId(id);
      setCategories(fullRestaurant.categories);
      setProducts(fullRestaurant.products);
      setTables(fullRestaurant.tables);
      setCart([]);
      addNotification(
        'New Restaurant Live!',
        `Added "${fullRestaurant.name}" to multi-restaurant network.`,
        'table'
      );
    },
    [addNotification]
  );

  const updateCurrentRestaurant = useCallback(
    (updates: Partial<RestaurantProfile>) => {
      setRestaurants((prev) =>
        prev.map((r) => {
          if (r.id === currentRestaurantId) {
            return { ...r, ...updates };
          }
          return r;
        })
      );
      if (updates.categories) setCategories(updates.categories);
      if (updates.products) setProducts(updates.products);
      if (updates.tables) setTables(updates.tables);
      addNotification('Settings Saved', 'Restaurant profile and settings updated successfully.', 'table');
    },
    [currentRestaurantId, addNotification]
  );

  const deleteRestaurant = useCallback(
    (restaurantId: string) => {
      if (restaurants.length <= 1) {
        alert('Cannot remove the only restaurant in system!');
        return;
      }
      const remaining = restaurants.filter((r) => r.id !== restaurantId);
      setRestaurants(remaining);
      if (currentRestaurantId === restaurantId) {
        const nextRest = remaining[0];
        setCurrentRestaurantId(nextRest.id);
        setCategories(nextRest.categories);
        setProducts(nextRest.products);
        setTables(nextRest.tables);
      }
      addNotification('Restaurant Removed', 'The restaurant profile has been deleted.', 'table');
    },
    [restaurants, currentRestaurantId, addNotification]
  );

  const exportRestaurantData = useCallback(() => {
    return JSON.stringify(currentRestaurant, null, 2);
  }, [currentRestaurant]);

  const importRestaurantData = useCallback(
    (data: RestaurantProfile) => {
      if (!data.name) {
        throw new Error('Invalid restaurant configuration: Name is required.');
      }
      const id = data.id || 'imported-' + Date.now();
      const imported: RestaurantProfile = {
        ...data,
        id,
        tables: data.tables && data.tables.length > 0 ? data.tables : createDefaultTables(8, 'IMP'),
        categories: data.categories || INITIAL_CATEGORIES,
        products: data.products || INITIAL_PRODUCTS,
        enabledGameIds: data.enabledGameIds || ['memory-flip', 'spin-wheel', 'cafe-quiz'],
      };
      setRestaurants((prev) => {
        const idx = prev.findIndex((r) => r.id === id);
        if (idx > -1) {
          const copy = [...prev];
          copy[idx] = imported;
          return copy;
        }
        return [...prev, imported];
      });
      setCurrentRestaurantId(id);
      setCategories(imported.categories);
      setProducts(imported.products);
      setTables(imported.tables);
      addNotification('Restaurant Imported', `Successfully imported "${imported.name}"!`, 'table');
    },
    [addNotification]
  );

  // Extensible Games Management
  const toggleGameForRestaurant = useCallback(
    (gameId: string) => {
      setRestaurants((prev) =>
        prev.map((r) => {
          if (r.id === currentRestaurantId) {
            const currentEnabled = r.enabledGameIds || [];
            const exists = currentEnabled.includes(gameId);
            const nextEnabled = exists
              ? currentEnabled.filter((id) => id !== gameId)
              : [...currentEnabled, gameId];
            return { ...r, enabledGameIds: nextEnabled };
          }
          return r;
        })
      );
    },
    [currentRestaurantId]
  );

  const addCustomGame = useCallback(
    (game: GameDefinition) => {
      setGamesRegistry((prev) => [...prev, game]);
      addNotification('Game Registered', `Added "${game.title}" to games catalog!`, 'game');
    },
    [addNotification]
  );

  // Products & Categories CRUD (Sync with Current Restaurant)
  const addCategory = useCallback(
    (cat: Omit<ProductCategory, 'id'>) => {
      const id = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
      const newCat = { ...cat, id };
      setCategories((prev) => {
        const updated = [...prev, newCat];
        setRestaurants((restList) =>
          restList.map((r) => (r.id === currentRestaurantId ? { ...r, categories: updated } : r))
        );
        return updated;
      });
    },
    [currentRestaurantId]
  );

  const updateCategory = useCallback(
    (cat: ProductCategory) => {
      setCategories((prev) => {
        const updated = prev.map((c) => (c.id === cat.id ? cat : c));
        setRestaurants((restList) =>
          restList.map((r) => (r.id === currentRestaurantId ? { ...r, categories: updated } : r))
        );
        return updated;
      });
    },
    [currentRestaurantId]
  );

  const deleteCategory = useCallback(
    (categoryId: string) => {
      setCategories((prev) => {
        const updated = prev.filter((c) => c.id !== categoryId);
        setRestaurants((restList) =>
          restList.map((r) => (r.id === currentRestaurantId ? { ...r, categories: updated } : r))
        );
        return updated;
      });
    },
    [currentRestaurantId]
  );

  const addProduct = useCallback(
    (prod: Omit<Product, 'id'>) => {
      const id = 'prod-' + Date.now();
      const newProd: Product = { ...prod, id };
      setProducts((prev) => {
        const updated = [...prev, newProd];
        setRestaurants((restList) =>
          restList.map((r) => (r.id === currentRestaurantId ? { ...r, products: updated } : r))
        );
        return updated;
      });
    },
    [currentRestaurantId]
  );

  const updateProduct = useCallback(
    (prod: Product) => {
      setProducts((prev) => {
        const updated = prev.map((p) => (p.id === prod.id ? prod : p));
        setRestaurants((restList) =>
          restList.map((r) => (r.id === currentRestaurantId ? { ...r, products: updated } : r))
        );
        return updated;
      });
    },
    [currentRestaurantId]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => {
        const updated = prev.filter((p) => p.id !== productId);
        setRestaurants((restList) =>
          restList.map((r) => (r.id === currentRestaurantId ? { ...r, products: updated } : r))
        );
        return updated;
      });
    },
    [currentRestaurantId]
  );

  const toggleProductAvailability = useCallback(
    (productId: string) => {
      setProducts((prev) => {
        const updated = prev.map((p) => (p.id === productId ? { ...p, available: !p.available } : p));
        setRestaurants((restList) =>
          restList.map((r) => (r.id === currentRestaurantId ? { ...r, products: updated } : r))
        );
        return updated;
      });
    },
    [currentRestaurantId]
  );

  // Lucky Draw Campaign Management (Admin)
  const createCampaign = useCallback((camp: Omit<LuckyDrawCampaign, 'id' | 'winners'>) => {
    const id = 'camp-' + Date.now();
    const newCamp: LuckyDrawCampaign = {
      ...camp,
      id,
      winners: [],
    };
    setCampaigns((prev) => [newCamp, ...prev]);
  }, []);

  const updateCampaign = useCallback((camp: LuckyDrawCampaign) => {
    setCampaigns((prev) => prev.map((c) => (c.id === camp.id ? camp : c)));
  }, []);

  const toggleCampaignStatus = useCallback((campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, isActive: !c.isActive } : c))
    );
  }, []);

  // Admin triggers Draw for a campaign
  const conductCampaignDraw = useCallback(
    (campaignId: string): { success: boolean; winners: LuckyDrawWinner[] } => {
      const campaign = campaigns.find((c) => c.id === campaignId);
      if (!campaign) return { success: false, winners: [] };

      // Collect eligible coupons
      const eligibleCoupons: LuckyDrawCoupon[] = [];
      orders.forEach((o) => {
        if (o.luckyDrawCoupon && o.luckyDrawCoupon.campaignId === campaignId) {
          eligibleCoupons.push(o.luckyDrawCoupon);
        }
      });

      if (eligibleCoupons.length === 0) {
        // Create demo synthetic draw if no live order coupons yet
        const demoWinner: LuckyDrawWinner = {
          id: 'win-' + Date.now(),
          campaignId,
          couponId: `CAF-20260920-${Math.floor(1000 + Math.random() * 9000)}`,
          orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          winnerName: 'Arjun K.',
          prizeTitle: campaign.prizeTitle,
          prizeValue: campaign.prizeValue,
          drawTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          validUntil: `${campaign.prizeValidityDays} Days from Draw`,
          isRedeemed: false,
        };

        const updatedCampaign: LuckyDrawCampaign = {
          ...campaign,
          winners: [demoWinner, ...campaign.winners],
        };
        setCampaigns((prev) => prev.map((c) => (c.id === campaignId ? updatedCampaign : c)));

        // Update winner banner
        setPromotionalBanners((prev) => [
          {
            id: 'banner-win-' + Date.now(),
            title: `🎉 ${campaign.title} Winner Announced!`,
            description: `Winner: Arjun K. (Coupon: ${demoWinner.couponId}) won ${campaign.prizeTitle}!`,
            badge: 'Winner Announced',
            winnerAnnouncement: true,
            winnerInfo: {
              couponCode: demoWinner.couponId,
              winnerName: 'Arjun K.',
              prize: campaign.prizeTitle,
              validUntil: demoWinner.validUntil,
            },
            isActive: true,
          },
          ...prev,
        ]);

        return { success: true, winners: [demoWinner] };
      }

      // Pick up to maxWinners
      const countToPick = Math.min(campaign.maxWinners, eligibleCoupons.length);
      const shuffled = [...eligibleCoupons].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, countToPick);

      const newWinners: LuckyDrawWinner[] = picked.map((cup) => {
        const ord = orders.find((o) => o.id === cup.orderId);
        return {
          id: 'win-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
          campaignId,
          couponId: cup.couponId,
          orderNumber: cup.orderNumber,
          winnerName: ord?.customerName || 'Café Patron',
          prizeTitle: campaign.prizeTitle,
          prizeValue: campaign.prizeValue,
          drawTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          validUntil: cup.validUntil,
          isRedeemed: false,
        };
      });

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId ? { ...c, winners: [...newWinners, ...c.winners] } : c
        )
      );

      // Create winner promotional banner
      if (newWinners.length > 0) {
        const topWin = newWinners[0];
        setPromotionalBanners((prev) => [
          {
            id: 'banner-win-' + Date.now(),
            title: `🎉 ${campaign.title} Winner Announced!`,
            description: `Winner: ${topWin.winnerName} (Coupon: ${topWin.couponId}) won ${topWin.prizeTitle}!`,
            badge: 'Winner Announced',
            winnerAnnouncement: true,
            winnerInfo: {
              couponCode: topWin.couponId,
              winnerName: topWin.winnerName || 'Patron',
              prize: topWin.prizeTitle,
              validUntil: topWin.validUntil,
            },
            isActive: true,
          },
          ...prev,
        ]);
      }

      return { success: true, winners: newWinners };
    },
    [campaigns, orders]
  );

  // Redeem Prize (Staff action)
  const verifyAndRedeemPrize = useCallback((couponId: string): { success: boolean; message: string } => {
    const cleanId = couponId.trim().toUpperCase();
    let found = false;
    let message = 'Coupon ID not found.';

    setOrders((prev) =>
      prev.map((o) => {
        if (o.luckyDrawCoupon && o.luckyDrawCoupon.couponId.toUpperCase() === cleanId) {
          if (o.luckyDrawCoupon.isRedeemed) {
            message = 'This coupon has already been redeemed.';
            return o;
          }
          found = true;
          message = `Success! "${o.luckyDrawCoupon.prizeTitle}" redeemed for ${o.customerName || 'Customer'}.`;
          return {
            ...o,
            luckyDrawCoupon: {
              ...o.luckyDrawCoupon,
              isRedeemed: true,
              redeemedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          };
        }
        return o;
      })
    );

    return { success: found, message };
  }, []);

  // Promotional Banners Management
  const addBanner = useCallback((banner: Omit<PromotionalBanner, 'id'>) => {
    const id = 'banner-' + Date.now();
    setPromotionalBanners((prev) => [{ ...banner, id }, ...prev]);
  }, []);

  const updateBanner = useCallback((banner: PromotionalBanner) => {
    setPromotionalBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
  }, []);

  const toggleBannerStatus = useCallback((bannerId: string) => {
    setPromotionalBanners((prev) =>
      prev.map((b) => (b.id === bannerId ? { ...b, isActive: !b.isActive } : b))
    );
  }, []);

  const deleteBanner = useCallback((bannerId: string) => {
    setPromotionalBanners((prev) => prev.filter((b) => b.id !== bannerId));
  }, []);

  // Games management
  const toggleGameEnabled = useCallback((gameId: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, isEnabled: !g.isEnabled } : g))
    );
  }, []);

  // Multiplayer Game Management
  const createMultiplayerRoom = useCallback(
    (
      hostOrderId: string,
      hostName: string,
      gameType: 'tictactoe' | 'ludo' | 'uno' = 'tictactoe',
      isOpenToCafe: boolean = true
    ): MultiplayerRoom => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      const gameQrToken = `QR-GAME-ROOM-${code}`;
      const lobbyDuration = (systemSettings.multiplayerLobbyDurationSeconds || 60) * 1000;

      const newRoom: MultiplayerRoom = {
        id: 'room-' + Date.now(),
        code,
        gameType,
        gameTitle:
          gameType === 'tictactoe'
            ? 'Multiplayer Tic-Tac-Toe'
            : gameType === 'ludo'
            ? 'Ludo Express Sprint'
            : 'Uno / Card Clash Duel',
        gameQrToken,
        hostOrderId,
        hostName,
        players: [{ orderId: hostOrderId, name: hostName, isHost: true, symbol: 'X' }],
        isOpenToCafePlayers: isOpenToCafe,
        lobbyExpiresAt: Date.now() + lobbyDuration,
        status: 'waiting',
        board: Array(9).fill(null),
        turn: 'X',
        createdAt: Date.now(),
      };

      setMultiplayerRooms((prev) => [newRoom, ...prev]);
      return newRoom;
    },
    [systemSettings.multiplayerLobbyDurationSeconds]
  );

  const joinMultiplayerRoom = useCallback(
    (code: string, guestOrderId: string, guestName: string): MultiplayerRoom | null => {
      let matchedRoom: MultiplayerRoom | null = null;
      setMultiplayerRooms((prev) =>
        prev.map((r) => {
          if (r.code === code.trim() && r.status === 'waiting') {
            const alreadyIn = r.players.some((p) => p.orderId === guestOrderId);
            const updatedPlayers = alreadyIn
              ? r.players
              : [...r.players, { orderId: guestOrderId, name: guestName, isHost: false, symbol: 'O' }];
            const updated: MultiplayerRoom = {
              ...r,
              players: updatedPlayers,
              status: 'active',
            };
            matchedRoom = updated;
            return updated;
          }
          return r;
        })
      );
      return matchedRoom;
    },
    []
  );

  const checkWinner = (b: (string | null)[]): 'X' | 'O' | 'draw' | null => {
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
    if (b.every((cell) => cell !== null)) return 'draw';
    return null;
  };

  const makeMove = useCallback((roomId: string, index: number, symbol: 'X' | 'O') => {
    setMultiplayerRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId && r.status === 'active' && r.board && r.board[index] === null) {
          const newBoard = [...r.board];
          newBoard[index] = symbol;
          const winner = checkWinner(newBoard);
          return {
            ...r,
            board: newBoard,
            turn: symbol === 'X' ? 'O' : 'X',
            winner,
            status: winner ? 'finished' : 'active',
          };
        }
        return r;
      })
    );
  }, []);

  const resetGameRoom = useCallback((roomId: string) => {
    setMultiplayerRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          return {
            ...r,
            board: Array(9).fill(null),
            turn: 'X',
            winner: null,
            status: 'active',
          };
        }
        return r;
      })
    );
  }, []);

  // System Settings Update (Admin)
  const updateSystemSettings = useCallback((newSettings: Partial<SystemSettings>) => {
    setSystemSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Notifications Operations
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Reset Demo Data
  const resetAllDemoData = useCallback(() => {
    localStorage.clear();
    setCategories(INITIAL_CATEGORIES);
    setProducts(INITIAL_PRODUCTS);
    setTables(INITIAL_TABLES);
    setOrders([]);
    setTableQueue([]);
    setCampaigns(INITIAL_CAMPAIGNS);
    setPromotionalBanners(INITIAL_PROMOTIONAL_BANNERS);
    setSystemSettings(INITIAL_SYSTEM_SETTINGS);
    setGames(INITIAL_GAMES);
    setFeedbacks([]);
    setNotifications([]);
    setCart([]);
    setActiveOrderId(null);
    setMultiplayerRooms([]);
  }, []);

  return (
    <CafeContext.Provider
      value={{
        restaurants,
        currentRestaurantId,
        currentRestaurant,
        switchRestaurant,
        addRestaurant,
        updateCurrentRestaurant,
        deleteRestaurant,
        importRestaurantData,
        exportRestaurantData,
        gamesRegistry,
        toggleGameForRestaurant,
        addCustomGame,
        viewRole,
        setViewRole,
        scannedTableNumber,
        setScannedTableNumber,
        categories,
        products,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        tables,
        tableQueue,
        updateTableStatus,
        assignTableFromQueue,
        leaveQueue,
        cart,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        orders,
        activeOrderId,
        activeOrder,
        setActiveOrderId,
        customerName,
        setCustomerName,
        createOrder,
        convertDineInToParcel,
        cancelOrder,
        updateOrderStatus,
        confirmCounterPayment,
        submitFeedback,
        feedbacks,
        customerFeedbacks: feedbacks,
        campaigns,
        activeCampaign,
        createCampaign,
        updateCampaign,
        toggleCampaignStatus,
        conductCampaignDraw,
        verifyAndRedeemPrize,
        promotionalBanners,
        addBanner,
        addPromotionalBanner: addBanner,
        updateBanner,
        toggleBannerStatus,
        deleteBanner,
        games,
        toggleGameEnabled,
        multiplayerRooms,
        createMultiplayerRoom,
        joinMultiplayerRoom,
        joinGameRoom: joinMultiplayerRoom,
        makeMove,
        resetGameRoom,
        systemSettings,
        updateSystemSettings,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        clearAllNotifications,
        addNotification,
        resetAllDemoData,
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
};
