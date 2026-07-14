import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import ProgressCard from './components/ProgressCard';
import TaskTable from './components/TaskTable';
import ImportExportPanel from './components/ImportExportPanel';
import { useTasks } from './hooks/useTasks';
import type { Task } from './types/task';

function App() {
  const { tasks, loading, error, online, addTask, editTask, toggleTask, removeTask, clearAll, importTasks } =
    useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleSubmit = async (draft: { name: string; assignedTo: string; description: string }) => {
    if (editingTask) {
      await editTask(editingTask.id, draft);
      setEditingTask(null);
    } else {
      await addTask(draft);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remover tarefa?')) {
      await removeTask(id);
      if (editingTask?.id === id) setEditingTask(null);
    }
  };

  return (
    <div className="shell">
      <Header online={online} loading={loading} />

      {error && <div className="banner error">{error}</div>}

      <div className="grid">
        <div>
          <TaskForm editingTask={editingTask} onSubmit={handleSubmit} onCancelEdit={() => setEditingTask(null)} />
          <ImportExportPanel tasks={tasks} onImport={importTasks} onClearAll={clearAll} />
        </div>

        <div>
          <ProgressCard tasks={tasks} />
          <div className="card">
            <div className="card-head">
              <strong>Tarefas</strong>
              <span className="hint">Duplo clique para editar</span>
            </div>
            <TaskTable tasks={tasks} onToggle={toggleTask} onEdit={setEditingTask} onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
