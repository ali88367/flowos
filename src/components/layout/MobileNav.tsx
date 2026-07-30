import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { NAV_ITEMS } from './nav-items';

const MOBILE_LABEL: Record<string, string> = {
  'Daily Log': 'Log',
  Analytics: 'Stats',
};

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-card/95 px-0.5 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
              isActive ? 'text-accent' : 'text-muted-foreground',
            )
          }
        >
          <item.icon className="h-5 w-5" strokeWidth={2} />
          {MOBILE_LABEL[item.label] ?? item.label}
        </NavLink>
      ))}
    </nav>
  );
}
