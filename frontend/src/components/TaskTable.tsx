import type { Task } from '../types/task';

interface TaskTableProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskTable({ tasks, onToggle, onEdit, onDelete }: TaskTableProps) {
  if (!tasks.length) {
    return (
      <div className="empty-state">
        <svg className="knot" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="20" cy="20" r="19" stroke="#666c7a" strokeWidth="2" />
          <path
            d="M11 20c0-3 2-5 5-5s5 2 5 5-2 5-5 5c-1.7 0-3-.7-3.8-1.8M25 22c2 0 4-1.6 4-4.5S27.5 13 25 13c-1.5 0-2.7.7-3.5 1.8"
            stroke="#666c7a"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
        Nenhuma tarefa — adicione a primeira ao lado
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table aria-label="Lista de tarefas">
        <thead>
          <tr>
            <th>Status</th>
            <th>Tarefa</th>
            <th>Responsável</th>
            <th>Descrição</th>
            <th className="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>
                <button
                  type="button"
                  className={`toggle-btn ${task.completed ? 'done' : ''}`}
                  onClick={() => onToggle(task.id)}
                  aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
                >
                  {task.completed ? '✓' : ''}
                </button>
              </td>
              <td className={`task-name ${task.completed ? 'done' : ''}`} onDoubleClick={() => onEdit(task)}>
                {task.name}
              </td>
              <td className={`task-assigned ${task.completed ? 'done' : ''}`} onDoubleClick={() => onEdit(task)}>
                {task.assignedTo || '—'}
              </td>
              <td className={`task-desc ${task.completed ? 'done' : ''}`} onDoubleClick={() => onEdit(task)}>
                {task.description || '—'}
              </td>
              <td className="text-right">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(task)}>
                  Editar
                </button>{' '}
                <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(task.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
