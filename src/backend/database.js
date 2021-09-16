const knex = require('knex');
const config = require('../../knexfile');

const dev = process.env.NODE_ENV !== 'production';

module.exports = knex(dev ? config.development : config.production);
