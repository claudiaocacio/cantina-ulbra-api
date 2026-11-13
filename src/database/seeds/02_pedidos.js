
exports.seed = async function (knex) {
  await knex('pedidos').del();

  const produtos = await knex('produtos').select('id', 'nome');

  const buscarId = (nome) => {
    const produto = produtos.find((p) => p.nome === nome);
    return produto.id;
  };

  await knex('pedidos').insert([
    {
      aluno_nome: 'Ana Silva',
      produto_id: buscarId('X-Burger'),
      quantidade: 2,
      valor_total: 24.00,
      created_at: '2026-11-01 10:00:00',
      updated_at: '2026-11-01 10:00:00'
    },
    {
      aluno_nome: 'Pedro Santos',
      produto_id: buscarId('X-Salada'),
      quantidade: 1,
      valor_total: 14.00,
      created_at: '2026-11-03 11:30:00',
      updated_at: '2026-11-03 11:30:00'
    },
    {
      aluno_nome: 'Maria Oliveira',
      produto_id: buscarId('Refrigerante'),
      quantidade: 3,
      valor_total: 15.00,
      created_at: '2026-11-05 12:00:00',
      updated_at: '2026-11-05 12:00:00'
    },
    {
      aluno_nome: 'João Costa',
      produto_id: buscarId('Cachorro-quente'),
      quantidade: 2,
      valor_total: 20.00,
      created_at: '2026-11-08 13:15:00',
      updated_at: '2026-11-08 13:15:00'
    },
    {
      aluno_nome: 'Lucas Pereira',
      produto_id: buscarId('Suco natural'),
      quantidade: 2,
      valor_total: 14.00,
      created_at: '2026-11-10 14:00:00',
      updated_at: '2026-11-10 14:00:00'
    }
  ]);
};
