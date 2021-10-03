/* eslint-disable no-shadow */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = 'f83b7547452099462061734791da57443cc60828de7dcb8f7494eedceb3c889c';

const IncorrectDataError = require('../errors/incorrect-data-err');
const IncorrectAuthError = require('../errors/incorrect-auth-err');
const NotFoundError = require('../errors/not-found-err');
const EmailExistsError = require('../errors/email-exists-err');
const DefaultError = require('../errors/default-err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length < 1) { throw new NotFoundError('Пользователи не найдены'); } else { res.send({ data: users }); }
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователь не найдены'); } else { res.send({ data: user }); }
    })
    .catch(next);
};

const getUserAuth = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователь не найдены'); } else { res.send({ data: user }); }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) { throw new EmailExistsError('Пользователь с данной почтой уже существует'); } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            email,
            password: hash,
            name,
            about,
            avatar,
          }))
          .then((user) => res.send({ data: user }));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errValid = new IncorrectDataError(err.message);
        next(errValid);
      } else if (err.name === 'EmailExistsError') { next(err); } else {
        const errDef = new DefaultError(err.message);
        next(errDef);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user.id, { name, about }, { new: true })
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователи не найдены'); } else { res.send({ data: user }); }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errValid = new IncorrectDataError(err.message);
        next(errValid);
      } else if (err.name === 'NotFoundError') { next(err); } else {
        const errDef = new DefaultError(err.message);
        next(errDef);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user.id, { avatar }, { new: true })
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователь не найден'); } else { res.send({ data: user }); }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errValid = new IncorrectDataError(err.message);
        next(errValid);
      } else if (err.name === 'NotFoundError') { next(err); } else {
        const errDef = new DefaultError(err.message);
        next(errDef);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) { throw new IncorrectAuthError('Нет пароля или почты'); }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getUserAuth,
};
