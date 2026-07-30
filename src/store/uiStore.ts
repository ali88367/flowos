import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface UIState {
  sidebarCollapsed: boolean;
  theme: Theme;
  commandPaletteOpen: boolean;
  quickAddOpen: boolean;
  newProjectOpen: boolean;
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setQuickAddOpen: (open: boolean) => void;
  setNewProjectOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'dark',
      commandPaletteOpen: false,
      quickAddOpen: false,
      newProjectOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setQuickAddOpen: (open) => set({ quickAddOpen: open }),
      setNewProjectOpen: (open) => set({ newProjectOpen: open }),
    }),
    {
      name: 'flowos:ui',
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed, theme: s.theme }),
    },
  ),
);
