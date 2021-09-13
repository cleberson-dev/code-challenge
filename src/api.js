const { Router } = require('express');
const Joi = require('joi');
const db = require('./database');
const teamValidator = require('./validators/team.validator');

const routes = Router();

routes.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  return res.status(200).send({ message: `Hello, ${name}!!` });
});

routes.get('/teams', async (_, res) => {
  try {
    const teams = await db.select('id', 'name').from('team');
    
    for (const team of teams) {
      const pokemons = await db('team_pokemon')
        .where('team_id', team.id)
        .select('pokemon_id');
      team.pokemons = pokemons.map(({ pokemon_id }) => ({ id: pokemon_id }));
    }

    return res.status(200).send(teams);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message || 'Error while retrieving teams' });
  }
});

routes.post('/teams', async (req, res) => {
  const newTeam = req.body;

  try {
    Joi.assert(newTeam, teamValidator);

    let team;
    const { name, pokemons } = newTeam;
    await db.transaction(async (trx) => {
      const result = await trx.insert({ name }, ['id', 'name']).into('team');
      team = result[0];
      await trx.insert(pokemons.map(pokemon => ({ 
        team_id: team.id,
        pokemon_id: pokemon.id
      }))).into('team_pokemon');
    });

    return res.status(201).send({
      ...team,
      pokemons
    });
  } catch (err) {
    console.error(err);
    
    if (err instanceof Joi.ValidationError) {
      return res.status(400).send({ 
        errors: err.details.map(detail => ({ 
          field: detail.context.key, 
          message: detail.message 
        }))
      });
    }

    return res.status(500).send({ message: err.message || 'Error while creating the new team' });
  }
});

module.exports = routes;