const { Router } = require('express');
const TeamController = require('../controllers/team.controller');

const teamsRoutes = Router();
teamsRoutes.get('/', TeamController.getAll);
teamsRoutes.post('/', TeamController.create);

module.exports = teamsRoutes;
