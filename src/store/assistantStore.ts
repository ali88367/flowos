import { create } from 'zustand';
import { generateId } from '@/utils/id';
import type { AssistantMessage } from '@/features/assistant/types';

const WELCOME: AssistantMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hi — I can add, complete, or delete tasks and projects, and answer questions about your data. Try "add task buy milk tomorrow" or "what\'s due today".',
  createdAt: new Date().toISOString(),
};

interface AssistantState {
  open: boolean;
  messages: AssistantMessage[];
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  addMessage: (role: AssistantMessage['role'], text: string) => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  open: false,
  messages: [WELCOME],
  setOpen: (open) => set({ open }),
  toggleOpen: () => set((s) => ({ open: !s.open })),
  addMessage: (role, text) =>
    set((s) => ({
      messages: [...s.messages, { id: generateId(), role, text, createdAt: new Date().toISOString() }],
    })),
}));
