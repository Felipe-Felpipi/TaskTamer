// ===== TRATAMENTO CENTRAL DE ERROS =====
export function errorHandler(err, _req, res, _next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Erro interno do servidor'
  });
}

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Rota não encontrada' });
}
