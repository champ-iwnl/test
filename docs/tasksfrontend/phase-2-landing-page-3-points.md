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
