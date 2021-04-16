const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
  {
    host: process.env.MY_MAIL_HOST,
    port: process.env.MY_MAIL_PORT,
    secure: true,
    auth: {
      user: `${process.env.MY_MAIL}`,
      pass: process.env.MY_PASS,
    },
  },
  {
    from: `Milana Asieva <${process.env.MY_MAIL}>`,
  },
);

const mailer = (message) => {
  transporter.sendMail(message, (err, info) => {
    if (err) return console.log(err);
    console.log('Email sent: ', info);
  });
};

module.exports = mailer;
