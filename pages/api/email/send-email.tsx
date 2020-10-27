import { NextApiRequest, NextApiResponse } from 'next';

import { sendEmail } from '../../../server/email/email.service';
import { confirmTemplate } from '../../../server/email/email-templates';

// this is annoying, we should fix later
import User from '../../../server/db-schemas/user';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;


  var user = null;
  try {
    user = await User.findOne({ email });
    console.log("Level 2");
  } catch (err) {
    res.status(400).json({ text: `Could Not Get User: ${err}`, code: 0 });
  }

  // if no user spit out error
  if (!user) {
    res.status(400).json({ text: "User not Created Yet - Sign Up", code: 0 });
  } else if (user && !user.confirmed) {
    // We have already seen this email address. But the user has not
    // clicked on the confirmation link. Send a confirmation email.
    try {
      console.log("Level 3");
      await sendEmail(user.email, confirmTemplate(user._id));
    } catch (err) {
      res.status(400).json({ text: `Could Not Send Email: ${err}`, code: 0 });
    }

    res.status(200).json({ text: "Cofirmation Email Sent!", code: 1 });
  // if user already confirmed, tell the user
  } else {
    res.status(200).json({ text: "You are Already Confirmed!", code: 1 });
  }
}