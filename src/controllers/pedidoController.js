
const db = require('../database/connection');

exports.listarPedidos = async (req, res) => {
  try {
    const limit = Number(req.query.limit ?? 10);
    const offset = Number(req.query.offset ?? 0);
    const { aluno_nome } = req.query;

    if (
      !Number.isInteger(limit) || limit < 1 ||
      !Number.isInteger(offset) || offset < 0
    ) {
      return res.status(400).json({
        erro: 'Limit deve ser maior que zero e offset não pode ser negativo.'
      });
    }

    const consulta = db('pedidos')
      .join('produtos', 'pedidos.produto_id', 'produtos.id')
      .select(
        'pedidos.id',
        'pedidos.aluno_nome',
        'pedidos.produto_id',
        'produtos.nome as produto_nome',
        'pedidos.quantidade',
        'pedidos.valor_total',
        'pedidos.created_at'
      );

    if (aluno_nome) {
      consulta.where('pedidos.aluno_nome', 'like', `%${aluno_nome}%`);
    }

    const pedidos = await consulta
      .orderBy('pedidos.id', 'desc')
      .limit(limit)
      .offset(offset);

    return res.status(200).json({
      limit,
      offset,
      pedidos
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: 'Erro ao listar pedidos.'
    });
  }
};

exports.buscarPedido = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await db('pedidos')
      .join('produtos', 'pedidos.produto_id', 'produtos.id')
      .select(
        'pedidos.id',
        'pedidos.aluno_nome',
        'pedidos.produto_id',
        'produtos.nome as produto_nome',
        'pedidos.quantidade',
        'pedidos.valor_total',
        'pedidos.created_at'
      )
      .where('pedidos.id', id)
      .first();

    if (!pedido) {
      return res.status(404).json({
        erro: 'Pedido não encontrado.'
      });
    }

    return res.status(200).json(pedido);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: 'Erro ao buscar pedido.'
    });
  }
};

// Criar pedido
exports.criarPedido = async (req, res) => {
  try {
    const { aluno_nome, produto_id, quantidade } = req.body;

    if (
      typeof aluno_nome !== 'string' ||
      !aluno_nome.trim() ||
      !Number.isInteger(Number(produto_id)) ||
      Number(produto_id) <= 0 ||
      !Number.isInteger(Number(quantidade)) ||
      Number(quantidade) < 1
    ) {
      return res.status(400).json({
        erro: 'Informe aluno_nome, produto_id e quantidade válida.'
      });
    }

    const resultado = await db.transaction(async (trx) => {
      const produto = await trx('produtos')
        .where({ id: Number(produto_id) })
        .first();

      if (!produto) {
        throw { status: 404, message: 'Produto não encontrado.' };
      }

      if (!produto.ativo) {
        throw { status: 400, message: 'Este produto está inativo.' };
      }

      if (produto.estoque < Number(quantidade)) {
        throw { status: 409, message: 'Estoque insuficiente.' };
      }

      const valorTotal = Number(
        (Number(produto.preco) * Number(quantidade)).toFixed(2)
      );

      const [id] = await trx('pedidos').insert({
        aluno_nome: aluno_nome.trim(),
        produto_id: Number(produto_id),
        quantidade: Number(quantidade),
        valor_total: valorTotal
      });

      await trx('produtos')
        .where({ id: Number(produto_id) })
        .decrement('estoque', Number(quantidade));

      return {
        id,
        aluno_nome: aluno_nome.trim(),
        produto_id: Number(produto_id),
        produto_nome: produto.nome,
        quantidade: Number(quantidade),
        valor_total: valorTotal
      };
    });

    return res.status(201).json(resultado);
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({
        erro: error.message
      });
    }

    return res.status(500).json({
      erro: 'Erro ao criar pedido.'
    });
  }
};

exports.excluirPedido = async (req, res) => {
  try {
    const { id } = req.params;

    await db.transaction(async (trx) => {
      const pedido = await trx('pedidos')
        .where({ id })
        .first();

      if (!pedido) {
        throw { status: 404, message: 'Pedido não encontrado.' };
      }

      await trx('produtos')
        .where({ id: pedido.produto_id })
        .increment('estoque', pedido.quantidade);

      await trx('pedidos')
        .where({ id })
        .del();
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({
        erro: error.message
      });
    }

    return res.status(500).json({
      erro: 'Erro ao excluir pedido.'
    });
  }
};
