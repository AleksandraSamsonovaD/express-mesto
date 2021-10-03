/* eslint-disable no-shadow */
const Card = require('../models/card');

const IncorrectDataError = require('../errors/incorrect-data-err');
const NotFoundError = require('../errors/not-found-err');
const DefaultError = require('../errors/default-err');
const DeleteError = require('../errors/delete-err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (cards.length < 1) { throw new NotFoundError('Карточки не найдены'); } else { res.send({ data: cards }); }
    })
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user.id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errValid = new IncorrectDataError(err.message);
        next(errValid);
      } else {
        const errDef = new DefaultError(err.message);
        next(errDef);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) { throw new NotFoundError('Карточка не найдены'); } else { res.send({ data: card }); }
    })
    .catch((err) => next(err));
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) { throw new NotFoundError('Карточка не найдены'); } else { res.send({ data: card }); }
    })
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) { throw new NotFoundError('Карточка не найдены'); } else if (req.user.userId !== card.owner.userId) { throw new DeleteError('Карточка создана не вами'); } else {
        Card.findByIdAndRemove(
          req.params.cardId,
        )
          .then((card) => {
            res.send({ data: card });
          });
      }
    })
    .catch((err) => next(err));
};

module.exports = {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
};
