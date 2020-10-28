import nodemailer from 'nodemailer';

console.log("Mail Creds: ", { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS });



export async function sendEmail(to, content) {
  let testAccount = await nodemailer.createTestAccount();

  // The credentials for the email account you want to send mail from.
  /*
  const credentials = {
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    service: 'gmail',
    auth: {
      // These environment variables will be pulled from the .env file
      user: process.env.MAIL_USER, 
      pass: process.env.MAIL_PASS  
    }
  }
  */
  const credentials = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  }

  // Getting Nodemailer all setup with the credentials for when the 'sendEmail()'
  // function is called.
  const transporter = nodemailer.createTransport(credentials)



   // The from and to addresses for the email that is about to be sent.
   const contacts = {
    from: process.env.MAIL_USER,
    to
   }
  
  // Combining the content and contacts into a single object that can
  // be passed to Nodemailer.
  const email = Object.assign({}, content, contacts);

  console.log("email object: ", email);

  // This file is imported into the controller as 'sendEmail'. Because 
  // 'transporter.sendMail()' below returns a promise we can write code like this
  // in the contoller when we are using the sendEmail() function.
  //
  //  sendEmail()
  //   .then(() => doSomethingElse())
  // 
  // If you are running into errors getting Nodemailer working, wrap the following 
  // line in a try/catch. Most likely is not loading the credentials properly in 
  // the .env file or failing to allow unsafe apps in your gmail settings.

  let info = await transporter.sendMail(email);

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
