import { useEffect, useState } from 'react';
import type { Task, TaskDraft } from '../types/task';

interface TaskFormProps {
  editingTask: Task | null;
  onSubmit: (draft: TaskDraft) => Promise<void>;
  onCancelEdit: () => void;
}

const EMPTY_DRAFT: TaskDraft = { name: '', assignedTo: '', description: '' };

export default function TaskForm({ editingTask, onSubmit, onCancelEdit }: TaskFormProps) {
  const [draft, setDraft] = useState<TaskDraft>(EMPTY_DRAFT);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setDraft({
        name: editingTask.name,
        assignedTo: editingTask.assignedTo,
        description: editingTask.description
      });
    } else {
      setDraft(EMPTY_DRAFT);
    }
  }, [editingTask]);

  const handleChange = (field: keyof TaskDraft) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDraft(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!draft.name.trim()) {
      alert('Título é obrigatório');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(draft);
      if (!editingTask) setDraft(EMPTY_DRAFT);
    } catch {
      alert('Não foi possível salvar a tarefa. Confira a conexão com a API.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-head">
        <strong>{editingTask ? 'Editar tarefa' : 'Nova tarefa'}</strong>
        <span className="badge-mono">auto-sync</span>
      </div>

      <div className="field">
        <label htmlFor="task-name">Título</label>
        <input
          id="task-name"
          value={draft.name}
          onChange={handleChange('name')}
          placeholder="O que precisa ser feito?"
          autoComplete="off"
        />
      </div>

      <div className="field">
        <label htmlFor="assigned-to">Responsável</label>
        <input
          id="assigned-to"
          value={draft.assignedTo}
          onChange={handleChange('assignedTo')}
          placeholder="Quem é?"
          autoComplete="off"
        />
      </div>

      <div className="field">
        <label htmlFor="task-desc">Descrição</label>
        <textarea
          id="task-desc"
          value={draft.description}
          onChange={handleChange('description')}
          placeholder="Detalhes... (opcional)"
        />
      </div>

      <div className="row">
        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
          {editingTask ? 'Atualizar' : 'Adicionar'}
        </button>
        {editingTask && (
          <button type="button" className="btn btn-ghost" onClick={onCancelEdit}>
            Cancelar edição
          </button>
        )}
      </div>
    </div>
  );
}
