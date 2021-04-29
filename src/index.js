const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const corsMiddleware = require('./middlewares/corsMiddleware');

// Подключение .env файла
require('dotenv').config();

// Подключение express
const app = express();

// Парсинг
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение morgan
app.use(morgan('combined'));

// Подключение cors и corsMiddleware
app.use(cors());
app.use(corsMiddleware);

// Подключение роутов
app.use('/smm', require('./routes'));

(async function () {
  try {
    // подключение БД
    await mongoose.connect(process.env.MY_BASE, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // слушатель порта
    app.listen(process.env.MY_PORT, () => {
      console.log(`Server has been starts on port: ${process.env.MY_PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
})();
