const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
service: "gmail",             // Use Gmail service
  port: 465,                    // SSL port
  secure: true,                 // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS,       // use Gmail App Password, NOT your regular password
  },
});

const sendMail = async ({ to, subject, text, html }) => {
  return transporter.sendMail({
    from: `"Website Hub" <vinaykumardag1@gmail.com>`,
    to,
    subject,
    text,
    html,
  });
};

module.exports = { sendMail };
