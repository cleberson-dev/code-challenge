exports.up = (knex) => knex.schema.createTable('team', table => {
  table.increments();
  table.string('name');
});

exports.down = (knex) => knex.schema.dropTable('team');
