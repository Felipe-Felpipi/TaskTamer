// ===== CONSTANTES E CONFIGURAÇÕES =====
const STORAGE_KEY = 'tasktamer_v2_tasks';
const DRAFT_KEYS = ['task-name', 'assigned-to', 'task-desc'];

// ===== SELEÇÃO DE ELEMENTOS =====
const el = id => document.getElementById(id);

// ===== VARIÁVEIS GLOBAIS =====
let tasks = [];
let editIndex = -1;

// ===== UTILITÁRIOS =====
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c]);
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  } catch (e) {
    tasks = [];
    console.error('Could not parse localStorage data', e);
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
  renderTasks();
}

// ===== GERENCIAMENTO DE TAREFAS =====
function addOrUpdateTask() {
  const name = el('task-name').value.trim();
  if (!name) {
    alert('Título é obrigatório');
    return;
  }

  const assignedTo = el('assigned-to').value.trim();
  const description = el('task-desc').value.trim();

  if (editIndex >= 0) {
    // Modo edição
    tasks[editIndex] = {
      name,
      assignedTo,
      description,
      completed: tasks[editIndex].completed
    };
    editIndex = -1;
    el('add-task').textContent = 'Adicionar';
  } else {
    // Modo adição
    tasks.push({ 
      name, 
      assignedTo, 
      description, 
      completed: false 
    });
  }

  clearForm();
  saveToStorage();
}

function openEdit(index) {
  const task = tasks[index];
  if (!task) return;
  
  el('task-name').value = task.name;
  el('assigned-to').value = task.assignedTo;
  el('task-desc').value = task.description;
  editIndex = index;
  el('add-task').textContent = 'Atualizar';
  el('task-name').focus();
}

function toggleTask(index) {
  if (tasks[index]) {
    tasks[index].completed = !tasks[index].completed;
    saveToStorage();
  }
}

function deleteTask(index) {
  if (confirm('Remover tarefa?')) {
    tasks.splice(index, 1);
    saveToStorage();
  }
}

function clearAllTasks() {
  if (confirm('Apagar todas as tarefas locais?')) {
    tasks = [];
    saveToStorage();
  }
}

// ===== RENDERIZAÇÃO =====
function renderTasks() {
  const tbody = el('tasks-table');
  tbody.innerHTML = '';

  if (!tasks.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="muted" style="padding:18px">
          Nenhuma tarefa — adicione acima
        </td>
      </tr>
    `;
    updateProgress();
    return;
  }

  const fragment = document.createDocumentFragment();

  tasks.forEach((task, index) => {
    const completedClass = task.completed ? 'completed' : '';
    const toggleIcon = task.completed ? '✅' : '◯';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <button data-index="${index}" class="btn btn-ghost toggle" type="button">
          ${toggleIcon}
        </button>
      </td>
      <td class="${completedClass}" data-index="${index}">
        ${escapeHtml(task.name)}
      </td>
      <td class="${completedClass}">
        ${escapeHtml(task.assignedTo)}
      </td>
      <td class="${completedClass}">
        ${escapeHtml(task.description)}
      </td>
      <td class="text-right">
        <button data-index="${index}" class="btn btn-ghost edit" type="button">
          Editar
        </button>
        <button data-index="${index}" class="btn btn-danger delete" type="button">
          Excluir
        </button>
      </td>
    `;

    fragment.appendChild(row);
  });

  tbody.appendChild(fragment);
  attachRowEvents();
  updateProgress();
}

function updateProgress() {
  const completedCount = tasks.filter(t => t.completed).length;
  const percentage = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  
  el('progress-text').textContent = `${percentage}%`;
  el('progress-bar').style.width = `${percentage}%`;
}

function attachRowEvents() {
  // Eventos para toggle
  document.querySelectorAll('#tasks-table .toggle').forEach(button => {
    button.onclick = () => {
      const index = Number(button.dataset.index);
      if (Number.isFinite(index)) toggleTask(index);
    };
  });

  // Eventos para editar
  document.querySelectorAll('#tasks-table .edit').forEach(button => {
    button.onclick = () => {
      const index = Number(button.dataset.index);
      if (Number.isFinite(index)) openEdit(index);
    };
  });

  // Eventos para excluir
  document.querySelectorAll('#tasks-table .delete').forEach(button => {
    button.onclick = () => {
      const index = Number(button.dataset.index);
      if (Number.isFinite(index)) deleteTask(index);
    };
  });

  // Duplo clique para editar
  document.querySelectorAll('#tasks-table td[data-index]').forEach(cell => {
    cell.ondblclick = () => {
      const index = Number(cell.dataset.index);
      if (Number.isFinite(index)) openEdit(index);
    };
  });
}

// ===== GERENCIAMENTO DE FORMULÁRIO =====
function clearForm() {
  el('task-name').value = '';
  el('assigned-to').value = '';
  el('task-desc').value = '';
  editIndex = -1;
  el('add-task').textContent = 'Adicionar';
}

function loadDrafts() {
  DRAFT_KEYS.forEach(id => {
    const field = el(id);
    try {
      field.value = localStorage.getItem(`draft:${id}`) || '';
    } catch (e) {
      // Silenciosamente ignora erros de localStorage
    }
  });
}

function saveDraft(id) {
  const field = el(id);
  try {
    localStorage.setItem(`draft:${id}`, field.value);
  } catch (e) {
    // Silenciosamente ignora erros de localStorage
  }
}

// ===== IMPORT/EXPORT =====
function exportFile() {
  const payload = { 
    version: 'tasktamer_v2', 
    createdAt: new Date().toISOString(), 
    tasks 
  };
  
  const blob = new Blob([JSON.stringify(payload, null, 2)], { 
    type: 'application/json' 
  });
  
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  downloadBlob(blob, `tasktamer-${timestamp}.tasktamer`);
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(tasks, null, 2)], { 
    type: 'application/json' 
  });
  downloadBlob(blob, 'tasktamer.json');
}

function downloadBlob(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function importData(data) {
  if (!data) throw new Error('Objeto inválido');
  
  if (Array.isArray(data.tasks)) {
    tasks = data.tasks;
  } else if (Array.isArray(data)) {
    tasks = data;
  } else {
    throw new Error('Formato inválido');
  }
  
  saveToStorage();
}

function handleFileImport(file, onSuccess, onError) {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      importData(data);
      onSuccess();
    } catch (err) {
      onError(err);
    }
  };
  
  reader.onerror = () => onError(new Error('Erro ao ler o arquivo'));
  reader.readAsText(file);
}

// ===== DRAG & DROP =====
function setupDragAndDrop() {
  const dropZone = el('drop-target');

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#c7d2fe';
  });

  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#e6e9ef';
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#e6e9ef';
    
    const file = e.dataTransfer?.files[0];
    if (!file) return;

    handleFileImport(
      file,
      () => alert('Arquivo importado com sucesso'),
      (err) => alert(`Erro ao importar: ${err.message}`)
    );
  });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Botões principais
  el('add-task').addEventListener('click', addOrUpdateTask);
  el('clear-all').addEventListener('click', () => {
    if (confirm('Limpar todos os campos?')) clearForm();
  });
  el('reset-local').addEventListener('click', clearAllTasks);
  
  // Exportação
  el('export-file').addEventListener('click', exportFile);
  el('download-json').addEventListener('click', exportJSON);
  
  // Importação de arquivo
  el('import-file').addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    handleFileImport(
      file,
      () => {
        alert('Arquivo importado com sucesso');
        event.target.value = ''; // Reset do input
      },
      (err) => alert(`Erro ao importar: ${err.message}`)
    );
  });

  // Paste do clipboard
  window.addEventListener('paste', (event) => {
    try {
      const text = (event.clipboardData || window.clipboardData).getData('text');
      if (!text) return;
      
      const data = JSON.parse(text);
      if (data && (Array.isArray(data.tasks) || Array.isArray(data))) {
        if (confirm('Colar dados JSON do clipboard e substituir tarefas locais?')) {
          tasks = Array.isArray(data.tasks) ? data.tasks : data;
          saveToStorage();
        }
      }
    } catch (_error) {
      // Ignora erros de parse
    }
  });

  // Auto-save de rascunhos
  DRAFT_KEYS.forEach(id => {
    el(id).addEventListener('input', () => saveDraft(id));
  });

  // Aviso de rascunhos não salvos
  window.addEventListener('beforeunload', (event) => {
    const hasDrafts = DRAFT_KEYS.some(id => {
      try {
        return Boolean(localStorage.getItem(`draft:${id}`));
      } catch {
        return false;
      }
    });

    if (hasDrafts) {
      event.returnValue = 'Você tem rascunhos não salvos.';
    }
  });
}

// ===== INICIALIZAÇÃO =====
function init() {
  loadFromStorage();
  loadDrafts();
  setupDragAndDrop();
  setupEventListeners();
  renderTasks();
}

// ===== EXECUÇÃO =====
init();