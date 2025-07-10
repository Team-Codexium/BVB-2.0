import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, htmlContent) => {

  try
  {
    console.log("Sending email function startss");
      const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.BVB_EMAIL,
      pass: process.env.BVB_PASS
    }
  });

  const result = await transporter.sendMail({
    from: process.env.BVB_EMAIL,
    to,
    subject,
    html: htmlContent
  });
    if(!result) console.log("No result from nodemailer");

  console.log("Email sent successfully:");
  return { success: true, message: "Email sent successfully" };

  }
  catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
};
