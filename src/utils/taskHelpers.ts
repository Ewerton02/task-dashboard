import type { TaskStatus, TaskPriority } from '@/types';
import type { BadgeVariant } from './types';

export const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pendente',
  in_progress: 'Em Progresso',
  completed: 'Concluída',
};

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

export const statusVariants: Record<TaskStatus, BadgeVariant> = {
  pending: 'warning',
  in_progress: 'info',
  completed: 'success',
};

export const priorityVariants: Record<TaskPriority, BadgeVariant> = {
  low: 'default',
  medium: 'warning',
  high: 'danger',
};

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'agora mesmo';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d atrás`;

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
};
