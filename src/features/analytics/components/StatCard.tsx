import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}

export function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Card>
        <CardContent className="p-5">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Icon className="h-4 w-4" strokeWidth={2} />
          </div>
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
          {hint && <p className="mt-1 text-[11px] text-muted-foreground/70">{hint}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}
