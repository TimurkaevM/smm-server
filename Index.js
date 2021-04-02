const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./src/routes/authRouter');
require('dotenv').config();

// const PORT = process.env.PORT || 80;
// console.log(process.env.MY_BASE);

const app = express();

app.use(express.json());
app.use('/smm', authRouter);
app.use(express.urlencoded({ extended: true }));

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
