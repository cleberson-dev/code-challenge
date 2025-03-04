const db = require('../database');

module.exports.getAll = async ({ offset, size }) => {
  let { count } = await db('team').count('*').first();

  const results = await db('team')
    .orderByRaw('id DESC')
    .limit(size)
    .offset(offset);
    
  for (const team of results) {
    const pokemons = await db('team_pokemon')
      .where('team_id', team.id)
      .select('pokemon_id');
    team.pokemons = pokemons.map(({ pokemon_id }) => ({ id: pokemon_id }));
  }

  return {
    count: Number(count),
    results
  };
}

module.exports.create = async ({ name, pokemons }) => {
  let team;

  await db.transaction(async (trx) => {
    const result = await trx.insert({ name }, ['id', 'name']).into('team');
    team = result[0];
    await trx.insert(pokemons.map(pokemon => ({ 
      team_id: team.id,
      pokemon_id: pokemon.id
    }))).into('team_pokemon');
  });

  return { ...team, pokemons };
}