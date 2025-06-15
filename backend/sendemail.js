import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.BVB_EMAIL,
      pass: process.env.BVB_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.BVB_EMAIL,
    to,
    subject,
    html: htmlContent
  });
};
