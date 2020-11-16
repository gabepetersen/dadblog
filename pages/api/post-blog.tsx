import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';
import { createBucket, uploadFile } from '../../server/storage.service';

export default (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    // I love ES6 babbyyyyyy
    const { title, text, username } = req.body;

    if (username !== 'gabepetersen') {
      // send unauth code
      res.status(403).json({ text: 'unauthorized user' });
    }

    console.log(postsDirectory);

    // create url id / filename with replacing spaces
    const url = title.toLowerCase().replace(/ /g, '-');
    // check to see if unique title
    const fileNames = fs.readdirSync(postsDirectory);
    fileNames.forEach((filename) => {
      // check if post already exists
      if (filename.replace(/\.md$/, '') == url) {
        // send not acceptable if post exists already
        res.status(406).json({ text: 'Title already exists' });
        return;
      }
    });
    // create write stream
    const fileStream = fs.createWriteStream((postsDirectory + '/' + url + '.md'));
    fileStream.write('---\r\n');
    fileStream.write('title: \'' + title + '\'\r\n');
    fileStream.write('date: ' + Date.now() + '\r\n');
    fileStream.write('---\r\n\r\n');
    fileStream.write(text);
    fileStream.end();
    // create finish event callback - send created code
    fileStream.on('finish', () => {
      try {
        uploadFile((postsDirectory + '/' + url + '.md'), (url + '.md'));
      } catch (err) {
        console.error(err);
      }   
      res.status(201).json({ text: 'Blog Successfully Uploaded' });
      return;
    });
    // create errror event callback
    fileStream.on('error', (err) => {
      res.status(400).json({ text: `Error in Writing File: ${err}` });
      return;
    })
  } catch (err) {
    res.status(400).json({ text: `Error in Request: ${err}` });
  }
}

