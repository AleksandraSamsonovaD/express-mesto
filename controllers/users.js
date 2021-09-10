const User = require('../models/user');

const getUsers = (req, res) => {
    return User.find({})
        .then(users => {
            if (!users)
                return res.status(404).send({ message: 'Пользователи не найдены' });
            else
                return res.send({ data: users });
        })
        .catch((err) => res.status(500).send({ message: err.message }));
};

const getUser = (req, res) => {
    return User.findById(req.params.userId)
        .then(user => {
            if (!user)
                return res.status(404).send({ message: 'Пользователь не найдены' });
            else
                return res.send({ data: user });
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

const createUser = (req, res) => {
    const { name, about, avatar } = req.body;
    User.create({ name, about, avatar })
        .then(user => res.send({ data: user }))
        .catch((err) => res.status(500).send({ message: err.message }));
};

const updateUser = (req, res) => {
    const { name, about } = req.body;
    User.findByIdAndUpdate(req.user._id, { name, about })
        .then(user => res.send({ data: user }))
        .catch((err) => res.status(500).send({ message: err.message }));
};

const updateAvatar = (req, res) => {
    const { avatar } = req.body;
    User.findByIdAndUpdate(req.user._id, { avatar })
        .then(user => res.send({ data: user }))
        .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = { getUsers, getUser, createUser, updateUser, updateAvatar };

