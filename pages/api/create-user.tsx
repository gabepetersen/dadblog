import { NextApiRequest, NextApiResponse } from 'next'
import { v4 as UUID } from 'uuid';
import User from '../../db/schemas/user';
import connectDB from '../../db/db';

// this signs the user up or whateveh
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // extract the request data
  const { email, pass } = req.body;

  // connect to the database
  try {
    await connectDB();
  } catch (err) {
    console.error(`Error Connecting to Database: ${err}`);
    res.status(400).json({ text: `Error Connecting to Database: ${err}` });
  }
  
  // once the database is open, create the new user
  try {
    var newUser = new User();
    newUser.userid = UUID();
    newUser.email = email;
    newUser.date = Date.now();
    newUser.setPassword(pass);
  } catch (err) {
    console.log("Error Creating New User")
  }


  // upload the new user to the db
  newUser.save(function (err, user) {
    if (err) {
      // this error stems from demands not being met by the API or the database
      res.status(406).json({ text: `Error uploading User Info: ${err}` });
      console.error(`Error uploading User Info: ${err}`);
      return;
    } else {
      res.status(201).json({ text: `Succesfully signed up ${user}` });
      console.log(`Succesfully signed up ${user}` )
      return;
    }  
  });
}