const { JWT_SECRET = '2f36f2bd49588e8c96b026da2c8bb2d736742ad4ec5811aeebe640005d3404e3' } = process.env;
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
