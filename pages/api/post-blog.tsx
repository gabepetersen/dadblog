import { NextApiRequest, NextApiResponse } from 'next'
import { createBlogOnFirestore } from '../../server/blog.service';
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

  try {
    await createBlogOnFirestore(text, userData.name, userData._id, title, blogID);
  } catch (err) {
    console.error(`Error in uploading the Blog: ${err}`);
    res.status(400).json({ text: `Error in uploading the Blog: ${err}`, code: 0 });
    return;
  }
  res.status(201).json({ text: 'Successfully Uploaded', code: 1 });
}

