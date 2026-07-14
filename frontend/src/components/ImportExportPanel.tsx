import { useRef, useState } from 'react';
import type { Task, TaskTamerFile } from '../types/task';

interface ImportExportPanelProps {
  tasks: Task[];
  onImport: (tasks: Task[]) => Promise<void>;
  onClearAll: () => Promise<void>;
}

function downloadBlob(blob: Blob, filename: string) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export default function ImportExportPanel({ tasks, onImport, onClearAll }: ImportExportPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const exportFile = () => {
    const payload: TaskTamerFile = { version: 'tasktamer_v3', createdAt: new Date().toISOString(), tasks };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    downloadBlob(blob, `tasktamer-${stamp}.tasktamer`);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'tasktamer.json');
  };

  const readAndImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = async event => {
      try {
        const data = JSON.parse(String(event.target?.result));
        const incoming: Task[] = Array.isArray(data) ? data : data.tasks;
        if (!Array.isArray(incoming)) throw new Error('Formato inválido');
        await onImport(incoming);
        alert('Arquivo importado com sucesso');
      } catch (err) {
        alert(`Erro ao importar: ${(err as Error).message}`);
      }
    };
    reader.onerror = () => alert('Erro ao ler o arquivo');
    reader.readAsText(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readAndImport(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readAndImport(file);
  };

  const handleClearAll = async () => {
    if (confirm('Apagar todas as tarefas do servidor?')) {
      await onClearAll();
    }
  };

  return (
    <div className="card">
      <div className="card-head">
        <strong>Compartilhar</strong>
      </div>
      <div className="row">
        <button type="button" className="btn btn-ghost" onClick={exportFile}>
          Exportar (.tasktamer)
        </button>
        <button type="button" className="btn btn-ghost" onClick={exportJson}>
          Baixar JSON
        </button>
        <label className="btn btn-ghost" style={{ cursor: 'pointer' }}>
          Importar arquivo
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
        </label>
        <button type="button" className="btn btn-danger" onClick={handleClearAll}>
          Reset servidor
        </button>
      </div>

      <p className="hint" style={{ marginTop: 10 }}>
        Exporte um arquivo <code>.tasktamer</code> e envie por WhatsApp, e-mail ou drive. Quem
        importar substitui as tarefas salvas no servidor pelas do arquivo.
      </p>

      <div
        className={`drop-target ${dragActive ? 'active' : ''}`}
        onDragOver={e => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        Arraste um arquivo .tasktamer aqui para importar
      </div>
    </div>
  );
}
