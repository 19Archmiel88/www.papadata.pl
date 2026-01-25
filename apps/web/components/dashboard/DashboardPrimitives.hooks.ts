import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ContextMenuItem, ContextMenuState } from './DashboardPrimitives.types';

/** Hook for Alt key state */
export const useAltPressed = () => {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // AltGraph na części layoutów klawiatury / przeglądarek
      if (e.key === 'Alt' || e.key === 'AltGraph') setIsPressed(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'Alt' || e.key === 'AltGraph') setIsPressed(false);
    };

    const blur = () => setIsPressed(false);
    const vis = () => {
      if (document.visibilityState !== 'visible') setIsPressed(false);
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    document.addEventListener('visibilitychange', vis);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);

  return isPressed;
};

/** Widget Loading simulation hook */
export const useWidgetLoading = (deps: React.DependencyList, minDelay = 300) => {
  const [loading, setLoading] = useState(true);
  const depsRef = useRef<React.DependencyList>(deps);
  const minDelayRef = useRef(minDelay);

  useEffect(() => {
    const depsChanged =
      minDelayRef.current !== minDelay ||
      deps.length !== depsRef.current.length ||
      deps.some((dep, index) => dep !== depsRef.current[index]);

    if (!depsChanged) return;

    depsRef.current = deps;
    minDelayRef.current = minDelay;

    setLoading(true);

    // deterministyczny “jitter”, żeby UI nie migotał różnie na każdym rerenderze
    const jitter = 120;
    const t = window.setTimeout(() => setLoading(false), minDelay + jitter);

    return () => window.clearTimeout(t);
  }, [minDelay, deps]);

  return loading;
};

/** Context Menu logic */
export const useContextMenu = () => {
  const [menu, setMenu] = useState<ContextMenuState>(null);

  const openMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>, items: ContextMenuItem[], label: string) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement | null;
    const rect = target?.getBoundingClientRect?.();
    setMenu({
      x: e.clientX,
      y: e.clientY,
      anchorRect: rect
        ? {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
          }
        : undefined,
      items: (items || []).filter(Boolean),
      label,
    });
  }, []);

  const closeMenu = useCallback(() => setMenu(null), []);

  return { menu, openMenu, closeMenu };
};
