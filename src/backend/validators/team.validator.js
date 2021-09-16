const Joi = require('joi');

const pokemonSchema = Joi.object({ 
  id: Joi.number().integer().positive().required()
});

module.exports = Joi.object({
  name: Joi.string().min(4).max(32).required(),
  pokemons: Joi.array().items(pokemonSchema).length(6)
  .unique('id')
  .required()
});
