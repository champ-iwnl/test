# Nextzy Reward Game - Frontend Architecture

> 🎨 Frontend Technical Specification & Architecture Document
> 
> Last Updated: January 31, 2026
> 
> Reference: [Figma Design](https://www.figma.com/design/djxl2rDd3POJjLUWfGMtK9/Test--FullStack-?node-id=0-1&p=f)

## Table of Contents

1. [Technology Stack & Libraries](#1-technology-stack--libraries)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Page & Component Breakdown](#3-page--component-breakdown)
4. [UI/UX & Responsive Strategy](#4-uiux--responsive-strategy)
5. [Performance Strategy](#5-performance-strategy)
6. [Type Safety & Validation](#6-type-safety--validation)
7. [State Management Flow](#7-state-management-flow)
8. [API Integration Layer](#8-api-integration-layer)

---

## 1. Technology Stack & Libraries

### Core Framework
- **Next.js 14+** (App Router)
  - Server-Side Rendering (SSR) for SEO optimization
  - Automatic Code Splitting & Route-based Lazy Loading
  - Built-in API Route support (optional, if needed)
  - Image optimization via `next/image`
  - Font loading via `next/font` (Google Fonts)

### Styling
- **Tailwind CSS 3.x**
  - Utility-first CSS framework
  - Mobile-First design approach (default breakpoints: sm, md, lg, xl, 2xl)
  - Custom color palette: Primary (Gold #FFC107), Secondary (Red #DC143C)
  - No CSS-in-JS complexity; pre-built components via class names

### Language & Type Safety
- **TypeScript 5.x**
  - Full type safety across the codebase
  - Strict null checking enabled
  - JSX type inference for React components
  - Type definitions for API responses from backend

### State Management
- **Zustand 4.x**
  - Lightweight global state management (lighter than Redux)
  - Stores:
    - `playerStore`: User nickname, player ID, current score
    - `gameStore`: Spin history, claimed rewards, daily spin count
    - `uiStore`: Modal visibility, loading states, active tabs

### Animation & Transitions
- **Framer Motion 10.x**
  - Smooth wheel spin animation with physics-based easing
  - Modal entrance/exit animations
  - Progress bar fill animations
  - Bounce/spring effects for reward claims

### Form Handling & Validation
- **React Hook Form 7.x**
  - Efficient form state management (minimal re-renders)
  - Integrates with Zod for validation schema
  
- **Zod 3.x**
  - Runtime schema validation for forms and API responses
  - TypeScript-first validation schemas
  - Error messages localization-ready

### Data Fetching & Caching
- **TanStack Query (React Query) 5.x**
  - Server state management (Player profile, history data)
  - Automatic caching & background refetching
  - Loading/Error/Success state handling
  - Pagination support with `keepPreviousData`
  - Optimistic updates for reward claims

### HTTP Client
- **Axios 1.x** (or native Fetch if lightweight preferred)
  - Centralized API configuration
  - Interceptors for auth headers, error handling
  - Request/Response transformation

### UI Component Library (Optional)
- **shadcn/ui** OR **Headless UI**
  - Pre-built accessible components (Dialog, Select, Badge)
  - Composable and customizable with Tailwind CSS
  - Preferred for accessibility compliance

---

## 2. Frontend Architecture

### Folder Structure (Feature-Based)

```
frontend/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Root Layout (Fonts, Providers, Global Styles)
│   │   ├── page.tsx                   # Landing Page (/)
│   │   ├── home/
│   │   │   ├── layout.tsx             # Home Layout (Header)
│   │   │   └── page.tsx               # Home Dashboard (/home)
│   │   └── game/
│   │       ├── layout.tsx
│   │       └── page.tsx               # Game Page (/game)
│   │
│   ├── components/                    # Shared UI Components
│   │   ├── ui/                        # Atomic Components
│   │   │   ├── Button.tsx             # Primary, Secondary variants
│   │   │   ├── Input.tsx              # Text input with error states
│   │   │   ├── Modal.tsx              # Reusable modal wrapper
│   │   │   ├── Badge.tsx              # Status badge (Locked, Claimable, Claimed)
│   │   │   ├── Spinner.tsx            # Loading spinner
│   │   │   ├── Tabs.tsx               # Tab navigation
│   │   │   └── ProgressBar.tsx        # Linear progress with checkpoints
│   │   │
│   │   └── layout/
│   │       ├── Navbar.tsx             # Header with player name
│   │       └── Container.tsx          # Centered max-width wrapper
│   │
│   ├── features/                      # Feature-specific logic & components
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── NicknameForm.tsx
│   │   │   ├── types.ts
│   │   │   └── hooks/
│   │   │       └── useAuth.ts
│   │   │
│   │   ├── reward/
│   │   │   ├── components/
│   │   │   │   ├── ScoreCard.tsx      # Display current score & total points
│   │   │   │   ├── RewardProgressBar.tsx  # With checkpoint interaction
│   │   │   │   ├── CheckpointBadge.tsx    # Individual checkpoint status
│   │   │   │   ├── RewardCard.tsx    # Card display for claimed rewards
│   │   │   │   └── ClaimRewardModal.tsx
│   │   │   ├── types.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useRewardProgress.ts
│   │   │   │   └── useClaimReward.ts
│   │   │   └── queries/
│   │   │       └── rewards.queries.ts
│   │   │
│   │   ├── history/
│   │   │   ├── components/
│   │   │   │   ├── HistoryTabs.tsx    # Tab switcher
│   │   │   │   ├── HistoryTable.tsx   # Data table for spin history
│   │   │   │   ├── HistoryList.tsx    # Paginated/virtualized list
│   │   │   │   └── EmptyState.tsx
│   │   │   ├── types.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useGlobalHistory.ts
│   │   │   │   └── usePersonalHistory.ts
│   │   │   └── queries/
│   │   │       └── history.queries.ts
│   │   │
│   │   └── game/
│   │       ├── components/
│   │       │   ├── SpinWheel.tsx      # Wheel rendering & animation
│   │       │   ├── ControlPanel.tsx   # Start/Stop buttons
│   │       │   ├── ResultModal.tsx    # Show spin result
│   │       │   └── DailyLimitWarning.tsx
│   │       ├── types.ts
│   │       ├── hooks/
│   │       │   ├── useSpinLogic.ts
│   │       │   └── useWheelAnimation.ts
│   │       └── queries/
│   │           └── game.queries.ts
│   │
│   ├── hooks/                         # Custom Hooks
│   │   ├── useGameLogic.ts            # Complex game state management
│   │   ├── useScore.ts                # Score calculation & updates
│   │   ├── useModal.ts                # Modal visibility control
│   │   └── useLocalStorage.ts         # Persist user preferences
│   │
│   ├── services/                      # API Integration
│   │   ├── api.ts                     # Axios instance with interceptors
│   │   ├── endpoints.ts               # Centralized API routes
│   │   ├── player.service.ts          # Player API calls
│   │   ├── game.service.ts            # Game/Spin API calls
│   │   ├── reward.service.ts          # Reward API calls
│   │   └── history.service.ts         # History API calls
│   │
│   ├── store/                         # Global State (Zustand)
│   │   ├── playerStore.ts
│   │   ├── gameStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts                   # Combined store exports
│   │
│   ├── types/                         # TypeScript Interfaces
│   │   ├── api.types.ts               # API response types (mirrored from backend)
│   │   ├── game.types.ts              # Game-specific types
│   │   ├── player.types.ts
│   │   └── ui.types.ts
│   │
│   ├── utils/                         # Helper Functions
│   │   ├── formatters.ts              # Number, date formatting
│   │   ├── validators.ts              # Form validation schemas (Zod)
│   │   ├── constants.ts               # Game constants (wheel segments, checkpoints)
│   │   ├── calculation.ts             # Score calculation logic
│   │   └── cn.ts                      # Class name merger (clsx/classnames)
│   │
│   ├── lib/                           # Third-party library configuration
│   │   └── queryClient.ts             # React Query client setup
│   │
│   └── styles/
│       └── globals.css                # Tailwind directives & global styles
│
├── public/                            # Static assets
│   ├── images/
│   │   ├── wheel-segments/            # Wheel SVG or PNG segments
│   │   ├── icons/
│   │   └── badges/
│   └── fonts/                         # Custom fonts (if any)
│
├── .env.local                         # Environment variables
├── tailwind.config.ts                 # Tailwind configuration
├── tsconfig.json                      # TypeScript configuration
├── next.config.js                     # Next.js configuration
├── package.json                       # Dependencies
└── README.md
```

---

## 3. Page & Component Breakdown

### 3.1 Landing Page (`/`)

**Purpose:** User onboarding - collect player nickname

**Key Components:**

```
Landing (Page)
├── Container (centered layout)
├── Logo / Welcome Title
├── NicknameForm
│   ├── Input (Validation: non-empty, min 2 chars, max 20 chars)
│   ├── Error Message
│   └── Primary Button (Submit)
└── Footer Info
```

**Component: `NicknameForm.tsx`**
- Form handling with React Hook Form
- Zod validation schema
- On submit:
  1. Validate nickname
  2. Call `POST /players/enter` (Backend API)
  3. Store `playerID` & `nickname` in `playerStore`
  4. Save to LocalStorage for persistence
  5. Redirect to `/home` via Next.js router

**User Flow:**
```
Landing Page
  ↓ (Enter nickname & click)
  ↓ Create Player (API: POST /players/enter)
  ↓ Store in Global State & LocalStorage
  ↓ Redirect to /home
```

**UX Details:**
- Input has placeholder text: "กรุณาใส่ชื่อของคุณ" (Thai)
- Button disabled while loading
- Error display below input
- Mobile: Full width input, 44px min button height

---

### 3.2 Home Page (`/home`)

**Purpose:** Main dashboard - display score, rewards, and history

**Layout Structure:**

```
Home (Page)
├── Navbar (Player name, logout button)
├── Container
│   ├── ═══════════════════════════════════
│   │ Section 1: Score & Progress
│   ├── ═══════════════════════════════════
│   │
│   │  ScoreCard
│   │  ┌─────────────────────────────────┐
│   │  │ Current Score                   │
│   │  │       3,500 / 10,000            │
│   │  └─────────────────────────────────┘
│   │
│   │  RewardProgressBar
│   │  ┌─────────────────────────────────┐
│   │  │ ✓ │  ●  │  ●  │  ●  │  ●      │
│   │  │ 500│1000 │2000 │5000 │10000 ✓  │
│   │  │Claimed│ ?  │ ?  │ ?  │ Claimable
│   │  └─────────────────────────────────┘
│   │  ● = Clickable checkpoint → Show claim modal
│   │
│   ├── ═══════════════════════════════════
│   │ Section 2: Action
│   ├── ═══════════════════════════════════
│   │
│   │  PlayButton (Link to /game)
│   │
│   ├── ═══════════════════════════════════
│   │ Section 3: History & Rewards
│   ├── ═══════════════════════════════════
│   │
│   │  HistoryTabs
│   │  ┌─────────────────────────────────┐
│   │  │ [Global History] [My History] [My Rewards]
│   │  └─────────────────────────────────┘
│   │
│   │  HistoryList / HistoryTable
│   │  (Virtualized for large datasets)
│   │  - Global: All spins from all players (top 100 recent)
│   │  - Personal: Current player's spins only
│   │  - Rewards: Claimed rewards with timestamps
```

**Key Components:**

#### `ScoreCard.tsx`
- Props: `currentScore: number`, `totalCheckpoint: number`
- Display: "3,500 / 10,000"
- Styled with gold background (Primary color)
- Uses `Intl.NumberFormat` for number formatting with thousands separator

#### `RewardProgressBar.tsx`
- Props: `score: number`, `checkpoints: Checkpoint[]`, `claimedCheckpoints: number[]`
- Renders horizontal progress track with checkpoint markers
- Checkpoint states:
  - `Locked`: Score < checkpoint value → gray, disabled
  - `Claimable`: Score >= checkpoint && not claimed → gold badge, clickable
  - `Claimed`: Already claimed → green checkmark, disabled
- On checkpoint click → Show `ClaimRewardModal`

#### `CheckpointBadge.tsx`
- Single checkpoint status display
- Props: `value: number`, `status: 'locked' | 'claimable' | 'claimed'`
- Dynamic styling based on status

#### `HistoryTabs.tsx`
- Tab switcher: "Global History" | "My History" | "My Rewards"
- Props: `activeTab: string`, `onTabChange: (tab: string) => void`
- Smooth transition between tabs

#### `HistoryList.tsx`
- Renders paginated/virtualized list of history items
- Props: `items: HistoryItem[]`, `isLoading: boolean`, `page: number`, `onLoadMore: () => void`
- For 1M+ rows: Display only first 100 or latest 100 items
- Consider virtual scrolling library: `react-window` or `tanstack-virtual`

**Data Fetching with React Query:**
```typescript
// hooks/queries/usePlayerProfile.ts
- GET /players/{id}
- Caches player profile, re-fetches on focus

// hooks/queries/useGlobalHistory.ts
- GET /history/global?limit=100&page=1
- Pagination with keepPreviousData

// hooks/queries/usePersonalHistory.ts
- GET /history/{player_id}?limit=100&page=1
- Automatically refetch on successful spin/claim

// hooks/queries/useClaimedRewards.ts
- GET /rewards/{player_id}
- Refetch after successful claim
```

**Interactions:**
1. **Click Checkpoint** → Show `ClaimRewardModal`
2. **Claim Reward** (Optimistic Update):
   - Immediately update UI (set status to "Claimed")
   - Call `POST /rewards/claim` in background
   - If error → Revert state
3. **Switch Tab** → Fetch corresponding history data
4. **Pagination** → Load next page via "Load More" button or auto-scroll

---

### 3.3 Game Page (`/game`)

**Purpose:** Interactive spin wheel gameplay

**Layout Structure:**

```
Game (Page)
├── Navbar (Show current score, daily spins used: e.g., "3/10")
├── Container
│   ├── ═══════════════════════════════════
│   │ Section 1: Spin Wheel
│   ├── ═══════════════════════════════════
│   │
│   │         ▲ (Pin)
│   │         │
│   │     ┌───────────┐
│   │     │  ┌─────┐  │
│   │     │  │ 1K  │  │ (Segments)
│   │     │  └─────┘  │
│   │     │ 3K   ◆  5K│
│   │     │  3K   │   │
│   │     │  ───────  │
│   │     │ 300    500│
│   │     │           │
│   │     └───────────┘
│   │         (Wheel)
│   │
│   ├── ═══════════════════════════════════
│   │ Section 2: Info Bar
│   ├── ═══════════════════════════════════
│   │
│   │  ┌─────────────────────────────────┐
│   │  │ Total Points: 3,500             │
│   │  │ Daily Spins Used: 3 / 10        │
│   │  └─────────────────────────────────┘
│   │
│   ├── ═══════════════════════════════════
│   │ Section 3: Control Panel
│   ├── ═══════════════════════════════════
│   │
│   │  ┌─────────────────────────────────┐
│   │  │ Primary Button: "เริ่มหมุน"      │
│   │  │ (Disabled if 10 spins used)     │
│   │  └─────────────────────────────────┘
│   │
│   └── ═══════════════════════════════════
│       Section 4: Result Modal (Overlay)
│       ┌─────────────────────────────────┐
│       │ 🎉 Congratulations!             │
│       │ You Won: 500 Points             │
│       │ Total Now: 4,000                │
│       │ [Close Button]                  │
│       └─────────────────────────────────┘
```

**Key Components:**

#### `SpinWheel.tsx`
- **Rendering Approach:**
  - SVG for crisp scaling or CSS Conic Gradient
  - Segments: 300, 500, 1,000, 3,000 points
  - Four colors: rotate through palette
  - Central circle with player avatar or icon

- **Structure (CSS/SVG Layers):**
  ```
  Layer 1: Background (Static)
  Layer 2: Wheel (Rotatable)
      └─ Segments (4 pieces with text)
  Layer 3: Pin (Static, top center)
  Layer 4: Center Hub (Static, player icon/avatar)
  ```
  
  **Critical:** Pin and center hub MUST NOT rotate with wheel

- **Props:**
  - `rotation: number` (degrees, updated via animation)
  - `segments: Segment[]` (values & colors)
  - `isSpinning: boolean`

- **Animation States:**
  - **IDLE:** Wheel stationary, button enabled
  - **SPINNING:** Wheel rotating (infinite loop) at increasing speed
  - **DECELERATING:** Slow down to target position (ease-out)
  - **RESULT:** Wheel stopped, show modal

#### `ControlPanel.tsx`
- Props: `onSpin: () => void`, `isSpinning: boolean`, `spinsRemaining: number`
- Button text: "เริ่มหมุน" (Start spin)
- Button disabled if:
  - `isSpinning === true`
  - `spinsRemaining === 0`
- Show spinner while loading (calling API)
- Show warning if daily limit reached

#### `ResultModal.tsx`
- Show after spin completes
- Display: Points won, new total, animation
- Props: `result: SpinResult`, `onClose: () => void`
- Animation: Pop-in with scale + bounce effect (Framer Motion)

#### `DailyLimitWarning.tsx`
- Show if user has used all 10 daily spins
- Props: `spinsRemaining: number`
- Display: "You have used 10/10 daily spins. Come back tomorrow!"

**Game Logic Hook: `useSpinLogic.ts`**

**State Machine:**
```
IDLE (initial)
  ↓ (User clicks "Start Spin" button)
SPINNING (wheel rotates fast)
  ↓ (Backend returns spin result)
DECELERATING (smoothly slow down to target rotation)
  ↓ (Animation completes)
RESULT (show modal with points won)
  ↓ (User closes modal)
IDLE (reset)
```

**Spin Execution Flow:**
```
1. Button Click
   ↓
2. Check: Daily spins < 10?
   ├─ NO: Show warning, abort
   └─ YES: Continue
   ↓
3. Call POST /game/spin (API)
   ├─ Waiting: Show spinner, disable button
   ↓
4. Backend returns: SpinResult { pointsGained, totalPoints, spinLogId }
   ↓
5. Calculate wheel rotation:
   target_rotation = result.pointsGained → segment index → degrees
   ↓
6. Animate wheel:
   - Start: SPINNING (fast)
   - Transition to: target_rotation (ease-out curve)
   - Duration: 3-4 seconds
   ↓
7. Animation completes → RESULT state
   ↓
8. Show ResultModal with details
   ↓
9. User closes modal → Refetch player profile + history
   ↓
10. Return to IDLE
```

**Animation Details (Framer Motion):**
```typescript
// Wheel rotation animation
<motion.div
  animate={{ rotate: targetRotation }}
  transition={{
    duration: 3.5,
    ease: "easeOut"
  }}
>
  {/* Wheel SVG */}
</motion.div>

// Result modal entrance
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>
  {/* Modal content */}
</motion.div>
```

**Segment Mapping (degrees):**
- Assuming 4 equal segments (90° each)
- Segment 1 (300 pts):  0° - 90°
- Segment 2 (500 pts):  90° - 180°
- Segment 3 (1K pts):   180° - 270°
- Segment 4 (3K pts):   270° - 360°

If result is segment index `i`, final rotation = `(4 - i) * 90 + random(0-90)` (to add variety)

---

## 4. UI/UX & Responsive Strategy

### Design Principles

1. **Mobile-First Approach**
   - Default styling for 300px-500px screens
   - Progressive enhancement for larger screens
   - Touch-friendly: All interactive elements ≥ 44px height

2. **Container Max-Width**
   ```css
   /* Ensures app looks like mobile app even on desktop */
   .container {
     max-width: 28rem; /* ~450px */
     margin: 0 auto;
     padding: 0 1rem;
   }
   ```

3. **Breakpoints (Tailwind)**
   - `sm: 640px` - Small tablets
   - `md: 768px` - Tablets
   - `lg: 1024px` - Desktop
   - `xl: 1280px` - Large desktop

### Responsive Behavior

| Component | 320px | 480px | 768px+ |
|-----------|-------|-------|--------|
| ScoreCard | Full width | Full width | Centered |
| RewardProgressBar | Vertical checkpoints | Horizontal (squeezed) | Horizontal (spaced) |
| Wheel | Reduced size | Medium | Large |
| Button | 44px height | 48px height | 48px height |
| Tabs | Stacked text | Condensed | Spaced |

### Color Palette

- **Primary (Gold)**: `#FFC107` - Buttons, highlights, active states
- **Secondary (Red)**: `#DC143C` - Claimed status, warnings
- **Success (Green)**: `#28A745` - Completed, claimed checkmarks
- **Gray**: `#6C757D` - Locked/disabled states
- **Background**: `#F8F9FA` - Light background
- **Text**: `#212529` - Dark text

### Accessibility Requirements

1. **Semantic HTML**: Use `<button>`, `<form>`, `<section>`, etc.
2. **ARIA Labels**: `aria-label`, `aria-describedby` for icon buttons
3. **Color Contrast**: WCAG AA (4.5:1 for text, 3:1 for graphics)
4. **Keyboard Navigation**: All buttons focusable, Tab order logical
5. **Focus Indicators**: Visible focus ring (not removed)
6. **Form Labels**: Explicit `<label>` associations with inputs

### Loading & Feedback States

| Action | Feedback |
|--------|----------|
| Form Submit | Button shows spinner, disabled |
| API Loading | Skeleton loader or spinner |
| Button Interaction | Visual hover/active state |
| Error State | Red error message below input |
| Success | Toast notification (optional) or modal |

---

## 5. Performance Strategy

### Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Techniques

#### 5.1 Image Optimization
- Use `next/image` for all images
- Automatic format selection (WebP, AVIF)
- Responsive images with `srcSet`
- Lazy loading by default

```typescript
import Image from 'next/image';

<Image
  src="/images/wheel.svg"
  alt="Spin wheel"
  width={400}
  height={400}
  priority  // For above-fold images
/>
```

#### 5.2 Font Loading
- Use `next/font` (Google Fonts)
- Preload via `next/font/google`
- Avoid layout shift via font-display: swap

```typescript
import { Prompt } from 'next/font/google';

const prompt = Prompt({
  subsets: ['thai'],
  display: 'swap',
  weights: ['400', '600', '700'],
});
```

#### 5.3 Code Splitting
- Next.js App Router handles automatic route-based splitting
- Use dynamic imports for heavy components:

```typescript
import dynamic from 'next/dynamic';

const SpinWheel = dynamic(() => import('@/features/game/components/SpinWheel'), {
  loading: () => <Skeleton className="w-full h-96" />,
  ssr: false  // Wheel animation only works client-side
});
```

#### 5.4 Bundle Size
- Avoid importing entire libraries (tree-shaking)
- Use lightweight alternatives:
  - ✅ Zustand (2.3KB)
  - ❌ Redux (too heavy)
  - ✅ Framer Motion (40KB)
  - ✅ Zod (35KB) for validation

#### 5.5 Optimistic UI Updates
- Update UI immediately on user action
- Revert if API call fails
- Improves perceived performance

```typescript
// Example: Claiming reward
const onClaim = async (checkpointId: number) => {
  // Optimistic update
  setClaimedCheckpoints([...claimedCheckpoints, checkpointId]);
  
  try {
    await claimReward(checkpointId);
    queryClient.invalidateQueries(['playerProfile']);
  } catch (error) {
    // Revert on error
    setClaimedCheckpoints(
      claimedCheckpoints.filter(id => id !== checkpointId)
    );
    showError('Failed to claim reward');
  }
};
```

#### 5.6 Caching Strategy (React Query)
```typescript
// Cache for 5 minutes, refetch on window focus
useQuery(
  ['playerProfile', playerId],
  () => getPlayerProfile(playerId),
  {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  }
);
```

---

## 6. Type Safety & Validation

### TypeScript Types (Mirrored from Backend)

```typescript
// types/api.types.ts

// Player types
export interface Player {
  id: string;
  nickname: string;
  totalPoints: number;
  claimedCheckpoints: number[];
  createdAt: string;
  lastSpinAt: string;
}

export interface PlayerEnterRequest {
  nickname: string;
}

export interface PlayerEnterResponse {
  id: string;
  nickname: string;
}

// Spin & Game types
export interface SpinRequest {
  playerId: string;
}

export interface SpinResult {
  spinLogId: string;
  pointsGained: number;
  totalPointsAfter: number;
  spunAt: string;
}

// Reward types
export interface RewardCheckpoint {
  value: number;
  status: 'locked' | 'claimable' | 'claimed';
}

export interface ClaimRewardRequest {
  playerId: string;
  checkpointValue: number;
}

export interface ClaimRewardResponse {
  transactionId: string;
  pointsRewarded: number;
  claimedAt: string;
}

// History types
export interface SpinLogEntry {
  id: string;
  playerId: string;
  playerName: string;
  pointsGained: number;
  spunAt: string;
}

export interface HistoryResponse {
  items: SpinLogEntry[];
  total: number;
  page: number;
  limit: number;
}
```

### Validation Schemas (Zod)

```typescript
// utils/validators.ts

import { z } from 'zod';

// Landing page form
export const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(20, 'Name must be less than 20 characters')
    .regex(/^[a-zA-Z0-9ก-ฮ\s]+$/, 'Invalid characters'),
});

export type NicknameFormData = z.infer<typeof nicknameSchema>;

// Claim reward validation
export const claimRewardSchema = z.object({
  playerId: z.string().uuid(),
  checkpointValue: z.number().positive(),
});
```

---

## 7. State Management Flow

### Zustand Stores

#### `playerStore.ts`
```typescript
interface PlayerState {
  // Data
  playerId: string | null;
  nickname: string;
  totalPoints: number;
  claimedCheckpoints: number[];

  // Actions
  setPlayer: (id: string, nickname: string) => void;
  updatePoints: (points: number) => void;
  addClaimedCheckpoint: (value: number) => void;
  logout: () => void;
}
```

#### `gameStore.ts`
```typescript
interface GameState {
  // Data
  dailySpinsUsed: number;
  spinHistory: SpinLogEntry[];
  lastSpinResult: SpinResult | null;
  isWheelSpinning: boolean;
  wheelRotation: number;

  // Actions
  startSpin: () => void;
  endSpin: (result: SpinResult) => void;
  setWheelRotation: (rotation: number) => void;
  resetDailySpins: () => void;  // Called at midnight or on next day
}
```

#### `uiStore.ts`
```typescript
interface UIState {
  // Data
  isModalOpen: boolean;
  activeHistoryTab: 'global' | 'personal' | 'rewards';
  isLoading: boolean;
  errorMessage: string | null;

  // Actions
  openModal: () => void;
  closeModal: () => void;
  setActiveTab: (tab: 'global' | 'personal' | 'rewards') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
```

### Data Flow Diagram

```
User Action (Click Spin)
  ↓
useSpinLogic.ts (Custom Hook)
  ├─ Check daily limit (from gameStore)
  ├─ Call POST /game/spin (api.service)
  ├─ Update gameStore (wheelRotation, isSpinning)
  └─ Trigger animation (Framer Motion)
  ↓
Animation completes
  ├─ Update gameStore (result, dailySpinsUsed)
  ├─ Update playerStore (totalPoints)
  └─ Invalidate React Query cache
  ↓
usePlayerProfile.ts (React Query)
  └─ Refetch latest player data from backend
```

---

## 8. API Integration Layer

### Service Structure

```typescript
// services/api.ts
import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

// Request interceptor (add auth headers if needed)
apiClient.interceptors.request.use((config) => {
  return config;
});

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Service Methods

```typescript
// services/player.service.ts
export async function enterGame(nickname: string): Promise<PlayerEnterResponse> {
  return apiClient.post('/players/enter', { nickname });
}

export async function getPlayerProfile(playerId: string): Promise<Player> {
  return apiClient.get(`/players/${playerId}`);
}

// services/game.service.ts
export async function executeSpins(playerId: string): Promise<SpinResult> {
  return apiClient.post('/game/spin', { playerId });
}

// services/reward.service.ts
export async function claimReward(
  playerId: string,
  checkpointValue: number
): Promise<ClaimRewardResponse> {
  return apiClient.post('/rewards/claim', {
    playerId,
    checkpointValue,
  });
}

// services/history.service.ts
export async function getGlobalHistory(
  page: number = 1,
  limit: number = 100
): Promise<HistoryResponse> {
  return apiClient.get('/history/global', { params: { page, limit } });
}

export async function getPersonalHistory(
  playerId: string,
  page: number = 1,
  limit: number = 100
): Promise<HistoryResponse> {
  return apiClient.get(`/history/${playerId}`, { params: { page, limit } });
}
```

### React Query Integration

```typescript
// features/game/queries/game.queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useExecuteSpin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playerId: string) => executeSpins(playerId),
    onSuccess: (data) => {
      // Invalidate player profile & game history
      queryClient.invalidateQueries({ queryKey: ['playerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['personalHistory'] });
    },
  });
}

export function useSpinHistory(playerId: string, page: number = 1) {
  return useQuery({
    queryKey: ['personalHistory', playerId, page],
    queryFn: () => getPersonalHistory(playerId, page),
    staleTime: 2 * 60 * 1000,  // 2 minutes
  });
}
```

---

## Development Workflow

### Prerequisites
```bash
Node.js 18+
npm or yarn
```

### Setup
```bash
# Install dependencies
npm install

# Environment variables
cp .env.example .env.local
# Edit .env.local with API base URL

# Development server
npm run dev

# Open http://localhost:3000
```

### Build & Deployment
```bash
# Production build
npm run build

# Start production server
npm run start

# Deploy to Vercel (recommended for Next.js)
vercel
```

### Performance Analysis
```bash
# Analyze bundle size
npm run analyze

# Check Core Web Vitals
# Use PageSpeed Insights: https://pagespeed.web.dev
```

---

## Key Considerations & Notes

1. **Large Dataset Handling (1M+ CSV rows)**
   - Display only top 100 or latest 100 items initially
   - Consider pagination or virtual scrolling
   - Backend should support limit/offset parameters

2. **Real-time Updates**
   - Consider WebSocket or Server-Sent Events (SSE) for live leaderboard
   - React Query's refetch interval for periodic updates

3. **Offline Support**
   - Service Worker for offline capability (PWA)
   - LocalStorage for caching player data
   - Sync when online

4. **Localization (i18n)**
   - Support Thai + English
   - Use `next-intl` or `i18next`
   - Translate all UI text, validation messages

5. **Error Handling**
   - User-friendly error messages
   - Retry logic for failed API calls
   - Error boundary component for React errors

6. **Analytics**
   - Track user flows (landing → home → game)
   - Monitor spin distribution, claim success rates
   - Use Google Analytics or similar

7. **Security**
   - HTTPS only
   - CSRF protection for forms
   - Sanitize user input (prevent XSS)
   - Never expose sensitive data in frontend code

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Vitals](https://web.dev/vitals/)

---

**Document Version:** 1.0
**Last Updated:** January 31, 2026
**Status:** Architecture Specification Complete - Ready for Implementation
