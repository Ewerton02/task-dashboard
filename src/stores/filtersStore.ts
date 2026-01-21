import { create } from 'zustand';
import type { FilterStatus, TaskFilters, TaskPriority } from '@/types';

interface FiltersState {
  filters: TaskFilters;
  setStatusFilter: (status: FilterStatus) => void;
  setSearchFilter: (search: string) => void;
  setPriorityFilter: (priority: TaskPriority | 'all') => void;
  resetFilters: () => void;
}

const initialFilters: TaskFilters = {
  status: 'all',
  search: '',
  priority: 'all',
};

export const useFiltersStore = create<FiltersState>()((set) => ({
  filters: initialFilters,

  setStatusFilter: (status) =>
    set((state) => ({
      filters: { ...state.filters, status },
    })),

  setSearchFilter: (search) =>
    set((state) => ({
      filters: { ...state.filters, search },
    })),

  setPriorityFilter: (priority) =>
    set((state) => ({
      filters: { ...state.filters, priority },
    })),

  resetFilters: () =>
    set(() => ({
      filters: { ...initialFilters },
    })),
}));
