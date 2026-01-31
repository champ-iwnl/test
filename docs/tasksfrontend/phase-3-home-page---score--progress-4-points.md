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
