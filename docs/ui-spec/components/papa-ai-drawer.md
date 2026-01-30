# Papa AI Drawer — papa-ai-drawer

## Cel i kontekst

- Drawer AI w dashboardzie (chat streaming).

## Wejścia / Preconditions

- Props: `isOpen`, `aiMode`, `draftMessage`, `contextData`.
- Endpoint: `/api/ai/chat` (streaming SSE-like).

## Układ

- Header z logo + view label.
- Chat history + input + CTA send/cancel.
- Warning chips (stale/missing/locked).

## Stany UI

- Default: lista wiadomości.
- Streaming: assistant message `isStreaming` + cancel.
- Error: assistant message z `t.common.error_title`.
- Disabled: aiMode=false (locked chip).
- Focus/Keyboard: input autofocus po otwarciu.

## Interakcje

- Send prompt → POST /api/ai/chat.
- Cancel → abort controller.
- Draft: auto-fill input.

## A11y

- Focus trap + ESC.

## Testy

- Spec: [tests/screens/dashboard-shell.spec.md](../tests/screens/dashboard-shell.spec.md)
- Dodatkowe: test abort streaming.
