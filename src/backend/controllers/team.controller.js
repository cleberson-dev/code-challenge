const Joi = require('joi');
const teamValidator = require('../validators/team.validator');
const TeamModel = require('../models/team.model');

module.exports.getAll = async (_, res) => {
  try {
    const teams = await TeamModel.getAll();

    return res.status(200).send(teams);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message || 'Error while retrieving teams' });
  }
}

module.exports.create = async (req, res) => {
  const { body: newTeam } = req;

  try {
    Joi.assert(newTeam, teamValidator);

    const createdTeam = await TeamModel.create(newTeam);
    return res.status(201).send(createdTeam);
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
}
