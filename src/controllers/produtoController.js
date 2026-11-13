
const db = require('../database/connection');

exports.listarProdutos = async (req, res) => {
  try {
    const { categoria, ativo } = req.query;

    const consulta = db('produtos').select(
      'id',
      'nome',
      'categoria',
      'preco',
      'estoque',
      'ativo'
    );

    if (categoria) {
      consulta.where('categoria', categoria);
    }

    if (ativo !== undefined) {
      if (ativo !== 'true' && ativo !== 'false') {
        return res.status(400).json({
          erro: 'O filtro ativo deve ser true ou false.'
        });
      }

      consulta.where('ativo', ativo === 'true');
    }

    const produtos = await consulta;

    return res.status(200).json(produtos);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: 'Erro ao listar produtos.'
    });
  }
};

exports.buscarProduto = async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await db('produtos')
      .select('id', 'nome', 'categoria', 'preco', 'estoque', 'ativo')
      .where({ id })
      .first();

    if (!produto) {
      return res.status(404).json({
        erro: 'Produto não encontrado.'
      });
    }

    return res.status(200).json(produto);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: 'Erro ao buscar produto.'
    });
  }
};

// Cadastrar produto
exports.criarProduto = async (req, res) => {
  try {
    const { nome, categoria, preco, estoque, ativo = true } = req.body;

    if (
      !nome || typeof nome !== 'string' ||
      !categoria || typeof categoria !== 'string' ||
      preco === undefined || !Number.isFinite(Number(preco)) ||
      estoque === undefined || !Number.isInteger(Number(estoque)) ||
      Number(estoque) < 0 ||
      typeof ativo !== 'boolean'
    ) {
      return res.status(400).json({
        erro: 'Informe nome, categoria, preço, estoque válido e situação do produto.'
      });
    }

    if (nome.length > 80 || categoria.length > 30 || Number(preco) <= 0) {
      return res.status(400).json({
        erro: 'Confira os limites do nome, categoria e preço.'
      });
    }

    const existente = await db('produtos')
      .where({ nome })
      .first();

    if (existente) {
      return res.status(409).json({
        erro: 'Já existe um produto com esse nome.'
      });
    }

    const [id] = await db('produtos').insert({
      nome,
      categoria,
      preco: Number(preco),
      estoque: Number(estoque),
      ativo
    });

    const produto = await db('produtos')
      .select('id', 'nome', 'categoria', 'preco', 'estoque', 'ativo')
      .where({ id })
      .first();

    return res.status(201).json(produto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: 'Erro ao cadastrar produto.'
    });
  }
};

// Editar produto
exports.atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, categoria, preco, estoque, ativo } = req.body;

    if (
      !nome || typeof nome !== 'string' ||
      !categoria || typeof categoria !== 'string' ||
      preco === undefined || !Number.isFinite(Number(preco)) ||
      estoque === undefined || !Number.isInteger(Number(estoque)) ||
      Number(estoque) < 0 ||
      typeof ativo !== 'boolean'
    ) {
      return res.status(400).json({
        erro: 'Informe todos os campos, incluindo ativo (true ou false).'
      });
    }

    if (nome.length > 80 || categoria.length > 30 || Number(preco) <= 0) {
      return res.status(400).json({
        erro: 'Confira os limites do nome, categoria e preço.'
      });
    }

    const produto = await db('produtos').where({ id }).first();

    if (!produto) {
      return res.status(404).json({
        erro: 'Produto não encontrado.'
      });
    }

    const existente = await db('produtos')
      .where({ nome })
      .whereNot({ id })
      .first();

    if (existente) {
      return res.status(409).json({
        erro: 'Já existe outro produto com esse nome.'
      });
    }

    await db('produtos').where({ id }).update({
      nome,
      categoria,
      preco: Number(preco),
      estoque: Number(estoque),
      ativo
    });

    const atualizado = await db('produtos')
      .select('id', 'nome', 'categoria', 'preco', 'estoque', 'ativo')
      .where({ id })
      .first();

    return res.status(200).json(atualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: 'Erro ao atualizar produto.'
    });
  }
};

// Excluir produto
exports.excluirProduto = async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await db('produtos').where({ id }).first();

    if (!produto) {
      return res.status(404).json({
        erro: 'Produto não encontrado.'
      });
    }

    const pedido = await db('pedidos')
      .where({ produto_id: id })
      .first();

    if (pedido) {
      return res.status(409).json({
        erro: 'Não é possível excluir um produto que possui histórico de pedidos.'
      });
    }

    await db('produtos').where({ id }).del();

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: 'Erro ao excluir produto.'
    });
  }
};

