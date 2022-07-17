import { NextApiRequest, NextApiResponse } from 'next'
import { createBlogOnDB, createBlogOnFirestore } from '../../server/blog.service';
import { v4 as uuidv4 } from 'uuid';
import User from '../../server/db-schemas/user';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, text, token } = req.body;

  var exampleUser = new User();
  const userData = exampleUser.validateJWT(token);

  // if the token is not valid or the role is not writer
  if (!userData || (userData.role !== 'writer')) {
    res.status(403).json({ text: 'unauthorized user', code: 0 });
    return;
  }
  const blogID = uuidv4();

  // Promise all on uploading to file server and database
  Promise.all([
    createBlogOnDB(userData.name, userData._id, title, blogID),
    createBlogOnFirestore(text, userData.name, title, blogID)
  ]).then((results) => {
    // Check for first result since Firestore will throw error
    if (results[0].code < 300) {
      res.status(201).json({ text: 'Successfully Uploaded', code: 1 });
    } else {
      console.error(`Error: Mongo: ${results[0].text}, Firestore: ${results[1]}`)
      res.status(400).json({ text: `Error in uploading the Blog: Mongo: ${results[0].text}, Firestore: ${results[1]}`, code: 0 });
    }
  }).catch((err) => {
    console.error(`Error in uploading the Blog: ${err}`);
    res.status(400).json({ text: `Error in uploading the Blog: ${err}`, code: 0 });
  });
}

