
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());
const produtoRoutes = require('./routes/produtoRoutes');

app.use('/api/produtos', produtoRoutes);
const pedidoRoutes = require('./routes/pedidoRoutes');

app.use('/api/pedidos', pedidoRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    mensagem: 'API Cantina ULBRA funcionando!'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
