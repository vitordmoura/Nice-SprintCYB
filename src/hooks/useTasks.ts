import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { TaskStatus } from '../types/task';

export function useTasks(filter?: TaskStatus | 'todas') {
  const ctx = useContext(TaskContext);

  const filtered =
    !filter || filter === 'todas'
      ? ctx.tasks
      : ctx.tasks.filter((t) => t.status === filter);

  const counts = {
    total: ctx.tasks.length,
    pendente: ctx.tasks.filter((t) => t.status === 'pendente').length,
    em_andamento: ctx.tasks.filter((t) => t.status === 'em_andamento').length,
    concluida: ctx.tasks.filter((t) => t.status === 'concluida').length,
  };

  return { ...ctx, filtered, counts };
}
