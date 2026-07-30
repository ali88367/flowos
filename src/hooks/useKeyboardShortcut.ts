import { useEffect } from 'react';

interface ShortcutOptions {
  key: string;
  meta?: boolean;
  handler: (e: KeyboardEvent) => void;
  enabled?: boolean;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    target.isContentEditable ||
    tag === 'SELECT'
  );
}

/**
 * Registers a single global keyboard shortcut. Plain letter shortcuts are
 * ignored while the user is typing in an input/textarea; meta-combo
 * shortcuts (e.g. Cmd/Ctrl+K) always fire.
 */
export function useKeyboardShortcut({ key, meta, handler, enabled = true }: ShortcutOptions) {
  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(e: KeyboardEvent) {
      const metaPressed = e.metaKey || e.ctrlKey;
      if (meta && !metaPressed) return;
      if (!meta && metaPressed) return;
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      if (!meta && isTypingTarget(e.target)) return;

      e.preventDefault();
      handler(e);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key, meta, handler, enabled]);
}
