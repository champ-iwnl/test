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
