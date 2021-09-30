const jwt = require('jsonwebtoken');
const IncorrectAuthError = require('../errors/incorrect-auth-err');

const JWT_SECRET = 'f83b7547452099462061734791da57443cc60828de7dcb8f7494eedceb3c889c';

const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
};

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
