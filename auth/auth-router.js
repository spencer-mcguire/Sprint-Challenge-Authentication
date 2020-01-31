const router = require('express').Router();
const Users = require('../database/helpers/users-model');
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwtSecret');

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
  let user = req.body;
  const hash = bc.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(newUser => {
      if (newUser) {
        res.status(201).json(newUser);
      } else {
        res.status(500).json({
          error_message: 'Something happened when return the new user'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        error_message: 'Something happend when creating a new user..'
      });
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bc.compareSync(password, user.password)) {
        const token = signToken(user);

        res
          .status(200)
          .json({ token, message: `Welcome back ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

function signToken(user) {
  const payload = {
    userId: user.id,
    username: user.username
  };

  const options = {
    expiresIn: '1d'
  };

  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
