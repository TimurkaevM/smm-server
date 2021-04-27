const nodemailer = require('nodemailer');

//создаем транспортер для отправки на mail
const transporter = nodemailer.createTransport(
  {
    pool: true,
    host: process.env.MY_MAIL_HOST,
    port: process.env.MY_MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MY_MAIL,
      pass: process.env.MY_PASS,
    },
  },
  {
    from: `Milana Asieva ${process.env.MY_MAIL_FROM}`,
  },
);

//вывод в консоль работоспособности nodemailer
transporter.verify((error, success) => {
  error
    ? console.log(error)
    : console.log('Server is ready to take our messages: ', success);
});

//Функция, которая параметром принимает сообщение и отправляет его
const mailer = (message) => {
  transporter.sendMail(message, (err, info) => {
    if (err) return console.log(err);
    console.log('Email sent: ', info);
  });
};

module.exports = mailer;
