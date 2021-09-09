const router = require('express').Router();
const Card = require('../models/card');

router.get('/', (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

router.get('/:cardId', (req, res) => {
  Card.findById(req.params.cardId)
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
});

router.post('/', (req, res) => {
  const { name, link} = req.body;
  Card.create({ name, link, owner:req.user._id })
    .then(card => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
});

module.exports = router;