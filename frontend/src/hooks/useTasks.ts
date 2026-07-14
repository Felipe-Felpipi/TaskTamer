import { useCallback, useEffect, useState } from 'react';
import type { Task, TaskDraft } from '../types/task';
import * as tasksApi from '../api/tasksApi';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await tasksApi.fetchTasks();
      setTasks(data);
      setOnline(true);
    } catch {
      setOnline(false);
      setError('Não foi possível conectar à API. Verifique se o backend está rodando em ' +
        (import.meta.env.VITE_API_URL || 'http://localhost:3333/api') + '.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTask = useCallback(async (draft: TaskDraft) => {
    const task = await tasksApi.createTask(draft);
    setTasks(prev => [...prev, task]);
  }, []);

  const editTask = useCallback(async (id: string, draft: TaskDraft) => {
    const task = await tasksApi.updateTask(id, draft);
    setTasks(prev => prev.map(t => (t.id === id ? task : t)));
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    const task = await tasksApi.toggleTask(id);
    setTasks(prev => prev.map(t => (t.id === id ? task : t)));
  }, []);

  const removeTask = useCallback(async (id: string) => {
    await tasksApi.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(async () => {
    await tasksApi.clearAllTasks();
    setTasks([]);
  }, []);

  const importTasks = useCallback(async (incoming: Task[]) => {
    const data = await tasksApi.importTasks(incoming);
    setTasks(data);
  }, []);

  return {
    tasks,
    loading,
    error,
    online,
    refresh,
    addTask,
    editTask,
    toggleTask,
    removeTask,
    clearAll,
    importTasks
  };
}
