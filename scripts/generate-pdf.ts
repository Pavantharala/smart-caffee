import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const outPath = path.join(process.cwd(), 'public', 'Restaurant_FullStack_Development_Master_Guide.pdf');
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 45, right: 45 },
  bufferPages: true
});

const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

// Styling helpers
const primaryColor = '#b45309'; // warm amber/orange
const secondaryColor = '#1c1917'; // dark stone
const bodyColor = '#292524';
const lightMuted = '#78716c';
const codeBg = '#f5f5f4';

// Title page / Cover
doc.rect(0, 0, doc.page.width, 180).fill('#1c1917');
doc.fillColor('#f59e0b').fontSize(26).font('Helvetica-Bold').text('SMART RESTAURANT & CAFÉ SYSTEM', 45, 45);
doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('Complete Step-by-Step Developer Master Blueprint', 45, 80);
doc.fillColor('#a8a29e').fontSize(10).font('Helvetica').text('Architecture, Multi-Restaurant Outlets, Gaming Lounge, KDS, & Production Deployment', 45, 105);
doc.fillColor('#f59e0b').fontSize(9).font('Helvetica').text('Generated for AI Studio Full-Stack Development • Production Edition 2026', 45, 130);

doc.moveDown(5);
doc.y = 205;

function addChapterHeading(title: string, sub?: string) {
  if (doc.y > 680) doc.addPage();
  doc.moveDown(0.8);
  doc.rect(45, doc.y, doc.page.width - 90, 24).fill('#fef3c7');
  doc.fillColor(primaryColor).fontSize(13).font('Helvetica-Bold').text(title, 55, doc.y - 18);
  doc.moveDown(0.5);
  if (sub) {
    doc.fillColor(lightMuted).fontSize(9).font('Helvetica-Oblique').text(sub, 50);
    doc.moveDown(0.4);
  }
}

function addSectionTitle(title: string) {
  if (doc.y > 700) doc.addPage();
  doc.moveDown(0.5);
  doc.fillColor(secondaryColor).fontSize(11).font('Helvetica-Bold').text(title, 50);
  doc.moveDown(0.2);
}

function addParagraph(text: string) {
  if (doc.y > 720) doc.addPage();
  doc.fillColor(bodyColor).fontSize(9.5).font('Helvetica').text(text, 50, doc.y, {
    align: 'justify',
    lineGap: 2.5
  });
  doc.moveDown(0.4);
}

function addBullet(bulletTitle: string, bulletText: string) {
  if (doc.y > 720) doc.addPage();
  doc.fillColor(primaryColor).fontSize(9.5).font('Helvetica-Bold').text('• ' + bulletTitle + ': ', 55, doc.y, { continued: true });
  doc.fillColor(bodyColor).font('Helvetica').text(bulletText, { lineGap: 2 });
  doc.moveDown(0.25);
}

function addCodeBox(codeSnippet: string) {
  if (doc.y > 660) doc.addPage();
  const height = codeSnippet.split('\n').length * 11 + 14;
  const startY = doc.y;
  doc.rect(50, startY, doc.page.width - 100, height).fillAndStroke('#f5f5f4', '#e7e5e4');
  doc.fillColor('#0c0a09').fontSize(8).font('Courier').text(codeSnippet, 58, startY + 7, {
    lineGap: 2.5
  });
  doc.y = startY + height + 8;
}

// CHAPTER 1
addChapterHeading('PHASE 1: PROJECT FOUNDATION & MODERN ARCHITECTURE');
addParagraph('The Smart Restaurant & Multi-Outlet platform is engineered as a modern Single Page Web Application utilizing React 19, TypeScript, and Tailwind CSS. The system decouples customer ordering, live kitchen management (KDS), administrative operations, and modular patron entertainment.');

addSectionTitle('1.1 Technology Stack & Runtime Environment');
addBullet('Core Framework', 'React 19 with TypeScript strict mode enabled for high reliability and type safety.');
addBullet('Build Tooling', 'Vite 6 with native ESM fast-refresh, zero legacy overhead, and optimized production chunking.');
addBullet('Styling Architecture', 'Tailwind CSS v4 with unified design tokens, dark luxury palette (stone-950, amber-500, emerald-500).');
addBullet('State Management', 'React Context API (CafeContext) with persistent localStorage synchronization and atomic hooks.');
addBullet('Modular Feature Directory', 'Decoupled domain folders under src/features/ (games, menu, cart, orders, kitchen, admin).');

addSectionTitle('1.2 Essential Terminal Setup Commands');
addCodeBox(`npm create vite@latest smart-restaurant-app -- --template react-ts
cd smart-restaurant-app
npm install lucide-react canvas-confetti qrcode @tailwindcss/vite tailwindcss
npm install -D @types/canvas-confetti @types/qrcode @types/node`);

// CHAPTER 2
addChapterHeading('PHASE 2: DIRECTORY HIERARCHY & REUSABLE MODULE SYSTEM');
addParagraph('To allow multiple developers to extend games, menus, or restaurant brands without merge conflicts, the codebase strictly adheres to the Feature Directory Pattern:');

addCodeBox(`src/
├── features/
│   ├── games/            # Self-contained games registry & 9 interactive modules
│   │   ├── components/   # SpinWheel, Snake, MemoryMatch, UnoClash, Ludo, etc.
│   │   ├── gamesRegistry.ts
│   │   └── GamesLounge.tsx
│   ├── menu/             # Menu catalog, dietary filter pills, customization modal
│   ├── cart/             # Cart tray, calculations, taxes, Dine-In vs Parcel checkout
│   ├── orders/           # Real-time status lifecycle tracker & table seating status
│   ├── kitchen/          # Kitchen Display System (KDS) for cooks & order prep timers
│   ├── admin/            # Outlet management, dish CRUD, games toggling, analytics
│   ├── restaurants/      # Multi-restaurant brand switcher modal & configurations
│   ├── table/            # Table QR simulation & seating context manager
│   ├── lucky-draw/       # Receipt scratch coupon & gamified promotion modal
│   └── notifications/    # Kitchen alerts drawer & audio notification pings
├── context/CafeContext.tsx
└── types.ts`);

// CHAPTER 3
addChapterHeading('PHASE 3: MULTI-RESTAURANT OUTLET & FRANCHISE ENGINE');
addParagraph('The platform accommodates arbitrary restaurant profiles and franchises. Each restaurant entity maintains independent branding, menu items, table counts, tax rates, Wi-Fi credentials, and enabled game modules.');

addSectionTitle('3.1 Data Model: RestaurantProfile Interface');
addCodeBox(`export interface RestaurantProfile {
  id: string;               // e.g., 'roast-toast', 'spice-symphony', 'dragon-wok'
  name: string;             // Display name (e.g. 'The Roast & Toast Artisan Bistro')
  tagline: string;
  cuisine: string;          // e.g. 'Gourmet Burgers, Stone-Baked Pizza & Coffee'
  address: string;
  rating: number;
  totalReviews: number;
  heroBanner: string;       // High-res photograph URL
  logo: string;             // Logo badge / emoji symbol
  themeColor: string;       // Primary brand accent (e.g. '#f59e0b')
  tableCount: number;
  products: Product[];      // Independent catalog for this specific restaurant
  enabledGameIds?: string[];// Customizable games per outlet
  wifiDetails?: { ssid: string; password: string };
}`);

addSectionTitle('3.2 How to Add a New Restaurant in 3 Minutes');
addParagraph('1. Open the Admin Hub by toggling the "Admin Hub" tab in the navigation bar.');
addParagraph('2. Select the "Restaurant Network" tab and tap "Add New Restaurant Profile".');
addParagraph('3. Input the brand name, cuisine type, table count, Wi-Fi password, and upload or pick a preset banner image.');
addParagraph('4. Save changes. Diners can immediately switch to this branch using the top Restaurant Switcher Pill.');

// CHAPTER 4
addChapterHeading('PHASE 4: EXTENSIBLE CAFÉ GAMING LOUNGE & REWARD SYSTEM');
addParagraph('The Waiting Lounge entertains diners while food is being freshly cooked, turning the traditional waiting annoyance into high engagement. Winning challenges unlocks instant discount coupons, free brownies, and table champion badges.');

addSectionTitle('4.1 Available Game Modules in the Engine');
addBullet('Spin & Win Fortune Wheel', 'Physics-based rotating wheel rewarding instant brownie or ₹50 checkout coupon vouchers.');
addBullet('Retro Café Snake', 'Grid arcade snake eating coffee cups and snacks, featuring mobile touch navigation keys.');
addBullet('Café Memory Match', 'Flip-card food pairing puzzle testing short-term memory with move tracking.');
addBullet('Culinary & Spice Trivia', 'Interactive quiz covering Indian brewing traditions, spice origin fun-facts, and score tracking.');
addBullet('Barista Reflex Rush', 'Millisecond reaction test measuring reaction time upon espresso extraction.');
addBullet('Table Duel Tic-Tac-Toe', 'Play against Barista Bot AI or duel across table via QR code room generation.');
addBullet('Ludo Express Sprint', 'Rapid 25-square racing board with interactive animated 3D dice.');
addBullet('Uno Card Clash Duel', 'Color and number matching with Skip, Draw-2, and Wild cards against the Barista Bot.');

addSectionTitle('4.2 Code Blueprint: Adding a Custom Game in 3 Steps');
addParagraph('Step 1: Create your game component in src/features/games/components/MyCustomGame.tsx:');
addCodeBox(`import React from 'react';
import { GameComponentProps } from '../types';

export const MyCustomGame: React.FC<GameComponentProps> = ({ onBackToHub }) => {
  return (
    <div className="bg-stone-900 p-6 rounded-3xl text-center">
      <h3 className="text-xl font-bold text-white">My Exciting Custom Game</h3>
      <button onClick={onBackToHub} className="mt-4 px-4 py-2 bg-amber-500 rounded-xl">
        Back to Lounge
      </button>
    </div>
  );
};`);
addParagraph('Step 2: Add game definition into src/features/games/gamesRegistry.ts with difficulty and perks.');
addParagraph('Step 3: Add the matching case in src/features/games/GamesLounge.tsx switch statement.');

// CHAPTER 5
addChapterHeading('PHASE 5: KITCHEN DISPLAY SYSTEM (KDS) & ORDER LIFECYCLE');
addParagraph('The kitchen staff view orders in real-time, categorized into Pending, Preparing, and Ready stages with countdown timers and urgent indicators when preparation exceeds target time.');

addSectionTitle('5.1 Order Status State Machine');
addCodeBox(`[ORDER PLACED] (Dine-in / Parcel)
      ↓
[CONFIRMED & TICKET CREATED] → Diner unlocks 60-Min Game Pass & Lucky Coupon
      ↓
[PREPARING IN KITCHEN]      → KDS shows elapsed vs estimated prep time
      ↓
[READY FOR PICKUP/TABLE]     → Push notification & table sound alert dispatched
      ↓
[COMPLETED & PAID]          → Table status automatically resets to 'Available'`);

// CHAPTER 6
addChapterHeading('PHASE 6: ADMIN DASHBOARD & MENU ENGINEERING');
addParagraph('Restaurant managers have access to a suite of control panels:');
addBullet('Analytics & Funnel', 'Real-time revenue, average order preparation duration, popular dishes, and gaming engagement.');
addBullet('Live Menu Manager', '1-tap price changes, category assignment, preparation times, veg/non-veg toggles, and photo URLs.');
addBullet('Promotional Banners', 'Deploy dynamic festive campaigns and lucky draw percentage rules.');
addBullet('Table Seating Matrix', 'Interactive floor plan indicating vacant, reserved, occupied, and billing tables.');

// CHAPTER 7
addChapterHeading('PHASE 7: PRODUCTION BUILD & DEPLOYMENT CHECKLIST');
addParagraph('Before publishing to production cloud hosts (Vercel, Firebase Hosting, Netlify, or Google Cloud Run):');
addCodeBox(`# 1. Type verification
npm run lint

# 2. Production bundling
npm run build

# 3. Test production preview server locally
npm run preview -- --port 3000`);

addParagraph('Ensure environment variables (VITE_APP_TITLE, VITE_API_URL) are set in your CI/CD pipeline.');

// Page numbers
const pages = doc.bufferedPageRange();
for (let i = 0; i < pages.count; i++) {
  doc.switchToPage(i);
  doc.fillColor('#78716c').fontSize(8).font('Helvetica').text(
    `Smart Restaurant Development Guide • Page ${i + 1} of ${pages.count}`,
    45,
    doc.page.height - 30,
    { align: 'center', width: doc.page.width - 90 }
  );
}

doc.end();

stream.on('finish', () => {
  console.log('PDF Generated successfully at: ' + outPath);
});
