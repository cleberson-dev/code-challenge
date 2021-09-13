const { Router } = require('express');

const routes = Router();

routes.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  return res.status(200).send({ message: `Hello, ${name}!!` });
});

module.exports = routes;