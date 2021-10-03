const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'director',
    required: true,
    require_protocol: true,
    validate: {
      validator: (v) => isUrl(v),
      message: 'Неправильный формат ссылки',
    },
  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'director',
    }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
