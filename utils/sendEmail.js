const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
const { text } = require("express");
dotenv.config();

const sendEmail = async (email, subject, url) => {
  console.log(process.env.SENDGRID_API_KEY);
  console.log(email, subject, url);
  console.log(process.env.EMAIL_USER);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    const msg = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: url,
      html: `<strong>${url}</strong>`,
    };
    await sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
