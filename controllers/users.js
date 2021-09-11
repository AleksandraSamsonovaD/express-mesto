const User = require('../models/user');
const ERROR_CODE = 500;
const ERROR_NOT_FOUND = 404;
const ERROR_VALIDATION = 400;

const getUsers = (req, res) => {
    User.find({})
        .then(users => {
            if (users.length < 1)
                res.status(ERROR_NOT_FOUND).send({ message: 'Пользователи не найдены' });
            else
                res.send({ data: users });
        })
        .catch((err) => res.status(ERROR_CODE).send({ message: err.message }));
};

const getUser = (req, res) => {
    if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/))
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
    User.findById(req.params.userId)
        .then(user => {
            if (!user)
                res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
            else
                res.send({ data: user });
        })
        .catch(err => res.status(ERROR_CODE).send({ message: err.message }));
};

const createUser = (req, res) => {
    const { name, about, avatar } = req.body;
    User.create({ name, about, avatar })
        .then(user => res.send({ data: user }))
        .catch((err) => {
            if (err.name === 'ValidationError')
                res.status(ERROR_VALIDATION).send({ message: err.message })
            else
                res.status(ERROR_CODE).send({ message: err.name })
        });
};

const updateUser = (req, res) => {
    const { name, about } = req.body;
    User.findByIdAndUpdate(req.user._id, { name, about },{new: true})
        .then(user => {
            if (!user)
                res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
            else
                res.send({ data: user });
        })
        .catch((err) => {
            if (err.name === 'ValidationError')
                res.status(ERROR_VALIDATION).send({ message: err.message })
            else
                res.status(ERROR_CODE).send({ message: err.name })
        });
};

const updateAvatar = (req, res) => {
    const { avatar } = req.body;
    User.findByIdAndUpdate(req.user._id, { avatar }, {new: true})
        .then(user => {
            if (!user)
                res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
            else
                res.send({ data: user });
        })
        .catch((err) => {
            if (err.name === 'ValidationError')
                res.status(ERROR_VALIDATION).send({ message: err.message })
            else
                res.status(ERROR_CODE).send({ message: err.name })
        });
};

module.exports = { getUsers, getUser, createUser, updateUser, updateAvatar };

