# FlowOS

A premium personal productivity OS — Dashboard, Tasks, Projects, Daily Log, and Analytics in one fast, minimal interface.

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · Radix primitives · Framer Motion · Zustand · TanStack Query · React Router

## Getting started

```bash
npm install
npm run dev
```

## Architecture

- `src/services/db` — storage-agnostic `CollectionAdapter<T>` interface. `localStorageAdapter.ts` is the current implementation; swap in a Supabase-backed adapter later without touching any feature code.
- `src/services` — domain services (tasks, projects, daily logs) built on top of the adapters.
- `src/hooks` — TanStack Query hooks wrapping the services, with optimistic updates.
- `src/store` — Zustand stores for UI state (sidebar, theme, dialogs, toasts).
- `src/features/*` — one folder per product area (dashboard, tasks, projects, daily-log, analytics, settings), each self-contained. New areas (CRM, invoices, calendar, pomodoro, finance, goals, documents) can be added the same way without touching existing ones.
- `src/components/ui` — shared design-system primitives (button, card, dialog, command palette, etc.).

## Keyboard shortcuts

`N` new task · `P` new project · `D` dashboard · `⌘/Ctrl K` search · `Esc` close dialogs

## Data

Everything is stored locally in the browser (`localStorage`). Export/import/clear from Settings.
