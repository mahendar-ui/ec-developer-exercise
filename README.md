# Task Manager

A simple task management web application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Display a list of tasks from initial data
- Add new tasks
- Mark tasks as completed/incomplete via checkbox
- Filter tasks by All, Completed, and Pending
- Display total task count and completed count
- Tasks persist in localStorage across page reloads

## How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling

## Accessibility (WCAG)

- Labels associated with all form inputs (`<label htmlFor>` on text input and checkboxes)
- `aria-live="polite"` on task count so screen readers announce changes
- Filter buttons use `aria-pressed` to convey toggle state
- Filter group wrapped with `role="group"` and `aria-label`
- Checkbox `aria-label` describes the action (e.g. Mark "Fix homepage bug" as completed)
- `focus-visible` ring on all interactive elements for keyboard navigation

## Decisions

- **localStorage persistence**: Tasks are saved to `localStorage` on every change and loaded on mount. Default data is used as a fallback on first visit. State initializes with defaults to avoid SSR hydration mismatches, then syncs from storage in a `useEffect`.
- **Derived filtering**: Rather than storing filtered tasks in separate state, `filteredTasks` is derived from `tasks` and `filter` on each render. This avoids sync issues between the full list and the filtered view.
- **Minimal dependencies**: Only the default Next.js + Tailwind stack is used. No additional libraries were added.
- **Types co-located**: The `Task` interface and `Filter` type are defined in the page component to keep things simple for a single-page app.

## Future Improvements

- **Delete tasks**: Allow users to remove tasks from the list.
- **Edit task titles**: Inline editing to rename existing tasks.
- **Drag and drop reordering**: Let users prioritize tasks by dragging them.
- **Server-side persistence**: Replace localStorage with a database (e.g. Postgres) and API routes for multi-device sync.
- **Optimistic updates**: Show changes immediately while syncing with a backend.
- **Unit and integration tests**: Add tests with React Testing Library and Playwright for coverage.
