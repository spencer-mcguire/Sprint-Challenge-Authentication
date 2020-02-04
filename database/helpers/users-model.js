const db = require('../dbConfig');

module.exports = {
  find,
  findBy,
  findById,
  add
};

function find() {
  return db('users');
}

function findBy(filter) {
  return db('users').where(filter);
}

function findById(id) {
  return db('users as u')
    .select('u.id', 'u.username')
    .where({ id })
    .first();
}

function add(user) {
  return db('users')
    .insert(user)
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}
