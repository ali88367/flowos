import { create } from 'zustand';
import { generateId } from '@/utils/id';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

interface ToastState {
  toasts: ToastItem[];
  toast: (item: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  toast: (item) =>
    set((s) => ({ toasts: [...s.toasts, { ...item, id: generateId() }] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = (item: Omit<ToastItem, 'id'>) => useToastStore.getState().toast(item);
