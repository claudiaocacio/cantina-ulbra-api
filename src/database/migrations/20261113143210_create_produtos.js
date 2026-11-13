
exports.up = function (knex) {
  return knex.schema.createTable('produtos', function (table) {
    table.increments('id').primary();
    table.string('nome', 80).notNullable().unique();
    table.string('categoria', 30).notNullable();
    table.decimal('preco', 8, 2).notNullable();
    table.integer('estoque').notNullable();
    table.boolean('ativo').notNullable().defaultTo(true);

    table.check('estoque >= 0');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('produtos');
};

