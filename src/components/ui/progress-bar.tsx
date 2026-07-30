import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  className?: string;
  barClassName?: string;
}

export function ProgressBar({ value, className, barClassName }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}>
      <motion.div
        className={cn('h-full rounded-full bg-accent', barClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
