import { motion } from 'framer-motion';
import { greeting, formatFullDate } from '@/utils/date';

export function GreetingHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <p className="text-sm text-muted-foreground">{formatFullDate()}</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">{greeting()}</h1>
    </motion.div>
  );
}
