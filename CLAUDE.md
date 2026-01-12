# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev           # Start dev server (localhost:3000)
npm run build         # Production build
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run type-check    # TypeScript type checking
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run ci            # Full CI pipeline (type-check → lint → build)
```

## Pre-push Hook

When ollama is running locally, `git push` triggers automatic CI checks before pushing. The hook runs `npm run ci` and blocks push on failure.

## Architecture Overview

**Stack**: Next.js 16.1.1 (App Router) + TypeScript 5 + TailwindCSS 4

### Component Architecture (Atomic Design)

```
src/components/
├── atoms/       # Button, Input, Avatar, Badge, ThemeToggle
├── molecules/   # (Complex components - ready for use)
├── organisms/   # Header, Sidebar, BottomNav
└── templates/   # MainLayout
```

All component directories use barrel exports via `index.ts`.

### State Management

- **Theme**: React Context (`src/contexts/ThemeContext.tsx`) with `useTheme()` hook
- **Server State**: `@tanstack/react-query` (installed, ready for integration)
- **Client State**: `zustand` (installed, ready for integration)

### Styling

CSS variables define the design system in `src/app/globals.css`:
- Theme switching via `data-theme` attribute on `<html>`
- Path alias: `@/*` maps to `./src/*`

### Utilities

`src/lib/utils.ts` provides:
- `cn()` - class name merging
- `formatRelativeTime()` - Korean relative time (방금 전, 5분 전, etc.)
- `formatNumber()` - Korean number formatting (천/만/억)
- `truncate()`, `getInitials()`, `debounce()`

## Testing

```bash
npm run test -- src/lib/utils.test.ts    # Run single test file
npm run test:coverage                     # Generate coverage report
```

Uses Vitest with `@testing-library/react` and jsdom environment.

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):
1. Setup (cache dependencies)
2. Parallel: Lint + Test + Audit
3. Build
4. Deploy to Jenkins (main branch only, requires secrets)

## Key Patterns

- Korean language throughout UI and utilities
- Mobile-first responsive design (breakpoints: 640px, 1024px, 1280px)
- Polymorphic Button component with variants: `primary`, `secondary`, `ghost`, `danger`
- Theme modes: `light`, `dark`, `system` with localStorage persistence
