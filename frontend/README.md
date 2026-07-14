# TaskTamer — Frontend

Interface web do TaskTamer, feita com **Vite + React + TypeScript**. Consome a API REST do backend via Axios.

## Rodando localmente

```bash
npm install
cp .env.example .env   # ajuste VITE_API_URL se necessário
npm run dev
```

Acesse `http://localhost:5173`. Por padrão, a interface espera a API rodando em `http://localhost:3333/api` (veja o backend).

## Build de produção

```bash
npm run build
npm run preview
```

Os arquivos finais ficam em `dist/`.

## Estrutura

```
src/
  api/          cliente Axios e chamadas à API
  components/   Header, TaskForm, TaskTable, ProgressCard, ImportExportPanel
  hooks/        useTasks — estado e integração com a API
  types/        tipos TypeScript compartilhados
```

## Funcionalidades

- CRUD completo de tarefas via API (título, responsável, descrição, status)
- Edição rápida com duplo clique na tabela
- Barra de progresso
- Exportação para arquivo `.tasktamer` (JSON) ou `.json` puro
- Importação por seleção de arquivo ou arrastar-e-soltar — substitui as tarefas no servidor
- Indicador de status da conexão com a API

## Deploy

Este projeto é um front estático após o build (`dist/`). Pode ser publicado em GitHub Pages, Vercel ou Netlify — mas lembre-se de apontar `VITE_API_URL` para onde o backend estiver hospedado (Render, Railway, Fly.io etc.), já que GitHub Pages não roda o backend Node.
