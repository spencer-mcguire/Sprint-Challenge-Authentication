const router = require('express').Router();
const Users = require('../database/helpers/users-model');

router.get('/users', (req, res) => {
  Users.find()
    .then(users => {
      if (users.length > 0) {
        res.json(users);
      } else {
        res.status(404).json({ error_message: 'no users found' });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: err, error_message: 'Something happend..' });
    });
});

router.post('/register', (req, res) => {
  // implement registration
});

router.post('/login', (req, res) => {
  // implement login
});

module.exports = router;
