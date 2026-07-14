import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ===== CONFIGURAÇÃO DE CAMINHO =====
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, 'db.json');

// ===== ESTADO EM MEMÓRIA =====
let tasks = [];
let loaded = false;

// ===== PERSISTÊNCIA EM ARQUIVO =====
// Guarda os dados em um JSON local para sobreviver a restarts do servidor.
// Pode ser trocado por MongoDB no futuro sem alterar as rotas — basta
// reimplementar as funções deste módulo mantendo a mesma assinatura.
async function ensureLoaded() {
  if (loaded) return;
  if (existsSync(DB_FILE)) {
    try {
      const raw = await readFile(DB_FILE, 'utf-8');
      tasks = JSON.parse(raw);
    } catch (err) {
      console.error('Falha ao ler db.json, iniciando lista vazia:', err.message);
      tasks = [];
    }
  }
  loaded = true;
}

async function persist() {
  await writeFile(DB_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

// ===== OPERAÇÕES CRUD =====
export async function listTasks() {
  await ensureLoaded();
  return tasks;
}

export async function getTask(id) {
  await ensureLoaded();
  return tasks.find(t => t.id === id) || null;
}

export async function createTask({ name, assignedTo = '', description = '' }) {
  await ensureLoaded();
  const now = new Date().toISOString();
  const task = {
    id: randomUUID(),
    name,
    assignedTo,
    description,
    completed: false,
    createdAt: now,
    updatedAt: now
  };
  tasks.push(task);
  await persist();
  return task;
}

export async function updateTask(id, updates) {
  await ensureLoaded();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;

  tasks[index] = {
    ...tasks[index],
    ...updates,
    id: tasks[index].id, // id nunca muda
    updatedAt: new Date().toISOString()
  };
  await persist();
  return tasks[index];
}

export async function deleteTask(id) {
  await ensureLoaded();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  await persist();
  return true;
}

export async function replaceAllTasks(newTasks) {
  await ensureLoaded();
  tasks = newTasks.map(t => ({
    id: t.id || randomUUID(),
    name: t.name || t.title || 'Sem título',
    assignedTo: t.assignedTo || t.responsible || '',
    description: t.description || '',
    completed: Boolean(t.completed || t.status === 'done'),
    createdAt: t.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  await persist();
  return tasks;
}

export async function clearTasks() {
  await ensureLoaded();
  tasks = [];
  await persist();
}
