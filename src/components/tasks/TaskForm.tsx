import { memo, useState, useEffect, useCallback, type FormEvent } from 'react';
import type { Task, CreateTaskDTO } from '@/types';
import { Button, Input, Select } from '@/components/ui';
import { useCreateTask, useUpdateTask } from '@/hooks';

interface TaskFormProps {
  task?: Task | null;
  onSuccess: () => void;
}

const priorityOptions = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
];

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_progress', label: 'Em Progresso' },
  { value: 'completed', label: 'Concluída' },
];

export const TaskForm = memo(function TaskForm({ task, onSuccess }: TaskFormProps) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const isEditing = !!task;
  const isLoading = createTask.isPending || updateTask.isPending;

  const [formData, setFormData] = useState<CreateTaskDTO>({
    title: '',
    description: '',
    priority: 'medium',
  });
  const [status, setStatus] = useState<string>('pending');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
      });
      setStatus(task.status);
    } else {
      // Reset para criação
      setFormData({ title: '', description: '', priority: 'medium' });
      setStatus('pending');
    }
    setErrors({});
  }, [task]);

  const handleChange = useCallback(
    (field: keyof CreateTaskDTO) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Limpa erro do campo
        if (errors[field]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        }
      },
    [errors]
  );

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Título deve ter pelo menos 3 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!validate()) return;

      try {
        if (isEditing && task) {
          await updateTask.mutateAsync({
            id: task.id,
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            status: status as Task['status'],
          });
        } else {
          await createTask.mutateAsync(formData);
        }
        onSuccess();
      } catch (error) {
        console.error('Erro ao salvar task:', error);
      }
    },
    [validate, isEditing, task, formData, status, updateTask, createTask, onSuccess]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Título"
        placeholder="Ex: Implementar feature X"
        value={formData.title}
        onChange={handleChange('title')}
        error={errors.title}
        autoFocus
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descrição
        </label>
        <textarea
          placeholder="Descreva a tarefa..."
          value={formData.description}
          onChange={handleChange('description')}
          rows={3}
          className={`
            w-full px-3 py-2
            bg-white dark:bg-gray-800
            border rounded-lg
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            resize-none
            ${errors.description
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
            }
          `}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Prioridade"
          value={formData.priority}
          onChange={handleChange('priority')}
          options={priorityOptions}
        />

        {isEditing && (
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions}
          />
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? 'Salvar alterações' : 'Criar tarefa'}
        </Button>
      </div>
    </form>
  );
});
