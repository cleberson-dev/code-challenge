const express = require('express');
const next = require('next');
const api = require('./api');

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

console.log(dev ? 'DEEEV!!' : 'PROOD');

app.prepare()
  .then(() => {
    const server = express();
    server.use(express.json());

    server.use('/api', api);

    server.get('(/*)?', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, err => {
      if (err) throw err;
      console.log(`Listening on http://localhost:${PORT}`);
    });
  })
  .catch(ex => {
    console.log(ex.stack);
    process.exit(1);
  });