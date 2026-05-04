import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import { loadTasks, saveTasks } from '../services/taskStorage';
import { generateId } from '../utils/generateId';

interface CreateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  categoryIconKey: string;
}

interface TaskContextData {
  tasks: Task[];
  isLoading: boolean;
  addTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: Partial<CreateTaskInput>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  getTask: (id: string) => Task | undefined;
}

export const TaskContext = createContext<TaskContextData>({} as TaskContextData);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks().then((stored) => {
      setTasks(stored);
      setIsLoading(false);
    });
  }, []);

  const persist = async (updated: Task[]) => {
    setTasks(updated);
    await saveTasks(updated);
  };

  const addTask = async (input: CreateTaskInput): Promise<void> => {
    const now = new Date().toISOString();
    const task: Task = { id: generateId(), ...input, createdAt: now, updatedAt: now };
    await persist([...tasks, task]);
  };

  const updateTask = async (id: string, input: Partial<CreateTaskInput>): Promise<void> => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, ...input, updatedAt: new Date().toISOString() } : t,
    );
    await persist(updated);
  };

  const removeTask = async (id: string): Promise<void> => {
    await persist(tasks.filter((t) => t.id !== id));
  };

  const getTask = (id: string): Task | undefined => tasks.find((t) => t.id === id);

  return (
    <TaskContext.Provider value={{ tasks, isLoading, addTask, updateTask, removeTask, getTask }}>
      {children}
    </TaskContext.Provider>
  );
}
