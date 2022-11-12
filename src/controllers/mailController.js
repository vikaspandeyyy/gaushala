const nodemailer = require("nodemailer");

exports.mailCreateTransport = (Mail) => {
  console.log(Mail);
  return (transporter = nodemailer.createTransport({
    host: Mail.MailHost,
    port: Mail.MailPort,
    // host: "smtp.gmail.com",
    // port: "587",
    secure: false, // true for 465, false for other ports
    auth: {
      user: Mail.MailUsername, // generated ethereal user
      pass: Mail.MailPassword, // generated ethereal password
    },
  }));

  // return (transporter = nodemailer.createTransport({
  //   // host: Mail.MailHost,
  //   // port: Mail.MailPort,
  //   host: "smtp.gmail.com",
  //   port: "587",
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: "lokostop123@gmail.com", // generated ethereal user
  //     pass: "loko@123", // generated ethereal password
  //   },
  // }));
};
