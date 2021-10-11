/* eslint-disable no-useless-escape */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getUsers, getUser, updateUser, updateAvatar, getUserAuth,
} = require('../controllers/users');
const IncorrectDataError = require('../errors/incorrect-data-err');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new IncorrectDataError('Неправильный формат ссылки');
  }
  return value;
};

router.get('/', getUsers);

router.get('/me', getUserAuth);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().pattern(new RegExp('^[0-9a-fA-F]{24}$')),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }),
}), updateAvatar);

module.exports = router;
