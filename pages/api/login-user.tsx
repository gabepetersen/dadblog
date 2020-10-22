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
    res.status(503).json({ text: `Error Connecting to Database: ${err}` });
  }

  // Query the DB for the User
  try {
    User.findOne({ email: email }, async (err, user) => {
      if (err) {
        console.error(err);
        res.status(400).json({ text: `Error Querying User: ${err}` });
        await disconnectDB();
      }
      if (!user) {
        // if user doesn't exist
        console.log("User not Found");
        res.status(404).json({ text: "User not Found" });
        await disconnectDB();
      } else if (!user.validPassword(pass)) {
        // if user's password is false
        console.log("Invalid Password");
        res.status(406).json({ text: "Invalid Password" });
        await disconnectDB();
      } else {
        // if they match, send new token to user
        var token = user.generateJWT();
        if (token) {
          res.status(202).json({ text: 'Succesfully Signed In', token: token });
          await disconnectDB();
        }
      }
    })
  } catch (err) {
    res.status(500).json(`Error Gettting Docs: ${err}`);
    await disconnectDB();
  }
}