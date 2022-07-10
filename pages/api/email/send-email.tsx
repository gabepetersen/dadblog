import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../../server/email/email.service';
import { connectDB, disconnectDB } from '../../../server/server.service';
import { confirmTemplate } from '../../../server/email/email-templates';

// this is annoying, we should fix later
import User from '../../../server/db-schemas/user';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;

  // connect to the database
  try {
    await connectDB();
  } catch (err) {
    console.error(`Error connecting to database: ${err}`);
    res.status(503).json({ text: `Error connecting to database: ${err.message}`, code: 0 });
  }

  var user = null;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    console.error('Could not get user: ', err);
    res.status(400).json({ text: `Could not get user: ${err.message}`, code: 0 });
  }

  // if no user spit out error
  if (!user) {
    res.status(400).json({ text: "User not created yet - please sign up", code: 0 });
  } else if (user && !user.confirmed) {
    // We have already seen this email address. But the user has not
    // clicked on the confirmation link. Send a confirmation email.
    try {
      const info = await sendEmail(user.email, confirmTemplate(user._id));
      res.status(200).json({ text: `Confirmation email sent!`, code: 1 });
    } catch (err) {
      console.error('Could Not Send Email: ', err);
      res.status(400).json({ text: `Could Not Send Email: ${err.message}`, code: 0 });
    }   
  // if user already confirmed, tell the user
  } else {
    res.status(200).json({ text: "Your email is already confirmed!", code: 1 });
  }

  await disconnectDB();
}