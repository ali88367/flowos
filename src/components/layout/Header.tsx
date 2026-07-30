import { Moon, Plus, Search, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/uiStore';
import { useTheme } from '@/hooks/useTheme';

export function Header() {
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const setQuickAddOpen = useUIStore((s) => s.setQuickAddOpen);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-end gap-2 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur md:px-8">
      <button
        type="button"
        onClick={() => setCommandPaletteOpen(true)}
        className="flex h-9 w-full max-w-[220px] items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium">
          ⌘K
        </kbd>
      </button>

      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <Button size="sm" onClick={() => setQuickAddOpen(true)}>
        <Plus className="h-4 w-4" />
        New Task
      </Button>
    </header>
  );
}
