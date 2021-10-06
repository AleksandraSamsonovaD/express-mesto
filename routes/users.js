/* eslint-disable no-useless-escape */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, updateUser, updateAvatar, getUserAuth,
} = require('../controllers/users');

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
    avatar: Joi.string().required().pattern(/^(http|https):\/\/(www\.)?([A-Za-z0-9]*[\-\._~:\/?#\[\]@!$&'\(\)*\+,;=]?)*#?$/),
  }),
}), updateAvatar);

module.exports = router;
