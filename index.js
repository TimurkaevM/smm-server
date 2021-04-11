const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./src/routes/authRouter');
const usersRouter = require('./src/routes/usersRouter');
const postRoutes = require('./src/routes/postRouter');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/smm', usersRouter);
app.use('/smm', authRouter);
app.use('/smm', postRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));

async function start() {
  try {
    await mongoose.connect(process.env.MY_BASE, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(process.env.MY_PORT, () => {
      console.log(`Server has been started on port: ${process.env.MY_PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
