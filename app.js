const express = require('express');
const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');
const path = require('path');


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
  //useCreateIndex: true,
  //useFindAndModify: false
});

app.use('/users', require('./routes/users'));

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log('сервер запущен');
});