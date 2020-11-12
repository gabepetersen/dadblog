import { NextApiRequest, NextApiResponse } from 'next'

// Big thank you to Jesse Heaslip for this wonderful article
// https://blog.bitsrc.io/email-confirmation-with-react-257e5d9de725

import { connectDB, disconnectDB } from '../../../../server/server.service';
// this is annoying, we should fix later
import User from '../../../../server/db-schemas/user';

// This function basically sets the User confirmed value to true
export default async (req: NextApiRequest, res: NextApiResponse) => {

  // get id
  const id = req.query.id;
  console.log("Here is the other id: " + id);

   // connect to the database
   try {
    await connectDB();
  } catch (err) {
    console.error(`Error Connecting to Database: ${err}`);
    res.status(503).json({ text: `Error Connecting to Database: ${err}`, code: 0 });
  }

  var user = null;
  try {
    user = await User.findById(id);
    console.log('user: ', user);
  } catch (err) {
    res.status(400).json({ text: `Could Not Get User: ${err}`, code: 0 });
  }
  // if no user exists under the id, return error response
  if (!user) {
    res.status(404).json({ text: "User not Found", code: 0 });
  // if the user is found but not confirmed, update them to confirmed
  } else if (user && !user.confirmed) {
    try {
      await User.findByIdAndUpdate(id, { confirmed: true })
      res.status(201).json({ text: "Email Confirmed!", code: 0 });
    } catch (err) {
      console.error(err);
      res.status(400).json({ text: `Could Not Update User: ${err}`, code: 0 });
    }
  // if the user is already confirmed => do nothing
  } else {
    res.status(100).json({ text: "Email already Confirmed", code: 0 });
  }

  await disconnectDB();

}