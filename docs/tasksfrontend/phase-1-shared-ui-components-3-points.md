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
