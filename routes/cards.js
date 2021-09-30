const router = require('express').Router();
const { getCards, getCard, createCard, likeCard, dislikeCard, deleteCard } = require('../controllers/cards')
const { celebrate, Joi } = require('celebrate');

router.get('/', getCards);

router.get('/:cardId', celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().alphanum().pattern(new RegExp('^[0-9a-fA-F]{24}$')),
    })
}), getCard);

router.post('/', createCard);

router.put('/:cardId/likes', celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().alphanum().pattern(new RegExp('^[0-9a-fA-F]{24}$')),
    })
}), likeCard);

router.delete('/:cardId/likes', celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().alphanum().pattern(new RegExp('^[0-9a-fA-F]{24}$')),
    })
}), dislikeCard);

router.delete('/:cardId', celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().alphanum().length(24),
    })
}), deleteCard);

module.exports = router;