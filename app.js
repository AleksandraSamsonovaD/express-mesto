const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {createUser, login} = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const IncorrectDataError = require('./errors/incorrect-data-err');


const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
  }),
}),login);
app.post('/signup',celebrate({
  body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
  }),
}), createUser); 
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(errors());
app.use((err, req, res, next) => {
  if (err.name=='Bad Request'){
    err = new IncorrectDataError(err.validation.message);
  } 
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

app.listen(PORT, "localhost", () => {
});
