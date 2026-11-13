exports.seed = async function (knex) {
  await knex('pedidos').del();
  await knex('produtos').del();

  await knex('produtos').insert([
    {
      nome: 'X-Burger',
      categoria: 'Lanches',
      preco: 12.00,
      estoque: 30,
      ativo: true
    },
    {
      nome: 'X-Salada',
      categoria: 'Lanches',
      preco: 14.00,
      estoque: 25,
      ativo: true
    },
    {
      nome: 'Cachorro-quente',
      categoria: 'Lanches',
      preco: 10.00,
      estoque: 20,
      ativo: true
    },
    {
      nome: 'Refrigerante',
      categoria: 'Bebidas',
      preco: 5.00,
      estoque: 40,
      ativo: true
    },
    {
      nome: 'Suco natural',
      categoria: 'Bebidas',
      preco: 7.00,
      estoque: 30,
      ativo: true
    },
    {
      nome: 'Água mineral',
      categoria: 'Bebidas',
      preco: 3.00,
      estoque: 50,
      ativo: true
    }
  ]);
};