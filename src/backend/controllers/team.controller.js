const Joi = require('joi');
const teamValidator = require('../validators/team.validator');
const TeamModel = require('../models/team.model');

module.exports.getAll = async (req, res) => {
  const offset = req.query.offset && Number.isInteger(+req.query.offset) ? +req.query.offset : 0;
  const size = req.query.size && Number.isInteger(+req.query.size) && +req.query.size > 0 ? +req.query.size : 20;

  try {
    const { results, count } = await TeamModel.getAll({ offset, size });
    const previousOffset = offset - size;
    const nextOffset = offset + size;

    const previousUrl = previousOffset >= 0 ? 
      `${req.path}?offset=${previousOffset}&size=${size}` : null;
    const nextUrl = nextOffset < count ? 
      `${req.path}?offset=${nextOffset}&size=${size}` : null;

    return res.status(200).send({
      count,
      next: nextUrl, previous: previousUrl,
      results
    });
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
