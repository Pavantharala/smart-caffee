import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const outPath = path.join(process.cwd(), 'public', 'Complete_Restaurant_FullStack_Architecture_Handbook.pdf');
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 36, bottom: 36, left: 40, right: 40 },
  bufferPages: true
});

const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

// Visual Theme
const primaryColor = '#b45309';      // Rich Amber
const secondaryColor = '#0f172a';    // Slate 900
const bodyColor = '#1e293b';         // Slate 800
const mutedColor = '#64748b';        // Slate 500
const accentColor = '#059669';       // Emerald 600

function addHeader(title: string, subtitle?: string) {
  doc.rect(0, 0, doc.page.width, 150).fill('#0f172a');
  doc.fillColor('#f59e0b').fontSize(22).font('Helvetica-Bold').text(title, 40, 36);
  if (subtitle) {
    doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text(subtitle, 40, 68);
  }
  doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text('Production Architecture, Database Design, Modular Feature Engineering & Step-by-Step Re-Creation Guide', 40, 92);
  doc.fillColor('#f59e0b').fontSize(8.5).font('Helvetica').text('Comprehensive Developer Edition • Full Lifecycle Reference', 40, 115);
  doc.y = 175;
}

function addPhaseHeading(phaseNum: string, title: string, goal: string) {
  if (doc.y > 660) doc.addPage();
  doc.moveDown(0.6);
  doc.rect(40, doc.y, doc.page.width - 80, 36).fill('#fef3c7');
  doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text(`${phaseNum}: ${title.toUpperCase()}`, 50, doc.y - 30);
  doc.fillColor(mutedColor).fontSize(8.5).font('Helvetica-Oblique').text(`Objective: ${goal}`, 50, doc.y - 14);
  doc.moveDown(0.6);
}

function addSubSection(title: string) {
  if (doc.y > 690) doc.addPage();
  doc.moveDown(0.4);
  doc.fillColor(secondaryColor).fontSize(10.5).font('Helvetica-Bold').text(title, 45);
  doc.moveDown(0.2);
}

function addParagraph(text: string) {
  if (doc.y > 720) doc.addPage();
  doc.fillColor(bodyColor).fontSize(9).font('Helvetica').text(text, 45, doc.y, {
    align: 'justify',
    lineGap: 2.2
  });
  doc.moveDown(0.35);
}

function addBullet(title: string, desc: string) {
  if (doc.y > 720) doc.addPage();
  doc.fillColor(primaryColor).fontSize(9).font('Helvetica-Bold').text('• ' + title + ': ', 50, doc.y, { continued: true });
  doc.fillColor(bodyColor).font('Helvetica').text(desc, { lineGap: 2 });
  doc.moveDown(0.2);
}

function addCodeBox(code: string, languageLabel: string = 'TYPESCRIPT / BASH') {
  if (doc.y > 640) doc.addPage();
  const lines = code.split('\n');
  const height = lines.length * 10 + 16;
  const startY = doc.y;

  // Header tag
  doc.rect(45, startY, doc.page.width - 90, height).fillAndStroke('#f8fafc', '#cbd5e1');
  doc.rect(45, startY, doc.page.width - 90, 14).fill('#e2e8f0');
  doc.fillColor('#475569').fontSize(7.5).font('Helvetica-Bold').text(languageLabel, 52, startY + 3);

  doc.fillColor('#0f172a').fontSize(7.5).font('Courier').text(code, 52, startY + 18, {
    lineGap: 2
  });
  doc.y = startY + height + 6;
}

// -------------------------------------------------------------
// COVER / HEADER
// -------------------------------------------------------------
addHeader('ENTERPRISE RESTAURANT & MULTI-OUTLET SYSTEM', 'Complete End-to-End Development & Redesign Blueprint');

// -------------------------------------------------------------
// PHASE 1
// -------------------------------------------------------------
addPhaseHeading('PHASE 1', 'FOUNDATION, RUNTIME & ENVIRONMENT CONFIGURATION', 'Establish the project scaffold, dependency boundaries, TypeScript strictness, and Tailwind tokens.');

addSubSection('1.1 Initial Project Setup & Tooling Selection');
addParagraph('When building an interactive restaurant website that incorporates live ordering, a kitchen display system (KDS), and in-venue gaming, we choose Vite + React 19 + TypeScript. Vite ensures sub-second Hot Module Replacement (HMR) and optimized Rollup tree-shaking for mobile devices on venue Wi-Fi.');

addBullet('Node Version', 'Node.js 20+ LTS recommended for native fetch and ESModule support.');
addBullet('TypeScript Strictness', 'Strict mode enabled (noImplicitAny, strictNullChecks) to guarantee rock-solid order pricing.');
addBullet('Tailwind CSS v4', 'Zero-runtime utility engine utilizing modern CSS variables for dark luxury theme.');

addCodeBox(`npm create vite@latest restaurant-system -- --template react-ts
cd restaurant-system
npm install lucide-react canvas-confetti qrcode @tailwindcss/vite tailwindcss
npm install -D @types/canvas-confetti @types/qrcode @types/node`, 'TERMINAL COMMANDS');

// -------------------------------------------------------------
// PHASE 2
// -------------------------------------------------------------
addPhaseHeading('PHASE 2', 'FEATURE-DRIVEN DIRECTORY HIERARCHY', 'Design an isolated folder layout preventing monolithic App.tsx and circular imports.');

addSubSection('2.1 Why Feature Folders Beat Traditional Type Folders');
addParagraph('In a basic student tutorial, developers place all components inside "components/". Once the application grows with game lounges, kitchen dashboards, cart modals, and restaurant brand switchers, that folder becomes unmaintainable. Instead, we use the Domain Feature Pattern where each capability encapsulates its own UI, data, and helpers.');

addCodeBox(`src/
├── features/
│   ├── games/            # Self-contained games registry & 9 interactive modules
│   │   ├── components/   # SpinWheel, Snake, MemoryMatch, Uno, Ludo, etc.
│   │   ├── gamesRegistry.ts
│   │   └── GamesLounge.tsx
│   ├── menu/             # Dishes, dietary pills, live search, customization modal
│   │   ├── components/   # MenuCatalog, MenuItemCard, CategoryNav, DishCustomizerModal
│   │   └── index.ts
│   ├── cart/             # Tray calculations, GST tax, Dine-In vs Parcel checkout
│   │   └── components/CheckoutModal.tsx
│   ├── orders/           # Live lifecycle tracker & table seating status
│   │   └── components/ActiveOrderTracker.tsx
│   ├── kitchen/          # Kitchen Display System (KDS) for kitchen cooks
│   │   └── components/KitchenDashboard.tsx
│   ├── admin/            # Outlet management, dish CRUD, games toggling, analytics
│   │   └── components/AdminDashboard.tsx
│   ├── restaurants/      # Multi-restaurant brand switcher modal & configurations
│   ├── table/            # Table QR simulation & seating context manager
│   ├── lucky-draw/       # Receipt scratch coupon & gamified promotion modal
│   └── notifications/    # Kitchen alerts drawer & audio notification pings
├── context/CafeContext.tsx
├── types.ts
├── App.tsx
└── main.tsx`, 'DIRECTORY TREE');

// -------------------------------------------------------------
// PHASE 3
// -------------------------------------------------------------
addPhaseHeading('PHASE 3', 'MULTI-RESTAURANT FRANCHISE ENGINE & DATA MODEL', 'Design scalable schemas allowing the platform to power 1 to 500+ restaurants.');

addSubSection('3.1 The Multi-Tenant Restaurant Profile');
addParagraph('To support other restaurants seamlessly, the entire platform reads from a dynamic `currentRestaurant` object rather than hardcoding names or menus. Each restaurant configures its own address, ratings, GST tax percentage, Wi-Fi credentials, table count, and enabled games.');

addCodeBox(`export interface RestaurantProfile {
  id: string;               // Unique slug: 'roast-toast', 'spice-symphony'
  name: string;             // Display name (e.g. 'The Roast & Toast Artisan Bistro')
  tagline: string;
  cuisine: string;          // e.g. 'Gourmet Burgers & Wood-Fired Pizza'
  address: string;
  rating: number;
  totalReviews: number;
  heroBanner: string;       // High-resolution photo
  logo: string;             // Logo symbol or badge
  themeColor: string;       // Hex accent (e.g. '#f59e0b')
  tableCount: number;
  products: Product[];      // Dedicated menu catalog for this branch
  enabledGameIds?: string[];// Enabled mini-games per location
  wifiDetails?: { ssid: string; password: string };
}`, 'DATA MODEL (src/types.ts)');

// -------------------------------------------------------------
// PHASE 4
// -------------------------------------------------------------
addPhaseHeading('PHASE 4', 'MENU ENGINEERING & DIETARY FILTERING', 'Build a reactive menu catalog with Veg/Non-Veg indicators, spice levels, and portions.');

addSubSection('4.1 Interactive Menu Customization Modal');
addParagraph('Dishes like Gourmet Burgers or Artisanal Pizzas require size choices, crust types, and extra cheese upgrades. The DishCustomizerModal calculates price additions in real-time, validates mandatory choices, and saves chef cooking instructions directly to the item ticket.');

addBullet('Diets & Badges', 'Filter pills for Pure Veg (emerald), Non-Veg (rose), Chef Special (amber), and Under 15 Mins.');
addBullet('Custom Add-ons', 'Extra cheese bursts (+₹40), gourmet dips (+₹25), and portion sizes with instant subtotal.');
addBullet('Persistent Floating Cart', 'A sleek bottom floating bar that displays quantity and subtotal, guiding users to checkout.');

// -------------------------------------------------------------
// PHASE 5
// -------------------------------------------------------------
addPhaseHeading('PHASE 5', 'DINE-IN QR SEATING & PARCEL CHECKOUT', 'Support contactless table ordering, automatic table queueing, and takeaway packaging.');

addSubSection('5.1 Table QR Architecture');
addParagraph('Customers seated at a table scan a printed QR stand (`/?table=4`). The website parses the query parameter, binds the table number to the session, and skips manual table entry. If all tables are full, the system automatically routes the diner into the Table Queue while the kitchen prepares their order in parallel.');

addBullet('Payment Flow', 'Supports Instant Online UPI / Card or Pay at Counter (Cash/Card) with split invoicing.');
addBullet('GST Tax Engine', 'Dynamic tax rate calculated from restaurant system settings (defaults to standard 5%).');

// -------------------------------------------------------------
// PHASE 6
// -------------------------------------------------------------
addPhaseHeading('PHASE 6', 'EXTENSIBLE GAMING LOUNGE & PROMOTIONAL REWARDS', 'Turn customer waiting time into high customer retention and gamified sales.');

addSubSection('6.1 Modular Registry Pattern for Games');
addParagraph('Every game in the platform is isolated under `src/features/games/components/`. The central `gamesRegistry.ts` acts as a catalog with metadata: difficulty, player count, rules, and reward discounts.');

addBullet('Spin & Win Wheel', 'Gives diners a spin during prep time to win free brownies or ₹50 discount vouchers.');
addBullet('Retro Café Snake', 'Classic touch-enabled arcade game where the snake gobbles hot coffees and pastries.');
addBullet('Memory Match', 'Food pairing card game with move tracking and visual confetti on victory.');
addBullet('Culinary Trivia', 'Multi-choice quiz exploring spices and brewing traditions with real-time scoring.');
addBullet('Reflex Rush', 'Millisecond reaction test measuring extraction timing.');
addBullet('Table QR Duel', 'Local multiplayer room generation with 4-digit code and QR sharing for friends.');
addBullet('Ludo & Uno', 'Classic board and card games built directly in React without heavy canvas engines.');

// -------------------------------------------------------------
// PHASE 7
// -------------------------------------------------------------
addPhaseHeading('PHASE 7', 'KITCHEN DISPLAY SYSTEM (KDS) & REAL-TIME TRACKER', 'Bridge the gap between diner orders and kitchen chef operations.');

addSubSection('7.1 Order Lifecycle State Machine');
addParagraph('When an order is submitted, the Kitchen Display System sounds an audio notification and adds the ticket to the kitchen pipeline. Kitchen cooks update status from "Pending" to "Preparing", which ticks an elapsed preparation clock. Once marked "Ready", the customer screen updates with an animated collection alert.');

// -------------------------------------------------------------
// PHASE 8
// -------------------------------------------------------------
addPhaseHeading('PHASE 8', 'ADMINISTRATION, ANALYTICS & FRANCHISE MANAGEMENT', 'Provide restaurant managers with full CRUD operations and live business metrics.');

addSubSection('8.1 Admin Dashboard Capabilities');
addBullet('Multi-Restaurant Hub', 'Add, edit, switch, or import/export restaurant outlet profiles and menus via JSON.');
addBullet('Live Menu Manager', 'Edit dish prices, change categories, upload photos, and toggle item out-of-stock in 1 tap.');
addBullet('Game Lounge Manager', 'Enable or disable specific games per outlet based on venue style.');
addBullet('Analytics & Funnel', 'Real-time sales, order preparation duration averages, and lucky draw claims.');

// -------------------------------------------------------------
// PHASE 9
// -------------------------------------------------------------
addPhaseHeading('PHASE 9', 'FUTURE REDESIGN & PRODUCTION DEPLOYMENT GUIDE', 'Checklist for deploying to production or customizing the user interface.');

addSubSection('9.1 How to Redesign the UI in the Future');
addParagraph('Because styles utilize Tailwind utility tokens in `src/index.css` and feature components are decoupled:');
addBullet('Changing Color Palette', 'Update Tailwind accent classes (e.g. replace `amber-500` with `sky-500` or `emerald-500`).');
addBullet('Replacing a Component', 'Modify only the targeted feature folder (e.g. `src/features/menu/components/MenuItemCard.tsx`).');
addBullet('Connecting Real SQL/Firebase', 'Replace `localStorage` calls in `CafeContext.tsx` with Firestore or REST endpoints.');

addSubSection('9.2 Build Verification Commands');
addCodeBox(`npm run lint        # Verifies TypeScript strict typing (zero errors)
npm run build       # Compiles optimized production bundle into dist/
npm run preview     # Runs production server locally on port 3000`, 'PRODUCTION VERIFICATION');

// Footer page numbers
const pages = doc.bufferedPageRange();
for (let i = 0; i < pages.count; i++) {
  doc.switchToPage(i);
  doc.fillColor('#64748b').fontSize(8).font('Helvetica').text(
    `Enterprise Restaurant & Multi-Outlet Architecture Handbook • Page ${i + 1} of ${pages.count}`,
    40,
    doc.page.height - 24,
    { align: 'center', width: doc.page.width - 80 }
  );
}

doc.end();

stream.on('finish', () => {
  console.log('Complete Handbook Generated at: ' + outPath);
});
