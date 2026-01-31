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
