import { memo, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import type { Task, TaskStatus } from '@/types';
import { useFiltersStore, useModalStore } from '@/stores';
import { useUpdateTask, useDeleteTask } from '@/hooks';
import { TaskCard } from './TaskCard';
import { TaskCardSkeleton } from '@/components/ui';

interface TaskListProps {
  tasks: Task[] | undefined;
  isLoading: boolean;
}

export const TaskList = memo(function TaskList({ tasks, isLoading }: TaskListProps) {
  const { filters } = useFiltersStore();
  const { openModal } = useModalStore();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter((task) => {
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }

      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDesc = task.description.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, filters]);

  const handleEdit = useCallback(
    (task: Task) => {
      openModal(task);
    },
    [openModal]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
        deleteTask.mutate(id);
      }
    },
    [deleteTask]
  );

  const handleStatusChange = useCallback(
    (id: string, status: TaskStatus) => {
      updateTask.mutate({ id, status });
    },
    [updateTask]
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <Inbox size={48} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          {tasks && tasks.length > 0
            ? 'Tente ajustar os filtros para ver mais resultados.'
            : 'Comece criando sua primeira tarefa clicando no botão acima.'}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});
