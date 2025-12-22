# Bolt's Journal

## 2024-05-23 - Initial Exploration
**Learning:** The codebase uses a standard Vite + React setup but imports all pages statically in `router.tsx`, leading to a large initial bundle.
**Action:** Implement route-based code splitting using `React.lazy` and `Suspense` to reduce initial load time.
