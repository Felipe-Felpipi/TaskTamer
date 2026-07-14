# TaskTamer — Backend

API REST em **Node.js + Express** para o TaskTamer. Persiste as tarefas em um arquivo JSON local (`src/data/db.json`), sem depender de banco de dados externo — mas a camada de dados (`src/data/store.js`) foi isolada para facilitar a troca por MongoDB no futuro, se necessário.

## Rodando localmente

```bash
npm install
cp .env.example .env   # ajuste PORT e CORS_ORIGIN se necessário
npm run dev             # com nodemon (reinicia sozinho)
# ou
npm start                # produção simples
```

A API sobe em `http://localhost:3333` por padrão.

## Endpoints

| Método | Rota                     | Descrição                              |
|--------|--------------------------|-----------------------------------------|
| GET    | `/api/health`            | Verifica se a API está no ar            |
| GET    | `/api/tasks`              | Lista todas as tarefas                  |
| GET    | `/api/tasks/:id`          | Busca uma tarefa específica             |
| POST   | `/api/tasks`               | Cria uma tarefa `{ name, assignedTo?, description? }` |
| PUT    | `/api/tasks/:id`          | Atualiza campos de uma tarefa           |
| PATCH  | `/api/tasks/:id/toggle`   | Alterna o status concluído/pendente     |
| DELETE | `/api/tasks/:id`          | Remove uma tarefa                       |
| DELETE | `/api/tasks`               | Remove todas as tarefas                 |
| POST   | `/api/tasks/import`        | Substitui todas as tarefas por um array importado |

## Estrutura

```
src/
  data/store.js        camada de persistência (JSON em disco)
  routes/tasks.routes.js  rotas da API
  middleware/errorHandler.js
  server.js             ponto de entrada
```

## Próximos passos possíveis

- Trocar `store.js` por uma implementação com MongoDB/Mongoose mantendo a mesma assinatura de funções
- Autenticação simples por usuário/token para múltiplos donos de listas
- Testes automatizados com Jest + Supertest
