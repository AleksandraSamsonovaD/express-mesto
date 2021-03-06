/* eslint-disable no-param-reassign */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const IncorrectDataError = require('./errors/incorrect-data-err');
const NotFoundError = require('./errors/not-found-err');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new IncorrectDataError('Неправильный формат ссылки');
  }
  return value;
};
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.get('/api/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/api/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/api/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().custom(validateURL).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
}), createUser);
// auth проверяет авторизацию, в headers {authorization: "Bearer token_users"}
app.use('/api/users', auth, require('./routes/users'));
app.use('/api/cards', auth, require('./routes/cards'));

app.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  if (err.name === 'Bad Request' || err.error === 'Bad Request') {
    err = new IncorrectDataError(err.validation.message);
  }
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
});
