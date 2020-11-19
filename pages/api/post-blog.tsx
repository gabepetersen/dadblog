import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
  
import { uploadFile, readFiles } from '../../server/storage.service';
import { connectDB, disconnectDB } from '../../server/server.service';

import User from '../../server/db-schemas/user';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // connect to the database
  try {
    await connectDB();
  } catch (err) {
    console.error(`Error Connecting to Database: ${err}`);
    res.status(503).json({ text: `Error Connecting to Database: ${err}`, code: 0 });
  }

  // I love ES6 babbyyyyyy
  const { title, text, token } = req.body;

  const exampleUser = new User();
  const userData = exampleUser.validateJWT(token);
  console.log(userData);

  // if the token is not valid or the role is not writer
  if (!userData || (userData.role !== 'writer') ) { 
    res.status(403).json({ text: 'unauthorized user', code: 0 });
    disconnectDB(); 
  }

  const postsDirectory = path.join(process.cwd(), 'posts');
  console.log(postsDirectory);
  const blogID = uuidv4();

  // create url id / filename with replacing spaces and
  const url = blogID + '_' + title.toLowerCase().replace(/ /g, '-');
  // check to see if unique title
  const fileNames = fs.readdirSync(postsDirectory);
  fileNames.forEach((filename) => {
    // check if post already exists
    if (filename.replace(/\.md$/, '') == url) {
      // send not acceptable if post exists already
      res.status(406).json({ text: 'Title already exists', code: 0 });
      return;
    }
  });
  // create write stream
  const fileStream = fs.createWriteStream((postsDirectory + '/' + url + '.md'));
  fileStream.write('---\r\n');
  fileStream.write('title: \'' + title + '\'\r\n');
  fileStream.write('date: ' + Date.now() + '\r\n');
  fileStream.write('author: ' + userData.name + '\r\n');
  fileStream.write('authorID: ' + userData._id + '\r\n');
  fileStream.write('---\r\n\r\n');
  fileStream.write(text);
  fileStream.end();
  // create finish event callback - send created code
  fileStream.on('finish', async () => {
    try {  
      User.findOne({ email: userData.email }, async (err, user) => {
        if (err) {
          res.status(400).json({ text: `Error writing to Database`, code: 0 });
          return;
        }
        // add the blog id to the user's writtenBlogs list
        user.writtenBlogs.push(url);
        // make sure to save it silly ;-;
        await user.save();
      });
      // upload the file to s3
      if (await uploadFile((postsDirectory + '/' + url + '.md'), (url + '.md'))) {
        // if file is uploaded successfully - delete from local
        fs.unlinkSync((postsDirectory + '/' + url + '.md'));
      }
    } catch (err) {
      console.error(err);
      disconnectDB();
    }   
    res.status(201).json({ text: `${(url + '.md')} Successfully Uploaded`, code: 1 });
    return;
  });
  // create errror event callback
  fileStream.on('error', (err) => {
    res.status(400).json({ text: `Error in Writing File: ${err}`, code: 0 });
    disconnectDB()
    return;
  })
  
}

