import { memo, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Filter } from 'lucide-react';
import { useFiltersStore } from '@/stores';
import { Button, Select } from '@/components/ui';
import type { FilterStatus, TaskPriority } from '@/types';

const statusOptions = [
  { value: 'all', label: 'Todos os status' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'in_progress', label: 'Em Progresso' },
  { value: 'completed', label: 'Concluídas' },
];

const priorityOptions = [
  { value: 'all', label: 'Todas as prioridades' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' },
];

export const TaskFilters = memo(function TaskFilters() {
  const { filters, setStatusFilter, setSearchFilter, setPriorityFilter, resetFilters } =
    useFiltersStore();

  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchFilter(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, setSearchFilter]);

  useEffect(() => {
    if (filters.search !== searchInput && filters.search === '') {
      setSearchInput('');
    }
  }, [filters.search]);

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value as FilterStatus);
    },
    [setStatusFilter]
  );

  const handlePriorityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPriorityFilter(e.target.value as TaskPriority | 'all');
    },
    [setPriorityFilter]
  );

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setSearchFilter('');
  }, [setSearchFilter]);

  const hasActiveFilters =
    filters.status !== 'all' || filters.priority !== 'all' || filters.search !== '';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
    >
      {/* Campo de busca */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Buscar tarefa..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {searchInput && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <Select
          value={filters.status}
          onChange={handleStatusChange}
          options={statusOptions}
          className="min-w-[160px]"
        />

        <Select
          value={filters.priority}
          onChange={handlePriorityChange}
          options={priorityOptions}
          className="min-w-[160px]"
        />

        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              variant="ghost"
              onClick={resetFilters}
              leftIcon={<Filter size={16} />}
              title="Limpar filtros"
            >
              Limpar
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});
