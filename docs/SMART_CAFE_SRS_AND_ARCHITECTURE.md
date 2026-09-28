# ☕ Smart Café — Software Requirements Specification (SRS) & Complete Technical Architecture

---

## 1. Executive Summary & Core Paradigm

**Smart Café** is an omnichannel digital café ordering and customer-engagement platform. Customers access the café via a physical **Table Seating QR stand** or direct website URL, place food orders, choose online payment or counter cashier settlement, wait for food and seating while playing curated single-player and multiplayer lounge games, and participate in admin-created promotional **Lucky Draw campaigns**.

### Key Differentiators & Corrected Rules
1. **Parallel Wait Optimization**: Food cooking begins immediately upon order placement, running in parallel with table queue wait times.
2. **Admin-Created Lucky Draw**: The customer does **not** receive a coupon automatically for every order. Lucky Draw is an admin-created campaign with defined frequency, prize values, and draw dates. Coupons are only issued when an eligible campaign is active.
3. **Payment-Dependent Coupon Issuance**:
   - **Online Payment**: Coupon generated immediately upon order confirmation.
   - **Pay at Counter**: Coupon generated only **after** the staff/cashier confirms receipt of payment.
4. **Strict 60-Minute Engagement Window**: Lounge games and entertainment access are bounded to **60 minutes** calculated from the order confirmation timestamp.
5. **QR Code Separation of Concerns**:
   - **Table QR Stand**: Identifies where the customer is seated (or starts queue allocation).
   - **Game Invitation QR**: Identifies a specific multiplayer game room to join.

---

## 2. Software Requirements Specification (SRS)

### 2.1 Functional Requirements (FR)

| Req ID | Module | Description |
| :--- | :--- | :--- |
| **FR-01** | **Customer Access** | The system shall support customer onboarding via physical Table QR stand (auto-associating table ID) and direct website URL (with fallback table selection or queue entry). |
| **FR-02** | **Indian Café Menu** | The catalog shall support Indian café categories (Beverages, Street Snacks, Main Course, Desserts) with dietary tags (Pure Veg, Bestseller), INR pricing (₹), and customizations (spice levels, milk substitutes, sizes). |
| **FR-03** | **Order Lifecycle** | The system shall orchestrate order status progression: `placed` → `accepted` → `preparing` → `ready` → `served` (or `cancelled`). |
| **FR-04** | **Parallel Kitchen Prep** | Orders with queued table seating shall route directly to the kitchen display immediately, decoupling kitchen cooking from physical seat readiness. |
| **FR-05** | **Counter Cashier** | The staff terminal shall support "Pay at Counter" orders, allowing cashiers to verify payment and trigger delayed Lucky Draw coupon generation. |
| **FR-06** | **Lucky Draw Campaigns** | The admin shall create, edit, pause, and conduct draws for promotional campaigns. Draws select verified coupon IDs and auto-publish marquee banners. |
| **FR-07** | **60-Minute Access Rule** | Customers shall be granted access to the Games Lounge for exactly 60 minutes from order confirmation. Post-expiry access shall be restricted. |
| **FR-08** | **Multiplayer Lounge** | The lounge shall support multiplayer games (Ludo Sprint, Uno Duel, Tic-Tac-Toe) with a 60-second lobby timeout, open café matching, and unique Game Invitation QRs. |
| **FR-09** | **Waiting Analytics** | The admin dashboard shall track Waiting Experience Ratings (1-5 stars), prep times, table wait times, and product sales share ratios. |
| **FR-10** | **System Configuration** | System parameters (tax rates, game access duration, lobby timeouts, cancellation rules) shall be dynamic and configurable via Admin Settings. |

### 2.2 Non-Functional Requirements (NFR)
- **NFR-01 (Performance)**: UI interactions and order state transitions must render in <100ms.
- **NFR-02 (Offline/Transient Resilience)**: State is synchronized to versioned local storage (`_v2`) to prevent data loss on browser refresh.
- **NFR-03 (Security)**: Admin and Staff operations are partitioned by role; customer views are sandboxed to their active order token.
- **NFR-04 (Accessibility)**: Dark mode theme with high-contrast amber/emerald/purple accents, WCAG AA compliant typography and touch targets (≥44px).

---

## 3. Entity-Relationship (ER) Diagram

```text
+-----------------------+          +-----------------------+
|  LuckyDrawCampaign    | 1      * |   LuckyDrawCoupon     |
+-----------------------+----------+-----------------------+
| PK id                 |          | PK id                 |
|    title              |          | FK campaignId         |
|    frequency          |          | FK orderId            |
|    prizeTitle         |          |    couponId (CODE)    |
|    prizeValue         |          |    customerName       |
|    drawDate           |          |    validUntil         |
|    isActive           |          |    isRevealed         |
|    maxWinners         |          |    isWinner           |
+-----------------------+          +-----------------------+
            | 1                                | *
            |                                  |
            |                                  | 1
+-----------------------+ 1      * +-----------------------+
|       Customer        |----------|         Order         |
+-----------------------+          +-----------------------+
| PK id                 |          | PK id                 |
|    name               |          |    orderNumber        |
|    phone              |          |    orderType          |
|    createdAt          |          | FK tableId (optional) |
+-----------------------+          |    paymentMethod      |
            | 1                    |    paymentStatus      |
            |                      |    orderStatus        |
            |                      |    subtotal, tax, tot |
            | *                    |    prepTimeMinutes    |
+-----------------------+          |    engagementExpiresAt|
|   CustomerFeedback    |          |    luckyDrawCouponId  |
+-----------------------+          +-----------------------+
| PK id                 |                      | 1
| FK orderId            |                      |
|    foodRating (1-5)   |                      | *
|    serviceRating(1-5) |          +-----------------------+
|    waitingRating(1-5) |          |       OrderItem       |
|    comments           |          +-----------------------+
+-----------------------+          | PK id                 |
                                   | FK orderId            |
                                   | FK productId          |
                                   |    quantity           |
                                   |    selectedCustoms    |
                                   |    itemTotal (INR)    |
                                   +-----------------------+
                                               | *
                                               | 1
                                   +-----------------------+
                                   |        Product        |
                                   +-----------------------+
                                   | PK id                 |
                                   | FK categoryId         |
                                   |    name               |
                                   |    price (INR)        |
                                   |    prepTimeMinutes    |
                                   |    vegetarian         |
                                   |    available          |
                                   +-----------------------+
```

---

## 4. Complete Database Schema (PostgreSQL / Relational / Firestore Mapping)

### 4.1 `categories`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Category identifier (e.g. `beverages`) |
| `name` | `VARCHAR(128)` | `NOT NULL` | Category name |
| `icon` | `VARCHAR(64)` | `NOT NULL` | Lucide icon identifier |
| `order_index` | `INT` | `DEFAULT 0` | Display ordering sequence |

### 4.2 `products`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Product unique identifier |
| `category_id`| `VARCHAR(64)` | `REFERENCES categories(id)`| Foreign key |
| `name` | `VARCHAR(255)` | `NOT NULL` | Indian dish name |
| `description`| `TEXT` | `NOT NULL` | Ingredients and culinary note |
| `price` | `NUMERIC(10,2)`| `NOT NULL` | Price in INR (₹) |
| `prep_time_minutes`| `INT` | `NOT NULL DEFAULT 5` | Estimated kitchen prep time |
| `image_url` | `TEXT` | `NOT NULL` | Unsplash CDN asset URL |
| `available` | `BOOLEAN` | `DEFAULT TRUE` | Stock status (86 flag) |
| `vegetarian` | `BOOLEAN` | `DEFAULT TRUE` | Veg vs Non-Veg badge |
| `popular` | `BOOLEAN` | `DEFAULT FALSE` | Bestseller tag |
| `customization_json`| `JSONB` | `NULLABLE` | Spices, milk, size add-ons |

### 4.3 `tables`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Table UUID |
| `number` | `INT` | `UNIQUE NOT NULL` | Table number (1-8) |
| `seats` | `INT` | `NOT NULL DEFAULT 4` | Seating capacity |
| `status` | `VARCHAR(32)` | `NOT NULL` | `available`, `occupied`, `cleaning`, `reserved` |
| `qr_code_token`| `VARCHAR(128)`| `NOT NULL` | QR token for seating stands |

### 4.4 `orders`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Order UUID |
| `order_number`| `VARCHAR(32)` | `UNIQUE NOT NULL` | Human-readable token (e.g. `ORD-84920`) |
| `order_type` | `VARCHAR(32)` | `NOT NULL` | `dine_in` or `parcel` |
| `table_number`| `INT` | `NULLABLE` | Assigned table number |
| `table_queue_status`| `VARCHAR(32)`| `NOT NULL` | `none`, `queued`, `assigned` |
| `queue_position`| `INT` | `NULLABLE` | Current queue index |
| `payment_method`| `VARCHAR(32)`| `NOT NULL` | `online` or `counter` |
| `payment_status`| `VARCHAR(32)`| `NOT NULL` | `paid` or `pending` |
| `order_status`| `VARCHAR(32)` | `NOT NULL` | `placed`, `accepted`, `preparing`, `ready`, `served`, `cancelled` |
| `subtotal` | `NUMERIC(10,2)`| `NOT NULL` | Subtotal in ₹ |
| `tax` | `NUMERIC(10,2)`| `NOT NULL` | GST tax in ₹ |
| `total` | `NUMERIC(10,2)`| `NOT NULL` | Final total in ₹ |
| `created_at` | `BIGINT` | `NOT NULL` | Epoch timestamp |
| `engagement_expires_at`| `BIGINT`| `NOT NULL` | Exactly `created_at + 60 mins` |
| `game_eligible`| `BOOLEAN` | `DEFAULT TRUE` | Unlocks Games Lounge |

### 4.5 `lucky_draw_campaigns`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Campaign UUID |
| `title` | `VARCHAR(255)` | `NOT NULL` | Campaign name |
| `description`| `TEXT` | `NOT NULL` | Rules & prize summary |
| `frequency` | `VARCHAR(32)` | `NOT NULL` | `daily`, `weekly`, `monthly`, `event` |
| `prize_title`| `VARCHAR(255)` | `NOT NULL` | e.g. Free Royal Chai Combo |
| `prize_value`| `VARCHAR(64)` | `NOT NULL` | e.g. ₹500 Voucher |
| `draw_date` | `VARCHAR(128)` | `NOT NULL` | Schedule text |
| `validity_days`| `INT` | `DEFAULT 2` | Redemption window |
| `max_winners` | `INT` | `DEFAULT 1` | Winners selected per draw |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Active toggle |

### 4.6 `lucky_draw_coupons`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Coupon UUID |
| `campaign_id` | `VARCHAR(64)` | `REFERENCES lucky_draw_campaigns(id)`| Foreign key |
| `order_id` | `VARCHAR(64)` | `REFERENCES orders(id)` | Associated order |
| `coupon_id` | `VARCHAR(64)` | `UNIQUE NOT NULL` | Formatted code (e.g. `CAF-20260920-X82K`) |
| `customer_name`| `VARCHAR(128)` | `NOT NULL` | Customer name |
| `is_revealed` | `BOOLEAN` | `DEFAULT FALSE` | Scratch card status |
| `is_winner` | `BOOLEAN` | `DEFAULT FALSE` | Lottery winner flag |
| `is_redeemed` | `BOOLEAN` | `DEFAULT FALSE` | Counter redemption flag |

---

## 5. API Specification (RESTful Endpoints)

### 5.1 Customer Ordering Endpoints
- `POST /api/orders`
  - **Body**: `{ orderType, tableNumber?, paymentMethod, customerName, customerPhone, items, kitchenNotes? }`
  - **Behavior**: Initializes order; calculates 5% GST; if `paymentMethod === 'online'` and an active campaign exists, generates a `LuckyDrawCoupon`; starts parallel kitchen queue; computes `engagementExpiresAt = Date.now() + (60 * 60000)`.
- `GET /api/orders/:orderId`
  - **Returns**: Complete order object with parallel kitchen stream status, table queue index, and coupon token.
- `POST /api/orders/:orderId/convert-to-parcel`
  - **Behavior**: Converts a queued dine-in order to parcel takeaway without losing its kitchen cooking position.
- `POST /api/orders/:orderId/cancel`
  - **Behavior**: Cancels order if order status is still `placed` and cancellation policy allows.

### 5.2 Kitchen & Cashier Endpoints
- `PATCH /api/kitchen/orders/:orderId/status`
  - **Body**: `{ status: 'accepted' | 'preparing' | 'ready' | 'served' }`
- `POST /api/cashier/orders/:orderId/confirm-payment`
  - **Behavior**: Marks counter order as `paid`. **Crucial:** Inspects active campaigns and automatically generates the customer's official `LuckyDrawCoupon`.
- `POST /api/cashier/redeem-voucher`
  - **Body**: `{ voucherCode: string }`
  - **Returns**: Verification outcome and prize redemption approval.

### 5.3 Admin Campaign & System Endpoints
- `POST /api/admin/campaigns`
  - **Body**: `{ title, description, frequency, prizeTitle, prizeValue, drawDate, validityDays, maxWinners }`
- `POST /api/admin/campaigns/:campaignId/draw`
  - **Behavior**: Randomly samples eligible coupons issued under this campaign; selects winner(s); auto-creates a promotional marquee banner.
- `PATCH /api/admin/settings`
  - **Body**: `{ gameAccessMinutes, multiplayerLobbySeconds, allowDineInToParcel, luckyDrawActive, taxRatePercent }`

---

## 6. Screen-by-Screen UI Structure

### Screen 1: Customer Menu & Discovery (`/menu`)
- **Promotional Marquee**: Displays active campaigns, next draw countdown, and recently announced winners.
- **Search & Dietary Pills**: Search input + Quick pills: All Items, Popular Bestsellers, Pure Veg.
- **Categories Bar**: Beverages, Street Snacks, Main Course, Desserts.
- **Product Card**: Prep time estimate (`~5 mins`), dietary indicators, ₹ pricing, and "Customize & Add" modal.
- **Customization Modal**: Spice level (Mild, Medium, Spicy), portion sizes, milk variants, kitchen notes.

### Screen 2: Review & Checkout Modal (`/checkout`)
- **Dining Selector**: Dine-In vs Parcel Takeaway.
- **Table Seating Context**: Auto-detected from Table QR, or manual table pick, or Table Queue notice.
- **Payment Split**:
  - *Online (UPI/Card)*: Clarifies instant coupon generation.
  - *Pay at Counter*: Explains that coupon is generated upon cashier confirmation.
- **Bill Breakdown**: Subtotal, GST (5%), and Total in ₹.

### Screen 3: Live Order Tracker (`/track/:orderId`)
- **Top Bar**: Order number, status badge, estimated prep time.
- **60-Minute Engagement Pass**: Live countdown timer (`XX mins remaining (60-min window)`).
- **Parallel Stream Visualizer**:
  - *Stream 1 (Kitchen)*: Placed → Accepted → Cooking → Ready → Served.
  - *Stream 2 (Dining)*: Assigned Table #X or Table Queue position with wait time.
  - Fallback: "Convert to Parcel" button.
- **Lucky Draw Tile**: Displays coupon ID, campaign title, and scratch-card trigger.
- **Guest Feedback**: 5-star ratings for Food, Service, and **Waiting Experience**.

### Screen 4: Waiting Games Lounge (`/games`)
- **Access Guard**: Enforces 60-minute limit from order confirmation.
- **Single Player Tab**:
  1. *Classic Café Snake*: Full interactive arcade game with coffee beans & samosas.
  2. *Tic-Tac-Toe vs Barista AI*: Smart 3x3 bot.
  3. *Chai & Café Memory Match*: 12-card culinary memory grid.
  4. *Indian Café Culinary Quiz*: Questions on chai spices, South Indian filter coffee, and kulhads.
  5. *Barista Reflex Reaction Test*: Millisecond green-cup reflex challenge.
- **Multiplayer Tab**:
  1. *Ludo Express Sprint*: 2-player race to 25 with interactive dice.
  2. *Game Room Stand*: Displays Game Room Code + **Game Invitation QR** with explicit distinction from Table QR.
  3. *Lobby Timer*: 60-second countdown with auto-match for café patrons in queue.

### Screen 5: Kitchen & Staff KDS (`/kitchen`)
- **Order Pipeline**: Ticket cards with stage advancement.
- **Floor & Table Queue**: 8-table floorplan with instant Free / Occupied / Clean switches + Queue assigner.
- **Counter Cash Register**: Pending counter payments with 1-click `"Confirm Paid (₹XXX)"` and coupon trigger.
- **Prize Redemption Desk**: Code verifier for winning vouchers.

### Screen 6: Admin Operations Command (`/admin`)
- **Sales Ratio Table**: Units sold, total revenue (₹), and proportional sales share bars.
- **Waiting Experience Analytics**: Prep vs table wait times, game adoption %, and guest ratings.
- **Customer Conversion Funnel**: QR Scan → Menu → Cart → Placed → Paid → Games → Feedback.
- **Campaign Desk**: Create campaigns, toggle active status, and conduct winner draws.
- **Table Stands QR**: High-resolution printable table seating QR codes.
- **System Settings**: Game duration, lobby timeouts, tax rates, and feature toggles.

---

## 7. State Machines

### 7.1 Order Lifecycle State Machine
```text
                  [ Customer Places Order ]
                              │
                              ▼
                          ( PLACED )
                              │
            ┌─────────────────┴─────────────────┐
            │                                   │
            ▼                                   ▼
[ Cashier / Online Paid ]            [ Cancelled by User ]
            │                                   │
            ▼                                   ▼
       ( ACCEPTED )                        ( CANCELLED )
            │
            ▼
      ( PREPARING ) ──[ Parallel: Table Queue advances ]
            │
            ▼
        ( READY )
            │
            ▼
        ( SERVED ) ──[ Customer rates Waiting Experience ]
```

### 7.2 Lucky Draw Coupon Lifecycle State Machine
```text
           [ Admin Creates Campaign ]
                       │
                       ▼
                 ( ACTIVE POOL )
                       │
            ┌──────────┴──────────┐
            │                     │
   [ Online Paid Order ]   [ Counter Order ]
            │                     │
            │              [ Cashier Confirms ]
            │                     │
            └──────────┬──────────┘
                       │
                       ▼
           ( COUPON GENERATED ) ──[ Code: CAF-YYYYMMDD-XXXX ]
                       │
                       ▼
           ( SCRATCHED / REVEALED )
                       │
                       ▼
           [ Admin Conducts Draw ]
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
       ( WINNER )            ( EXPIRED )
            │
    [ Cashier Redeems ]
            │
            ▼
       ( REDEEMED )
```

---

## 8. Development & Implementation Prompts

### Prompt 1: Customer Ordering & Parallel Wait
> *"Implement an omnichannel ordering flow where food preparation is decoupled from table availability. When a customer places an order, calculate a strict 60-minute engagement expiration timestamp. If the dining option is dine-in and all tables are full, insert the order into the table queue while simultaneously sending the ticket to the kitchen display for immediate preparation. Provide a fallback button for waiting customers to switch to parcel takeaway."*

### Prompt 2: Admin-Controlled Lucky Draw System
> *"Implement a promotional Lucky Draw module controlled exclusively by admin campaigns. Do NOT issue coupons automatically for every order. Check if an admin campaign is currently active. For online payments, generate an official coupon ID upon order confirmation. For counter payments, defer coupon generation until the cashier clicks 'Confirm Paid'. Provide an admin draw tool to pick random winning coupons and publish winner marquee banners."*

### Prompt 3: 60-Minute Game Lounge & Multiplayer QR Distinction
> *"Build a waiting game lounge that enforces a strict 60-minute access pass from order confirmation. Implement Classic Café Snake, Culinary Trivia, and Ludo Express. For multiplayer rooms, implement a 60-second lobby timer with an 'Open to Café Players' toggle. Clearly display the Game Invitation QR and code, explicitly distinguishing it from the physical Table Seating QR stand."*
