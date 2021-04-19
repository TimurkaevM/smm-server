const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./src/routes/authRouter');
const usersRouter = require('./src/routes/usersRouter');
const postRoutes = require('./src/routes/postRouter');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

app.use(express.json());
app.use('/smm', usersRouter);
app.use('/smm', authRouter);
app.use('/smm', postRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

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
