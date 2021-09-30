const router = require('express').Router();
const { getUsers, getUser, updateUser, updateAvatar, getUserAuth } = require('../controllers/users')
const { celebrate, Joi } = require('celebrate');

router.get('/', getUsers);

router.get('/:userId',celebrate({
    params: Joi.object().keys({
        userId: Joi.string().alphanum().pattern(new RegExp('^[0-9a-fA-F]{24}$')),
      })
}), getUser);

router.patch('/me', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        about: Joi.string().required().min(2).max(30),
    }),
}), updateUser);

router.patch('/me/avatar', celebrate({
    body: Joi.object().keys({
        avatar: Joi.string().required().pattern(new RegExp('^(http|https):\/\/(www\.)?([A-Za-z0-9]/-._~:/?#/[]@!$&//(/)*/+,;=)*#$')),
    }),
}), updateAvatar);

router.get('/me', getUserAuth);

module.exports = router;