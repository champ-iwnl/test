# 🎨 Frontend Task Breakdown - Nextzy Reward Game

> **Total Points: 20 (UI/UX)**
> 
> Focus Areas:
> - Responsive Display (300px - 500px)
> - Figma Design Accuracy
> 
> **Status: ⏳ PENDING APPROVAL**

---

## 📋 Task Overview

| Phase | Description | Points | Priority |
|-------|-------------|--------|----------|
| 0 | Project Setup & Configuration | 2 | 🔴 Critical |
| 1 | Shared UI Components (Atomic) | 3 | 🔴 Critical |
| 2 | Landing Page | 3 | 🔴 Critical |
| 3 | Home Page - Score & Progress | 4 | 🔴 Critical |
| 4 | Home Page - History Tabs | 3 | 🟡 High |
| 5 | Game Page - Spin Wheel | 5 | 🔴 Critical |
| **Total** | | **20** | |

---

## Phase 0: Project Setup & Configuration (2 points)

### Task 0.1: Initialize Next.js Project
**File:** `package.json`, `next.config.js`, `tsconfig.json`

| Subtask | Description | Est. Time |
|---------|-------------|-----------|
| 0.1.1 | Create Next.js 14+ project with App Router | 10 min |
| 0.1.2 | Configure TypeScript strict mode | 5 min |
| 0.1.3 | Setup path aliases (`@/components`, `@/features`, etc.) | 5 min |

### Task 0.2: Install Dependencies
**File:** `package.json`

```bash
# Core
next react react-dom typescript

# Styling
tailwindcss postcss autoprefixer

# State & Data
zustand @tanstack/react-query axios

# Forms & Validation
react-hook-form zod @hookform/resolvers

# Animation
framer-motion

# Utilities
clsx tailwind-merge
```

| Subtask | Description | Est. Time |
|---------|-------------|-----------|
| 0.2.1 | Install all production dependencies | 5 min |
| 0.2.2 | Install dev dependencies (types, eslint, prettier) | 5 min |

### Task 0.3: Configure Tailwind CSS
**Files:** `tailwind.config.ts`, `src/styles/globals.css`

| Subtask | Description | Est. Time |
|---------|-------------|-----------|
| 0.3.1 | Setup Tailwind with content paths | 5 min |
| 0.3.2 | Define custom colors (Gold #FFC107, Red #DC143C) | 5 min |
| 0.3.3 | Configure custom breakpoints for mobile (300px-500px) | 5 min |
| 0.3.4 | Add Thai font (Prompt) via `next/font` | 10 min |

### Task 0.4: Setup Project Structure
**Files:** Various `.keep` files → actual files

| Subtask | Description | Est. Time |
|---------|-------------|-----------|
| 0.4.1 | Create root layout with providers | 15 min |
| 0.4.2 | Setup React Query provider | 10 min |
| 0.4.3 | Create API client (axios instance) | 10 min |
| 0.4.4 | Define TypeScript types (mirrored from backend) | 15 min |
| 0.4.5 | Create utility functions (cn, formatters) | 10 min |

### Task 0.5: Environment Configuration
**File:** `.env.local`, `.env.example`

| Subtask | Description | Est. Time |
|---------|-------------|-----------|
| 0.5.1 | Define `NEXT_PUBLIC_API_URL` | 5 min |
| 0.5.2 | Create `.env.example` for documentation | 2 min |

---

## Phase 1: Shared UI Components (3 points)

### Task 1.1: Button Component
**File:** `src/components/ui/Button.tsx`

**Figma Reference:** Yellow primary button in all screens

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 1.1.1 | Create base Button with variants (primary, secondary, ghost) | ✅ |
| 1.1.2 | Add size variants (sm, md, lg) - min 44px height for touch | ✅ 300-500px |
| 1.1.3 | Implement loading state with spinner | ✅ |
| 1.1.4 | Add disabled state styling | ✅ |
| 1.1.5 | Add hover/active/focus states | ✅ |
| 1.1.6 | Full-width option for mobile | ✅ 300-500px |

**Figma Accuracy Checklist:**
- [ ] Gold/Yellow background (#FFC107 or similar)
- [ ] Rounded corners (border-radius)
- [ ] White text on primary
- [ ] Shadow/elevation effect
- [ ] Touch feedback on mobile

### Task 1.2: Input Component
**File:** `src/components/ui/Input.tsx`

**Figma Reference:** Landing page nickname input

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 1.2.1 | Create base Input with label support | ✅ |
| 1.2.2 | Add error state (red border, error message) | ✅ |
| 1.2.3 | Add placeholder styling | ✅ |
| 1.2.4 | Ensure touch-friendly size (min 44px height) | ✅ 300-500px |
| 1.2.5 | Full-width by default on mobile | ✅ 300-500px |

**Figma Accuracy Checklist:**
- [ ] Light gray border
- [ ] Placeholder text styling
- [ ] Focus state with gold border
- [ ] Error state with red border

### Task 1.3: Modal Component
**File:** `src/components/ui/Modal.tsx`

**Figma Reference:** Claim reward modal, Result modal

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 1.3.1 | Create modal overlay (dark backdrop) | ✅ |
| 1.3.2 | Create modal container (centered, max-width) | ✅ 300-500px |
| 1.3.3 | Add close button (X icon top-right) | ✅ |
| 1.3.4 | Implement Framer Motion animations (scale + fade) | ✅ |
| 1.3.5 | Handle click outside to close | ✅ |
| 1.3.6 | Trap focus inside modal (accessibility) | ✅ |
| 1.3.7 | Prevent body scroll when open | ✅ |

**Figma Accuracy Checklist:**
- [ ] White background with rounded corners
- [ ] Close button position matches Figma
- [ ] Shadow/elevation
- [ ] Centered content
- [ ] Gold badge/icon display

### Task 1.4: Badge Component
**File:** `src/components/ui/Badge.tsx`

**Figma Reference:** Checkpoint status indicators

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 1.4.1 | Create badge variants (locked, claimable, claimed) | ✅ |
| 1.4.2 | Locked: Gray background, lock icon | ✅ |
| 1.4.3 | Claimable: Gold background, pulsing animation | ✅ |
| 1.4.4 | Claimed: Green/Red background, checkmark | ✅ |
| 1.4.5 | Size appropriate for touch (min 32px) | ✅ 300-500px |

### Task 1.5: Tabs Component
**File:** `src/components/ui/Tabs.tsx`

**Figma Reference:** History tabs on Home page

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 1.5.1 | Create tab container with horizontal scroll | ✅ 300-500px |
| 1.5.2 | Tab item styling (active/inactive) | ✅ |
| 1.5.3 | Gold underline for active tab | ✅ |
| 1.5.4 | Touch-friendly tab size | ✅ 300-500px |
| 1.5.5 | Smooth transition between tabs | ✅ |

**Figma Accuracy Checklist:**
- [ ] Tab text matches Figma (ประวัติทั้งหมด, ประวัติของฉัน, รางวัลที่ได้รับแล้ว)
- [ ] Active tab has gold/yellow indicator
- [ ] Rounded pill style for active tab

### Task 1.6: Spinner Component
**File:** `src/components/ui/Spinner.tsx`

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 1.6.1 | Create animated spinner (CSS or SVG) | ✅ |
| 1.6.2 | Size variants (sm, md, lg) | ✅ |
| 1.6.3 | Color variants (gold, white, gray) | ✅ |

### Task 1.7: Container Component
**File:** `src/components/layout/Container.tsx`

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 1.7.1 | Create centered container with max-width 450px | ✅ 300-500px |
| 1.7.2 | Add horizontal padding (16px on mobile) | ✅ 300-500px |
| 1.7.3 | Ensure proper spacing on all screen sizes | ✅ |

---

## Phase 2: Landing Page (3 points)

### Task 2.1: Landing Page Layout
**File:** `src/app/page.tsx`

**Figma Reference:** "Landing" screen

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 2.1.1 | Create page structure with centered content | ✅ 300-500px |
| 2.1.2 | Add proper vertical spacing | ✅ |
| 2.1.3 | Ensure full height layout (min-h-screen) | ✅ |

### Task 2.2: Welcome Section
**File:** `src/app/page.tsx` or separate component

**Figma Reference:** Title "Nextzy Test (Full Stack)"

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 2.2.1 | Add title text with proper font size | ✅ 300-500px |
| 2.2.2 | Add subtitle/description text | ✅ |
| 2.2.3 | Responsive font sizing (text-xl to text-2xl) | ✅ 300-500px |

**Figma Accuracy Checklist:**
- [ ] Title: "Nextzy Test (Full Stack)" - bold, dark text
- [ ] Subtitle: "ชื่อสำหรับเล่น (ห้ามซ้ำกัน)" - gray, smaller
- [ ] Vertical spacing matches Figma

### Task 2.3: Nickname Form
**File:** `src/features/auth/components/NicknameForm.tsx`

**Figma Reference:** Input + Button on Landing

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 2.3.1 | Integrate React Hook Form | ✅ |
| 2.3.2 | Add Zod validation schema (min 2, max 20 chars) | ✅ |
| 2.3.3 | Display validation errors below input | ✅ |
| 2.3.4 | Handle form submission | ✅ |
| 2.3.5 | Show loading state on button during API call | ✅ |
| 2.3.6 | Call POST /players/enter API | ✅ |
| 2.3.7 | Store player data in Zustand store | ✅ |
| 2.3.8 | Redirect to /home on success | ✅ |
| 2.3.9 | Handle API errors (nickname already taken) | ✅ |

**Figma Accuracy Checklist:**
- [ ] Input placeholder: "Test 234" style
- [ ] Button text: "เข้าเล่น"
- [ ] Button full-width
- [ ] Proper spacing between input and button

### Task 2.4: Player Store Setup
**File:** `src/store/playerStore.ts`

| Subtask | Description |
|---------|-------------|
| 2.4.1 | Create Zustand store with player state | 
| 2.4.2 | Add actions: setPlayer, logout, updatePoints |
| 2.4.3 | Persist to localStorage |
| 2.4.4 | Add hydration handling for SSR |

---

## Phase 3: Home Page - Score & Progress (4 points)

### Task 3.1: Home Page Layout
**File:** `src/app/home/page.tsx`

**Figma Reference:** "Home", "Home (2)", "Home (3)" screens

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 3.1.1 | Create page layout with Container | ✅ 300-500px |
| 3.1.2 | Add header/navbar with player info | ✅ |
| 3.1.3 | Section spacing (score, progress, action, history) | ✅ 300-500px |
| 3.1.4 | Fetch player profile on mount | ✅ |
| 3.1.5 | Handle loading state with skeleton | ✅ |

### Task 3.2: Score Card Component
**File:** `src/features/reward/components/ScoreCard.tsx`

**Figma Reference:** Yellow card with "คะแนนสะสม / 10,000 จุดเพื่อรับรางวัล 1 รายการ"

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 3.2.1 | Create card with gold/yellow gradient background | ✅ 300-500px |
| 3.2.2 | Display "คะแนนสะสม" label | ✅ |
| 3.2.3 | Display score with thousands separator (3,500/10,000) | ✅ |
| 3.2.4 | Display info text "จุดเพื่อรับรางวัล 1 รายการ" | ✅ |
| 3.2.5 | Display min/max points (ต่ำสุด 300, สูงสุด 3000) | ✅ |
| 3.2.6 | Responsive text sizing | ✅ 300-500px |
| 3.2.7 | Card shadow and border-radius | ✅ |

**Figma Accuracy Checklist:**
- [ ] Yellow/Gold gradient background
- [ ] Score display: "3,500/10,000" format
- [ ] Small text for min/max points
- [ ] Rounded corners
- [ ] Shadow effect

### Task 3.3: Reward Progress Bar
**File:** `src/features/reward/components/RewardProgressBar.tsx`

**Figma Reference:** Progress bar with checkpoint circles

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 3.3.1 | Create horizontal progress track | ✅ 300-500px |
| 3.3.2 | Calculate progress percentage from score | ✅ |
| 3.3.3 | Render checkpoint markers at correct positions | ✅ |
| 3.3.4 | Position checkpoints: 500, 1000, 2000, 5000, 10000 | ✅ |
| 3.3.5 | Animate progress bar fill | ✅ |
| 3.3.6 | Responsive sizing for mobile | ✅ 300-500px |

**Figma Accuracy Checklist:**
- [ ] Gray track background
- [ ] Yellow/Gold filled portion
- [ ] Checkpoint circles aligned on track
- [ ] Checkpoint values displayed below

### Task 3.4: Checkpoint Badge Component
**File:** `src/features/reward/components/CheckpointBadge.tsx`

**Figma Reference:** Circle markers on progress bar

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 3.4.1 | Create circular badge | ✅ 300-500px |
| 3.4.2 | Locked state: Gray circle, small size | ✅ |
| 3.4.3 | Claimable state: Gold circle, pulsing glow | ✅ |
| 3.4.4 | Claimed state: Red/Crimson circle, checkmark | ✅ |
| 3.4.5 | Click handler for claimable checkpoints | ✅ |
| 3.4.6 | Tooltip or label showing point value | ✅ |

**Figma Accuracy Checklist:**
- [ ] Locked: Small gray dot
- [ ] Claimable: Medium gold circle with glow
- [ ] Claimed: Red circle with checkmark or icon
- [ ] "รับรางวัล" button for claimable state

### Task 3.5: Claim Reward Modal
**File:** `src/features/reward/components/ClaimRewardModal.tsx`

**Figma Reference:** "Modal (Click Button)" - "ยินดีด้วย"

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 3.5.1 | Use Modal base component | ✅ 300-500px |
| 3.5.2 | Display gold medal/coin icon | ✅ |
| 3.5.3 | Display "ยินดีด้วย" title | ✅ |
| 3.5.4 | Display reward message "คุณได้รับรางวัล 1" | ✅ |
| 3.5.5 | Add close button ("ปิด") | ✅ |
| 3.5.6 | Call POST /rewards/claim API | ✅ |
| 3.5.7 | Optimistic UI update (mark as claimed immediately) | ✅ |
| 3.5.8 | Handle errors and revert if failed | ✅ |
| 3.5.9 | Invalidate player profile query on success | ✅ |

**Figma Accuracy Checklist:**
- [ ] Gold medal/coin icon at top
- [ ] "ยินดีด้วย" heading
- [ ] Subtitle text
- [ ] "ปิด" button (gold/yellow)

### Task 3.6: Play Button (Navigate to Game)
**File:** `src/app/home/page.tsx` or separate component

**Figma Reference:** Yellow "ไปเล่นเกม" button at bottom

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 3.6.1 | Create large CTA button | ✅ 300-500px |
| 3.6.2 | Link to /game page | ✅ |
| 3.6.3 | Full-width on mobile | ✅ 300-500px |
| 3.6.4 | Fixed at bottom or in flow | ✅ |

**Figma Accuracy Checklist:**
- [ ] Text: "ไปเล่นเกม"
- [ ] Yellow/Gold background
- [ ] Full width
- [ ] Rounded corners

---

## Phase 4: Home Page - History Tabs (3 points)

### Task 4.1: History Tabs Component
**File:** `src/features/history/components/HistoryTabs.tsx`

**Figma Reference:** Tab bar below progress section

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 4.1.1 | Create 3-tab navigation | ✅ 300-500px |
| 4.1.2 | Tab 1: "ประวัติทั้งหมด" (Global History) | ✅ |
| 4.1.3 | Tab 2: "ประวัติของฉัน" (My History) | ✅ |
| 4.1.4 | Tab 3: "รางวัลที่ได้รับแล้ว" (My Rewards) | ✅ |
| 4.1.5 | Active tab indicator (gold pill background) | ✅ |
| 4.1.6 | Horizontal scroll on narrow screens | ✅ 300-500px |
| 4.1.7 | Persist active tab in state | ✅ |

**Figma Accuracy Checklist:**
- [ ] Tab styling matches Figma (pill shape for active)
- [ ] Gold/yellow highlight for active tab
- [ ] Tab text exact match
- [ ] Proper spacing between tabs

### Task 4.2: History List Component
**File:** `src/features/history/components/HistoryList.tsx`

**Figma Reference:** List items below tabs

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 4.2.1 | Create list container with proper spacing | ✅ 300-500px |
| 4.2.2 | Render history items | ✅ |
| 4.2.3 | Show loading skeleton while fetching | ✅ |
| 4.2.4 | Handle empty state | ✅ |
| 4.2.5 | Implement pagination (load more) | ✅ |
| 4.2.6 | Limit display to 100 items for performance | ✅ |

### Task 4.3: History Item Component
**File:** `src/features/history/components/HistoryItem.tsx`

**Figma Reference:** Individual history row

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 4.3.1 | Create row layout (avatar, name, points, time) | ✅ 300-500px |
| 4.3.2 | Red circle avatar placeholder | ✅ |
| 4.3.3 | Player name display | ✅ |
| 4.3.4 | Points gained display (e.g., "ได้รับ 1,000 คะแนน") | ✅ |
| 4.3.5 | Timestamp formatting (relative or absolute) | ✅ |
| 4.3.6 | Truncate long names on mobile | ✅ 300-500px |

**Figma Accuracy Checklist:**
- [ ] Red circle on left (avatar placeholder)
- [ ] Name: "Test 24xxxxx" format
- [ ] Points: "ได้รับ 1,000 คะแนน 15/02/25 20:00 น."
- [ ] Proper row spacing

### Task 4.4: History Data Fetching
**Files:** `src/features/history/queries/history.queries.ts`, `src/services/history.service.ts`

| Subtask | Description |
|---------|-------------|
| 4.4.1 | Create useGlobalHistory hook with React Query |
| 4.4.2 | Create usePersonalHistory hook |
| 4.4.3 | Create useMyRewards hook |
| 4.4.4 | Implement pagination support |
| 4.4.5 | Cache configuration (staleTime, cacheTime) |

### Task 4.5: Empty State Component
**File:** `src/features/history/components/EmptyState.tsx`

**Figma Reference:** "Home (3)" - empty rewards tab

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 4.5.1 | Create empty state layout | ✅ 300-500px |
| 4.5.2 | Display icon and message | ✅ |
| 4.5.3 | Different messages per tab | ✅ |

**Figma Accuracy Checklist:**
- [ ] "ได้รับรางวัล 1" or similar message
- [ ] Timestamp display

---

## Phase 5: Game Page - Spin Wheel (5 points)

### Task 5.1: Game Page Layout
**File:** `src/app/game/page.tsx`

**Figma Reference:** "Game Spin (Start)", "Game Spin (stop)"

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 5.1.1 | Create page layout with Container | ✅ 300-500px |
| 5.1.2 | Add score display header (คะแนนสะสม 3,500/10,000) | ✅ |
| 5.1.3 | Section for wheel, controls, and back button | ✅ 300-500px |
| 5.1.4 | Fetch player profile for current score | ✅ |
| 5.1.5 | Track daily spin count | ✅ |

### Task 5.2: Spin Wheel Component
**File:** `src/features/game/components/SpinWheel.tsx`

**Figma Reference:** Circular wheel with 4 segments

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 5.2.1 | Create wheel container with aspect-ratio 1:1 | ✅ 300-500px |
| 5.2.2 | Draw wheel using CSS conic-gradient or SVG | ✅ |
| 5.2.3 | Create 4 segments (300, 500, 1000, 3000) | ✅ |
| 5.2.4 | Color each segment (maroon/dark red theme) | ✅ |
| 5.2.5 | Add segment text labels | ✅ |
| 5.2.6 | Create center hub (static, doesn't rotate) | ✅ |
| 5.2.7 | Create pin/pointer at top (static) | ✅ |
| 5.2.8 | Responsive wheel sizing (fit within 300px screen) | ✅ 300-500px |

**Figma Accuracy Checklist:**
- [ ] Dark red/maroon segment colors
- [ ] White text for segment values
- [ ] 4 segments: 300, 500, 1,000, 3,000
- [ ] Gold divider lines between segments
- [ ] Red pin/pointer at top
- [ ] Center does not rotate

### Task 5.3: Wheel Animation
**File:** `src/features/game/hooks/useWheelAnimation.ts`

| Subtask | Description |
|---------|-------------|
| 5.3.1 | Create rotation state with Framer Motion |
| 5.3.2 | Implement spin animation (accelerate phase) |
| 5.3.3 | Implement deceleration to target position |
| 5.3.4 | Calculate target rotation from API result |
| 5.3.5 | Map points to segment degrees |
| 5.3.6 | Add randomness for realistic stop position |
| 5.3.7 | Handle animation completion callback |

**Animation Specs:**
- Duration: 3-4 seconds total
- Easing: easeOut for natural deceleration
- Multiple full rotations before stopping

### Task 5.4: Control Panel Component
**File:** `src/features/game/components/ControlPanel.tsx`

**Figma Reference:** "เริ่มหมุน" / "หยุด" buttons

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 5.4.1 | Create start button ("เริ่มหมุน") | ✅ 300-500px |
| 5.4.2 | Create stop button ("หยุด") - shown while spinning | ✅ 300-500px |
| 5.4.3 | Disable button during API call | ✅ |
| 5.4.4 | Show spinner on button while loading | ✅ |
| 5.4.5 | Disable if daily limit reached | ✅ |
| 5.4.6 | Button state transitions (idle → spinning → stopped) | ✅ |

**Figma Accuracy Checklist:**
- [ ] Gold/yellow button
- [ ] "เริ่มหมุน" text (start state)
- [ ] "หยุด" text (spinning state)
- [ ] Rounded corners
- [ ] Full width on mobile

### Task 5.5: Spin Logic Hook
**File:** `src/features/game/hooks/useSpinLogic.ts`

| Subtask | Description |
|---------|-------------|
| 5.5.1 | Create state machine (IDLE, SPINNING, RESULT) |
| 5.5.2 | Handle spin button click |
| 5.5.3 | Check daily spin limit before spinning |
| 5.5.4 | Call POST /game/spin API |
| 5.5.5 | Trigger wheel animation with result |
| 5.5.6 | Show result modal after animation |
| 5.5.7 | Update player score in store |
| 5.5.8 | Invalidate relevant queries |

### Task 5.6: Result Modal Component
**File:** `src/features/game/components/ResultModal.tsx`

**Figma Reference:** "Modal" with "ได้รับ xxxx คะแนน"

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 5.6.1 | Use Modal base component | ✅ 300-500px |
| 5.6.2 | Display "ได้รับ" title | ✅ |
| 5.6.3 | Display points won (large text) | ✅ |
| 5.6.4 | Display "xxxx คะแนน" format | ✅ |
| 5.6.5 | Add close button ("ปิด") | ✅ |
| 5.6.6 | Celebration animation (optional confetti) | ✅ |
| 5.6.7 | On close: return to idle state | ✅ |

**Figma Accuracy Checklist:**
- [ ] Gold medal/coin icon at top
- [ ] "ได้รับ" heading
- [ ] "xxxx คะแนน" large display
- [ ] "ปิด" gold button

### Task 5.7: Back to Home Button
**File:** `src/app/game/page.tsx`

**Figma Reference:** "กลับหน้าหลัก" button at bottom

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 5.7.1 | Create secondary/outline button | ✅ 300-500px |
| 5.7.2 | Link back to /home | ✅ |
| 5.7.3 | Full width on mobile | ✅ 300-500px |

**Figma Accuracy Checklist:**
- [ ] Text: "กลับหน้าหลัก"
- [ ] Yellow/gold outline style
- [ ] Full width

### Task 5.8: Daily Limit Warning
**File:** `src/features/game/components/DailyLimitWarning.tsx`

| Subtask | Description | Responsive Check |
|---------|-------------|------------------|
| 5.8.1 | Create warning banner | ✅ 300-500px |
| 5.8.2 | Display remaining spins (e.g., "เหลือ 7/10 ครั้ง") | ✅ |
| 5.8.3 | Show alert when limit reached | ✅ |

---

## 📁 Files to Create Summary

### Phase 0 (Setup)
```
src/app/layout.tsx
src/app/providers.tsx
src/styles/globals.css
src/lib/queryClient.ts
src/services/api.ts
src/types/api.types.ts
src/utils/cn.ts
src/utils/formatters.ts
src/utils/constants.ts
tailwind.config.ts
.env.local
```

### Phase 1 (UI Components)
```
src/components/ui/Button.tsx
src/components/ui/Input.tsx
src/components/ui/Modal.tsx
src/components/ui/Badge.tsx
src/components/ui/Tabs.tsx
src/components/ui/Spinner.tsx
src/components/layout/Container.tsx
```

### Phase 2 (Landing)
```
src/app/page.tsx
src/features/auth/components/NicknameForm.tsx
src/features/auth/hooks/useAuth.ts
src/store/playerStore.ts
src/services/player.service.ts
```

### Phase 3 (Home - Score)
```
src/app/home/page.tsx
src/app/home/layout.tsx
src/features/reward/components/ScoreCard.tsx
src/features/reward/components/RewardProgressBar.tsx
src/features/reward/components/CheckpointBadge.tsx
src/features/reward/components/ClaimRewardModal.tsx
src/features/reward/hooks/useClaimReward.ts
src/features/reward/queries/rewards.queries.ts
src/services/reward.service.ts
```

### Phase 4 (Home - History)
```
src/features/history/components/HistoryTabs.tsx
src/features/history/components/HistoryList.tsx
src/features/history/components/HistoryItem.tsx
src/features/history/components/EmptyState.tsx
src/features/history/hooks/useGlobalHistory.ts
src/features/history/hooks/usePersonalHistory.ts
src/features/history/queries/history.queries.ts
src/services/history.service.ts
```

### Phase 5 (Game)
```
src/app/game/page.tsx
src/app/game/layout.tsx
src/features/game/components/SpinWheel.tsx
src/features/game/components/ControlPanel.tsx
src/features/game/components/ResultModal.tsx
src/features/game/components/DailyLimitWarning.tsx
src/features/game/hooks/useSpinLogic.ts
src/features/game/hooks/useWheelAnimation.ts
src/features/game/queries/game.queries.ts
src/services/game.service.ts
src/store/gameStore.ts
```

---

## ✅ Responsive Checklist (300px - 500px)

### Critical Measurements
- [ ] Container max-width: 450px with `mx-auto`
- [ ] Horizontal padding: 16px (`px-4`)
- [ ] Button min-height: 44px (touch target)
- [ ] Input min-height: 44px
- [ ] Font sizes: Base 14-16px, headings scale appropriately
- [ ] Wheel size: ~280px on 320px screen, ~380px on 480px screen

### Testing Viewports
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone X/11/12/13)
- [ ] 390px (iPhone 14)
- [ ] 414px (iPhone Plus)
- [ ] 480px (Small tablet)
- [ ] 500px (Upper boundary)

---

## ✅ Figma Accuracy Checklist

### Color Matching
- [ ] Primary Gold: Exact hex from Figma
- [ ] Secondary Red: Exact hex from Figma
- [ ] Background colors match
- [ ] Text colors match

### Typography
- [ ] Font family: Prompt (Thai) or system fonts
- [ ] Font weights match Figma
- [ ] Font sizes match Figma
- [ ] Line heights match Figma

### Spacing
- [ ] Margins match Figma
- [ ] Paddings match Figma
- [ ] Gap between elements match

### Components
- [ ] Border radius match Figma
- [ ] Shadow/elevation match Figma
- [ ] Icon sizes match Figma
- [ ] Button styles exact match

---

**Document Version:** 1.0
**Created:** January 31, 2026
**Status:** ⏳ AWAITING APPROVAL

> 🚨 **NOTE:** Implementation will NOT begin until explicit approval is given.
