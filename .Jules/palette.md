## 2025-05-13 - Context-Dependent ARIA Roles

**Learning:** Hardcoding context-dependent roles like `listitem` in reusable components creates accessibility errors (orphaned list items) when those components are used in isolation.
**Action:** Default to generic roles (or no role) for reusable components, and allow the parent context or specific implementations to inject stricter semantic roles (like `listitem` or `tab`) via props.
