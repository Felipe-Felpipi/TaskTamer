import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import tasksRouter from './routes/tasks.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3333;
const ORIGIN = process.env.CORS_ORIGIN || '*';

// ===== MIDDLEWARES GLOBAIS =====
app.use(cors({ origin: ORIGIN }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// ===== ROTAS =====
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'tasktamer-backend', timestamp: new Date().toISOString() });
});

app.use('/api/tasks', tasksRouter);

// ===== TRATAMENTO DE ERROS =====
app.use(notFoundHandler);
app.use(errorHandler);

// ===== INICIALIZAÇÃO =====
app.listen(PORT, () => {
  console.log(`🏆 TaskTamer API rodando em http://localhost:${PORT}`);
});
