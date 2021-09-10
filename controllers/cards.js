const Card = require('../models/card');

const getCards = (req, res) => {
    return Card.find({})
        .then(cards => {
            if (!cards)
                return res.status(404).send({ message: 'Карточки не найдены' });
            else 
                return res.send({ data: cards });
        })
        .catch((err) => res.status(500).send({ message: err.message }));
};

const getCard = (req, res) => {
    return Card.findById(req.params.cardId)
        .then(card => {
            if (!card)
                return res.status(404).send({ message: 'Карточка не найдены' });
            else
                return res.send({ data: card });
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

const createCard = (req, res) => {
    const { name, link } = req.body;
    Card.create({ name, link, owner: req.user._id })
        .then(card => res.send({ data: card }))
        .catch((err) => res.status(500).send({ message: err.message }));
};

const likeCard = (req, res) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
        { new: true })
        .then(card => res.send({ data: card }))
        .catch((err) => res.status(500).send({ message: err.message }));
};

const dislikeCard = (req, res) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } }, // убрать _id из массива
        { new: true },
    )
        .then(card => res.send({ data: card }))
        .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = {getCards, getCard, createCard, likeCard, dislikeCard};