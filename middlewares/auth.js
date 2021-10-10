const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const IncorrectAuthError = require('../errors/incorrect-auth-err');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const errAuth = new IncorrectAuthError('Необходима авторизация');
    next(errAuth);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const errAuth = new IncorrectAuthError('Необходима авторизация');
    next(errAuth);
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
