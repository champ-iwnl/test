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
