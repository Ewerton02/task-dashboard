// Tipos principais do projeto

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  priority: TaskPriority;
}

export interface UpdateTaskDTO {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

// Filtros
export type FilterStatus = 'all' | TaskStatus;

export interface TaskFilters {
  status: FilterStatus;
  search: string;
  priority: TaskPriority | 'all';
}
