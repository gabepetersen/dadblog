import nodemailer from 'nodemailer';

/**
 * Sends an nodemailer email from the server with the given content
 * @param {string} to
 * @param {Object} content
 * @returns Promise<any>
 */
export async function sendEmail(to: string, content: { subject: string; html: string; text: string; }) {
  const transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    // port: 587,
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
  });

  return transporter.sendMail(Object.assign({}, {
    from: process.env.MAIL_USER,
    to
  }, content));
}
