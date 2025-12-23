## 2024-05-24 - Support Form Interaction
**Learning:** Adding immediate visual feedback to form submissions is critical for user confidence, especially in demo environments where backend latency isn't real.
**Action:** When creating forms, always implement a loading state and a success confirmation, even if simulated. Use `aria-live` regions or `aria-disabled` states to communicate these changes to screen readers.
