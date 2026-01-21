import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { CreateTaskDTO, UpdateTaskDTO, Task } from '@/types';

export const taskKeys = {
  all: ['tasks'] as const,
  detail: (id: string) => ['tasks', id] as const,
};

export const useTasks = () => {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: api.getTasks,
    staleTime: 1000 * 60 * 5, 
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => api.getTaskById(id),
    enabled: !!id, // Só executa se tiver ID
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDTO) => api.createTask(data),
    onSuccess: (newTask) => {
      // Atualiza cache de forma otimista (imutável)
      queryClient.setQueryData<Task[]>(taskKeys.all, (old) => {
        if (!old) return [newTask];
        return [newTask, ...old];
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTaskDTO) => api.updateTask(data),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<Task[]>(taskKeys.all, (old) => {
        if (!old) return [updatedTask];
        return old.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
      });
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteTask(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.all);
      queryClient.setQueryData<Task[]>(taskKeys.all, (old) =>
        old?.filter((task) => task.id !== deletedId) ?? []
      );

      return { previousTasks };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.all, context.previousTasks);
      }
    },
  });
};
