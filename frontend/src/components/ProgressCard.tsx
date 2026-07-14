import type { Task } from '../types/task';

interface ProgressCardProps {
  tasks: Task[];
}

export default function ProgressCard({ tasks }: ProgressCardProps) {
  const done = tasks.filter(t => t.completed).length;
  const percentage = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="card">
      <div className="card-head">
        <strong>Progresso</strong>
      </div>
      <div className="rope-progress">
        <div className="rope-progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      <div className="progress-meta">
        <span>{done} de {tasks.length} amarradas</span>
        <strong>{percentage}%</strong>
      </div>
    </div>
  );
}
