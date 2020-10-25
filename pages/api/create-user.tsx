import { NextApiRequest, NextApiResponse } from 'next'
import { v4 as UUID } from 'uuid';

import User from '../../server/db-schemas/user';
import { connectDB, disconnectDB } from '../../server/server.service';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // extract the request data
  const { name, email, pass } = req.body;

  // connect to the database
  try {
    await connectDB();
  } catch (err) {
    console.error(`Error Connecting to Database: ${err}`);
    res.status(503).json({ text: `Error Connecting to Database: ${err}` });
  }

  // once the database is open, create the new user
  try {
    var newUser = new User();
    newUser.email = email;
    newUser.name = name;
    newUser.role = 'user';
    newUser.date = Date.now();
    newUser.setPassword(pass);
    var token = newUser.generateJWT();
  } catch (err) {
    console.log("Error Creating New User");
    res.status(500).json({ text: `Error Creating New User: ${err}` });
  }


  // upload the new user to the db
  newUser.save(async function (err, user) {
    if (err) {
      // this error stems from demands not being met by the API or the database
      res.status(406).json({ text: `Error uploading User Info: ${err}` });
      await disconnectDB();
      return;
    } else {
      // if token is valid - pass token back to user
      if (token) {
        res.status(201).json({ text: `Succesfully Created User`, token: token });
        await disconnectDB();
        return;
      } else {
        res.status(500).json({ text: 'Cannot Generate Token' });
        await disconnectDB();
      }
    }  
  });
}