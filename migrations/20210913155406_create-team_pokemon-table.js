exports.up = (knex) => knex.schema.createTable('team_pokemon', table => {
  table.integer('team_id').unsigned().notNullable()
    .references('id').inTable('team');
  table.integer('pokemon_id').unsigned().notNullable();
  table.primary(['team_id', 'pokemon_id']);
});

exports.down = (knex) => knex.schema.dropTable('team_pokemon');
