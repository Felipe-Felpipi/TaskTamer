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

GitHub Pages só serve arquivos estáticos, então o front e o back são publicados em lugares diferentes:

### Backend → Render (grátis)

1. Crie conta em [render.com](https://render.com) e conecte sua conta do GitHub
2. New → Web Service → selecione este repositório (o `render.yaml` na raiz já configura tudo: root dir `backend`, build e start command)
3. Render vai te dar uma URL pública, ex: `https://tasktamer-api.onrender.com`
4. No serviço, confirme a variável `CORS_ORIGIN` apontando para a URL do GitHub Pages (`https://<seu-usuario>.github.io`)

> Plano free do Render "dorme" depois de alguns minutos sem uso — a primeira requisição depois de um tempo parado demora ~30s pra acordar. Normal.

### Frontend → GitHub Pages (via GitHub Actions)

1. No repositório, vá em **Settings → Pages** e em "Build and deployment" selecione **Source: GitHub Actions**
2. Vá em **Settings → Secrets and variables → Actions** e crie o secret `VITE_API_URL` com o valor `https://tasktamer-api.onrender.com/api` (a URL do passo anterior + `/api`)
3. Dê push na branch `main` — o workflow em `.github/workflows/deploy-frontend.yml` builda o front e publica automaticamente
4. O site fica em `https://<seu-usuario>.github.io/TaskTamer/`

O `vite.config.ts` já está com `base: '/TaskTamer/'` para bater com esse endereço. Se o repositório tiver outro nome, ajuste esse valor.

## Licença

MIT
