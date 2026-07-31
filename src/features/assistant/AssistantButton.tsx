import { Sparkles, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAssistantStore } from '@/store/assistantStore';
import { cn } from '@/utils/cn';

export function AssistantButton() {
  const open = useAssistantStore((s) => s.open);
  const toggleOpen = useAssistantStore((s) => s.toggleOpen);

  return (
    <motion.button
      type="button"
      onClick={toggleOpen}
      whileTap={{ scale: 0.94 }}
      className={cn(
        'fixed right-5 bottom-20 md:bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-shadow hover:shadow-xl',
      )}
      aria-label={open ? 'Close assistant' : 'Ask FlowOS'}
    >
      {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
    </motion.button>
  );
}
