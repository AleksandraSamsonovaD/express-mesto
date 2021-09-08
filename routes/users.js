const router = require('express').Router();
const User = require('../models/user');

router.get('/users', (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

router.get('/users/:userId', (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
});

router.post('/users', (req, res) => {
  console.log(req)
  const { name, link, owner} = req.body;
  User.create({ name, link, owner })
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

module.exports = router;