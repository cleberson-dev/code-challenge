const { Router } = require('express');
const teamsRoutes = require('./teams.routes');

const routes = Router();
routes.use('/teams', teamsRoutes);

module.exports = routes;