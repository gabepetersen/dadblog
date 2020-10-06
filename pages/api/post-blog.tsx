import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  // I love ES6 babbyyyyyy
  const { title, text } = req.body.json();

  // create url id / filename
  const url = title.toLowerCase().replace(' ', '-');
  // check to see if unique title
  const fileNames = fs.readdirSync(postsDirectory);
  fileNames.forEach((filename) => {
    // get ride of .md
    if (filename.replace(/\.md$/, '') == url) {
      res.status(400).json({ text: 'Title already exists' });
      return;
    }
  });
  // create write stream
  const fileStream = fs.createWriteStream(('../posts/' + url + '.md'));
  // write to the md file
  fileStream.write('---\r\n');
  fileStream.write('title: \'' + title + '\'\r\n');
  fileStream.write('date: \'' + new Date() + '\'\r\n');
  fileStream.write('---\r\n\r\n');
  fileStream.write(text);
  // create finish event callback
  fileStream.on('finish', () => {
    res.status(200).json({ text: 'Blog Successfully Uploaded' })
  });
  // create errror event callback
  fileStream.on('error', (err) => {
    res.status(401).json({ text: `Error in Callback: ${err}` })
  })

}

