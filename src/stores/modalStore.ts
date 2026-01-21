import { create } from 'zustand';
import type { Task } from '@/types';

interface ModalState {
  isOpen: boolean;
  editingTask: Task | null;
  openModal: (task?: Task) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  isOpen: false,
  editingTask: null,

  openModal: (task) =>
    set(() => ({
      isOpen: true,
      editingTask: task ?? null,
    })),

  closeModal: () =>
    set(() => ({
      isOpen: false,
      editingTask: null,
    })),
}));
