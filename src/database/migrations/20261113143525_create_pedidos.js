exports.up = function (knex) {
  return knex.schema.createTable('pedidos', function (table) {
    table.increments('id').primary();
    table.string('aluno_nome', 100).notNullable();

    table.integer('produto_id')
      .unsigned()
      .notNullable()git statusgit status
      .references('id')
      .inTable('produtos');

    table.integer('quantidade').notNullable();
    table.decimal('valor_total', 8, 2).notNullable();

    table.timestamps(true, true);

    table.check('quantidade >= 1');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('pedidos');
};
