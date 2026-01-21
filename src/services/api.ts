import type { Task, CreateTaskDTO, UpdateTaskDTO } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let tasks: Task[] = [];

const generateId = () => Math.random().toString(36).substring(2, 11);

export const api = {
  getTasks: async (): Promise<Task[]> => {
    await delay(800); 
    return [...tasks].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  getTaskById: async (id: string): Promise<Task | null> => {
    await delay(300);
    const task = tasks.find((t) => t.id === id);
    return task ? { ...task } : null;
  },

  createTask: async (data: CreateTaskDTO): Promise<Task> => {
    await delay(500);
    const now = new Date().toISOString();
    const newTask: Task = {
      id: generateId(),
      title: data.title,
      description: data.description,
      status: 'pending',
      priority: data.priority,
      createdAt: now,
      updatedAt: now,
    };
    tasks = [...tasks, newTask];
    return { ...newTask };
  },

  updateTask: async (data: UpdateTaskDTO): Promise<Task> => {
    await delay(400);
    const index = tasks.findIndex((t) => t.id === data.id);
    if (index === -1) {
      throw new Error('Task não encontrada');
    }

    const updatedTask: Task = {
      ...tasks[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    tasks = tasks.map((t) => (t.id === data.id ? updatedTask : t));

    return { ...updatedTask };
  },

  deleteTask: async (id: string): Promise<void> => {
    await delay(300);
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Task não encontrada');
    }
     tasks = tasks.filter((t) => t.id !== id);
  },
};
