const Card = require('../models/card');
const ERROR_CODE = 500;
const ERROR_NOT_FOUND = 404;
const ERROR_VALIDATION = 400;

const getCards = (req, res) => {
    Card.find({})
        .then(cards => {
            if (!cards)
                res.status(ERROR_NOT_FOUND).send({ message: 'Карточки не найдены' });
            else 
                res.send({ data: cards });
        })
        .catch((err) => {
            res.status(ERROR_CODE).send({ message: err.message })
        });
};

const getCard = (req, res) => {
    if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/))
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдены' });
    Card.findById(req.params.cardId)
        .then(card => {
            console.log(card);
            if (!card)
                res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдены' });
            else
                res.send({ data: card });
        })
        .catch(err => res.status(ERROR_CODE).send({ message: err.message }));
};

const createCard = (req, res) => {
    const { name, link } = req.body;
    Card.create({ name, link, owner: req.user._id })
        .then(card => res.send({ data: card }))
        .catch((err) => {
            if (err.name === 'ValidationError')
                res.status(ERROR_VALIDATION).send({ message: err.message })
            else 
                res.status(ERROR_CODE).send({ message: err.name })
        });
};

const likeCard = (req, res) => {
    if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/))
        return res.status(ERROR_VALIDATION).send({ message: 'Карточка не найдены' });
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
        { new: true })
        .then(card => res.send({ data: card }))
        .catch((err) => res.status(ERROR_CODE).send({ message: err.message }));
};

const dislikeCard = (req, res) => {
    if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/))
        return res.status(ERROR_VALIDATION).send({ message: 'Карточка не найдены' });
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } }, // убрать _id из массива
        { new: true },
    )
        .then(card => res.send({ data: card }))
        .catch((err) => res.status(ERROR_CODE).send({ message: err.message }));
};

const deleteCard = (req, res) => {
    if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/))
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдены' });
    Card.findByIdAndRemove(
        req.params.cardId
    )
        .then(card => res.send({ data: card }))
        .catch((err) => res.status(ERROR_CODE).send({ message: err.message }));
};

module.exports = {getCards, getCard, createCard, likeCard, dislikeCard , deleteCard};