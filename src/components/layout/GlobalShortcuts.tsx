import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useUIStore } from '@/store/uiStore';

export function GlobalShortcuts() {
  const navigate = useNavigate();
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const setQuickAddOpen = useUIStore((s) => s.setQuickAddOpen);
  const setNewProjectOpen = useUIStore((s) => s.setNewProjectOpen);

  useKeyboardShortcut({ key: 'k', meta: true, handler: () => setCommandPaletteOpen(true) });
  useKeyboardShortcut({ key: 'n', handler: () => setQuickAddOpen(true) });
  useKeyboardShortcut({ key: 'p', handler: () => setNewProjectOpen(true) });
  useKeyboardShortcut({ key: 'd', handler: () => navigate('/') });

  return null;
}
