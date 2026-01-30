/**
 * apps/web/hooks/useFocusTrap.ts
 *
 * Focus trap dla modali:
 * - Zapamiętuje poprzednio aktywny element i przywraca fokus po zamknięciu.
 * - Pętla TAB/Shift+TAB w obrębie kontenera.
 * - Ustawia fokus na pierwszy focusable element, a jeśli brak — na sam kontener.
 */

import { useEffect, useRef, useCallback } from 'react';

const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusable(container: HTMLElement): HTMLElement[] {
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));

  return nodes.filter((el) => {
    if (el.hasAttribute('disabled')) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;

    const rect = el.getBoundingClientRect();
    // Minimalny filtr: wyrzucamy totalne "0x0", ale nie opieramy się na offsetParent.
    if (rect.width === 0 && rect.height === 0) return false;

    return true;
  });
}

export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive) return;
      const container = containerRef.current;
      if (!container) return;

      // ESC obsługuje ModalContainer (tu nie przechwytujemy).
      if (e.key === 'Escape') return;

      if (e.key !== 'Tab') return;

      const focusableElements = getFocusable(container);
      if (focusableElements.length === 0) {
        e.preventDefault();
        container.focus?.();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!active || !container.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [isActive]
  );

  useEffect(() => {
    if (!isActive) return;

    previousActiveElement.current = (document.activeElement as HTMLElement | null) ?? null;

    const container = containerRef.current;

    document.addEventListener('keydown', handleKeyDown, true);

    const raf = requestAnimationFrame(() => {
      if (!container) return;

      const focusable = getFocusable(container);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        container.focus?.();
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      cancelAnimationFrame(raf);

      // Restore focus: unikamy "skoku" przy nested modalach (stack)
      const prev = previousActiveElement.current;
      previousActiveElement.current = null;

      const active = document.activeElement as HTMLElement | null;

      // Jeśli fokus już jest w innym otwartym dialogu / na elemencie interaktywnym — nie nadpisujemy.
      // Przywracamy tylko jeśli:
      // - aktywny element to body/null
      // - albo fokus był w kontenerze, który właśnie się zamyka
      const shouldRestore =
        !active || active === document.body || (container && active && container.contains(active));

      if (shouldRestore) {
        prev?.focus?.();
      }
    };
  }, [isActive, handleKeyDown]);

  return containerRef;
};
export default useFocusTrap;
