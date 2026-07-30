import { Download, Moon, Sun, Trash2, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/hooks/useTheme';
import { toast } from '@/store/toastStore';
import { cn } from '@/utils/cn';

const SHORTCUTS: Array<{ keys: string; description: string }> = [
  { keys: 'N', description: 'New task' },
  { keys: 'P', description: 'New project' },
  { keys: 'D', description: 'Go to dashboard' },
  { keys: '⌘ / Ctrl + K', description: 'Open search' },
  { keys: 'Esc', description: 'Close dialogs' },
  { keys: '↑ / ↓', description: 'Navigate lists' },
  { keys: 'Space', description: 'Complete selected task' },
];

const DATA_KEYS = ['flowos:tasks', 'flowos:projects', 'flowos:daily-logs'];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  function handleExport() {
    const payload = Object.fromEntries(
      DATA_KEYS.map((key) => [key, JSON.parse(localStorage.getItem(key) ?? '[]')]),
    );
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowos-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Export ready', description: 'Your data has been downloaded.' });
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        for (const key of DATA_KEYS) {
          if (data[key]) localStorage.setItem(key, JSON.stringify(data[key]));
        }
        toast({ title: 'Import complete', description: 'Reloading to apply changes…' });
        setTimeout(() => window.location.reload(), 800);
      } catch {
        toast({ title: 'Import failed', description: 'That file could not be read.', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleClear() {
    if (!window.confirm('This will permanently delete all tasks, projects, and daily logs. Continue?')) return;
    for (const key of DATA_KEYS) localStorage.removeItem(key);
    localStorage.removeItem('flowos:seeded');
    toast({ title: 'Data cleared', description: 'Reloading…' });
    setTimeout(() => window.location.reload(), 600);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how FlowOS looks on this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  'flex flex-1 flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm font-medium transition-colors',
                  theme === t ? 'border-accent bg-accent-soft text-accent' : 'border-border hover:bg-muted',
                )}
              >
                {t === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {t === 'dark' ? 'Dark' : 'Light'}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
          <CardDescription>Everything is stored locally on this device.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" />
              Export data
            </Button>
            <Button variant="outline" size="sm" asChild>
              <label className="cursor-pointer">
                <Upload className="h-3.5 w-3.5" />
                Import data
                <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
              </label>
            </Button>
          </div>
          <Separator />
          <Button variant="destructive" size="sm" onClick={handleClear}>
            <Trash2 className="h-3.5 w-3.5" />
            Clear all data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {SHORTCUTS.map((s) => (
              <li key={s.keys} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-muted-foreground">{s.description}</span>
                <kbd className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium">
                  {s.keys}
                </kbd>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
