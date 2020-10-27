import { NextApiRequest, NextApiResponse } from 'next';

import User from '../../server/db-schemas/user';
import { connectDB, disconnectDB } from '../../server/server.service';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // extract the request data
  const { email, pass } = req.body;

  // connect to the database
  try {
    await connectDB();
  } catch (err) {
    console.error(`Error Connecting to Database: ${err}`);
    res.status(503).json({ text: `Error Connecting to Database: ${err}`, code: 0 });
  }

  // Query the DB for the User
  try {
    User.findOne({ email: email }, async (err, user) => {
      if (err) {
        console.error(err);
        res.status(400).json({ text: `Error Querying User: ${err}`, code: 0 });
        await disconnectDB();
      }
      if (!user) {
        // if user doesn't exist
        console.log("User not Found");
        res.status(404).json({ text: "User not Found", code: 0 });
        await disconnectDB();
      } else if (!user.validPassword(pass)) {
        // if user's password is false
        console.log("Invalid Password");
        res.status(406).json({ text: "Invalid Password", code: 0 });
        await disconnectDB();
      } else if(!user.confirmed) {
        console.log("Email Unconfirmed");
        res.status(406).json({ text: "Email Not Confirmed - Check Spam Folder", code: 0 });
        await disconnectDB();
      } else {
        // if they match, send new token to user
        var token = user.generateJWT();
        if (token) {
          res.status(202).json({ text: 'Succesfully Signed In', token: token, code: 1 });
          await disconnectDB();
        }
      }
    })
  } catch (err) {
    res.status(500).json({ text: `Error Gettting Docs: ${err}`, code: 0 });
    await disconnectDB();
  }
}