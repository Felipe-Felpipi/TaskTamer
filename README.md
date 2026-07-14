# TaskTamer 🏆

Gerenciador de tarefas simples, agora com arquitetura fullstack: **frontend em Vite + React + TypeScript** e **backend em Node.js + Express**, comunicando-se via Axios.

Evoluído a partir de uma versão anterior 100% client-side (HTML/CSS/JS puro com `localStorage`). Nesta versão as tarefas ficam persistidas no servidor, mas o recurso de exportar/importar arquivo `.tasktamer` para compartilhar listas entre pessoas foi mantido.

## Estrutura do repositório

```
tasktamer/
  frontend/   Vite + React + TypeScript (interface)
  backend/    Node.js + Express (API REST)
```

Cada pasta tem seu próprio `package.json` e README com instruções específicas.

## Como rodar tudo localmente

Em dois terminais separados:

```bash
# Terminal 1 — API
cd backend
npm install
cp .env.example .env
npm run dev

# Terminal 2 — Interface
cd frontend
npm install
cp .env.example .env
npm run dev
```

Abra `http://localhost:5173`. A interface consome a API em `http://localhost:3333/api`.

## Principais funcionalidades

- CRUD de tarefas (título, responsável, descrição, status) persistido no backend
- Edição rápida com duplo clique
- Barra de progresso
- Exportação de tarefas em arquivo `.tasktamer` ou `.json`, para compartilhar por WhatsApp, e-mail, drive etc.
- Importação por arquivo ou arrastar-e-soltar, substituindo as tarefas do servidor
- Indicador de status da conexão com a API

## Stack

- **Frontend:** React, TypeScript, Vite, Axios
- **Backend:** Node.js, Express, CORS, Morgan
- **Persistência:** arquivo JSON local (camada isolada, pronta para trocar por MongoDB)

## Deploy

- **Frontend:** GitHub Pages, Vercel ou Netlify (build estático em `frontend/dist`)
- **Backend:** Render, Railway ou Fly.io (precisa de um processo Node rodando; GitHub Pages não serve backend)

Lembre-se de configurar `VITE_API_URL` no frontend apontando para a URL pública do backend em produção.

## Licença

MIT
