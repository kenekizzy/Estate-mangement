import nodeMailer from "nodemailer"
import fs from "fs"
import path from "path"

const transporter = nodeMailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
       user: "kizitokene6@gmail.com",
       pass: process.env.NODEMAILER_PASSWORD,
     },

  });


const sendEmail = async (to, subject, text, html) => {
  try {
     const mailOptions = {
       from: 'kizitokene6@gmail.com',  
       to,  
       subject,   
       text,
       html
     };
     await transporter.sendMail(mailOptions);
     console.log('Email sent successfully.');
   } catch (error) {
     console.error('Error sending email:', error);
     throw error;  
   }
};

const sendVerificationEmail = async (to, token, name) => {
  const subject = 'Email Verification'
  const verificationEmailUrl = `http://localhost:5173/verify-email?token=${token}&username=${name}`
  const text = `Hi ${name}, Your verification is almost complete,
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Your verification is almost complete,</p>
  <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
  <p>If you did not create an account, then ignore this email.</p></div>`;
  await sendEmail(to, subject, text, html)

}

const sendPasswordResetEmail = async (email) => {
  const subject = 'Password Reset Mail'
  const resetLink = `http://localhost:5173/reset-password`
  const text = `You have clicked on the reset password button,
  If this was you click on the link: ${resetLink} to reset your password. 
  If you did not trigger this action, then ignore this email.  `
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>You have clicked on the reset password button</strong></h4>
  <p>If this was you click on the link: ${resetLink} to reset your password.</p>
  <p>If you did not trigger this action, then ignore this email</p></div>`
  await sendEmail(email, subject, text, html)
}

export { sendVerificationEmail, sendPasswordResetEmail }