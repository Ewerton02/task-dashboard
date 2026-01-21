import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Clock } from 'lucide-react';
import type { Task, TaskStatus } from '@/types';
import { Badge, Button } from '@/components/ui';
import {
  statusLabels,
  priorityLabels,
  statusVariants,
  priorityVariants,
  formatRelativeDate,
} from '@/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
    },
  },
  exit: { 
    opacity: 0, 
    x: -100,
    transition: { duration: 0.2 },
  },
};

export const TaskCard = memo(
  function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
    const handleEdit = useCallback(() => {
      onEdit(task);
    }, [onEdit, task]);

    const handleDelete = useCallback(() => {
      onDelete(task.id);
    }, [onDelete, task.id]);

    const handleStatusClick = useCallback(() => {
      const statusOrder: TaskStatus[] = ['pending', 'in_progress', 'completed'];
      const currentIndex = statusOrder.indexOf(task.status);
      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
      onStatusChange(task.id, nextStatus);
    }, [onStatusChange, task.id, task.status]);

    return (
      <motion.div
        layout
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={{ scale: 1.01 }}
        className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
            {task.title}
          </h3>
          <Badge variant={priorityVariants[task.priority]}>
            {priorityLabels[task.priority]}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {task.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStatusClick}
              title="Clique para mudar status"
            >
              <Badge variant={statusVariants[task.status]}>
                {statusLabels[task.status]}
              </Badge>
            </motion.button>

            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} />
              {formatRelativeDate(task.updatedAt)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              aria-label="Editar task"
            >
              <Pencil size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              aria-label="Deletar task"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.task.id === nextProps.task.id &&
      prevProps.task.title === nextProps.task.title &&
      prevProps.task.description === nextProps.task.description &&
      prevProps.task.status === nextProps.task.status &&
      prevProps.task.priority === nextProps.task.priority &&
      prevProps.task.updatedAt === nextProps.task.updatedAt
    );
  }
);
