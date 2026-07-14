import { Router } from 'express';
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  replaceAllTasks,
  clearTasks
} from '../data/store.js';

const router = Router();

// ===== GET /api/tasks — lista todas as tarefas =====
router.get('/', async (_req, res, next) => {
  try {
    const tasks = await listTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// ===== GET /api/tasks/:id — busca uma tarefa =====
router.get('/:id', async (req, res, next) => {
  try {
    const task = await getTask(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// ===== POST /api/tasks — cria uma tarefa =====
router.post('/', async (req, res, next) => {
  try {
    const { name, assignedTo, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'O campo "name" é obrigatório' });
    }
    const task = await createTask({ name: name.trim(), assignedTo, description });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// ===== PUT /api/tasks/:id — atualiza uma tarefa =====
router.put('/:id', async (req, res, next) => {
  try {
    const { name, assignedTo, description, completed } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;

    const task = await updateTask(req.params.id, updates);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// ===== PATCH /api/tasks/:id/toggle — alterna status concluído =====
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const current = await getTask(req.params.id);
    if (!current) return res.status(404).json({ error: 'Tarefa não encontrada' });
    const task = await updateTask(req.params.id, { completed: !current.completed });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// ===== DELETE /api/tasks/:id — remove uma tarefa =====
router.delete('/:id', async (req, res, next) => {
  try {
    const removed = await deleteTask(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// ===== DELETE /api/tasks — limpa todas as tarefas =====
router.delete('/', async (_req, res, next) => {
  try {
    await clearTasks();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// ===== POST /api/tasks/import — importa um arquivo .tasktamer/JSON =====
router.post('/import', async (req, res, next) => {
  try {
    const payload = req.body;
    const incoming = Array.isArray(payload) ? payload : payload.tasks;
    if (!Array.isArray(incoming)) {
      return res.status(400).json({ error: 'Formato inválido: esperado um array de tarefas' });
    }
    const tasks = await replaceAllTasks(incoming);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

export default router;
