import axios from 'axios';
import type { Task, TaskDraft } from '../types/task';

// ===== CONFIGURAÇÃO DO CLIENTE HTTP =====
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// ===== ENDPOINTS DE TAREFAS =====
export async function fetchTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks');
  return data;
}

export async function createTask(draft: TaskDraft): Promise<Task> {
  const { data } = await api.post<Task>('/tasks', draft);
  return data;
}

export async function updateTask(id: string, updates: Partial<TaskDraft & { completed: boolean }>): Promise<Task> {
  const { data } = await api.put<Task>(`/tasks/${id}`, updates);
  return data;
}

export async function toggleTask(id: string): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${id}/toggle`);
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

export async function clearAllTasks(): Promise<void> {
  await api.delete('/tasks');
}

export async function importTasks(tasks: Task[]): Promise<Task[]> {
  const { data } = await api.post<Task[]>('/tasks/import', { tasks });
  return data;
}

export async function checkHealth(): Promise<boolean> {
  try {
    await api.get('/health');
    return true;
  } catch {
    return false;
  }
}
