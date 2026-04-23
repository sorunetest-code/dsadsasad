const Datastore = require('nedb-promises');
const path = require('path');

const db = {
  orders:   Datastore.create({ filename: path.join(__dirname, 'data/orders.db'),   autoload: true }),
  tokens:   Datastore.create({ filename: path.join(__dirname, 'data/tokens.db'),   autoload: true }),
  messages: Datastore.create({ filename: path.join(__dirname, 'data/messages.db'), autoload: true }),
  games:    Datastore.create({ filename: path.join(__dirname, 'data/games.db'),    autoload: true }),
};

module.exports = db;
