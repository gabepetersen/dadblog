import { connectDB, disconnectDB } from './server.service';
import { uploadFile } from '../server/storage.service';
import Blog from './db-schemas/blog';
import User from './db-schemas/user';

import fs from 'fs';
import path from 'path';

/**
 * Creates a blog object from the db schema and puts it on the database
 * @description NOTE: updates the author's writtenBlog's array on the database too
 * @param author 
 * @param authorID 
 * @param title 
 * @returns Promise<any>
 */
export async function createBlogOnDB(author: string, authorID: string, title: string, blogID: string): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    console.log({ author: author, authorID: authorID, title: title });
    // connect to the database
    try {
      await connectDB();
    } catch (err) {
      console.error(`Error Connecting to Database: ${err}`);
      reject({ text: `Error Connecting to Database: ${err}`, code: 400 });
    }

    // create new instance of blog and fill out all the fields
    var newBlog = new Blog();
    newBlog.author = author;
    newBlog.authorID = authorID;
    newBlog.title = title;
    // this will be id_file-name.md
    newBlog.filePath = (blogID + '_' + title.toLowerCase().replace(/ /g, '-') + '.md');
    newBlog.date = Date.now();
    newBlog.stars = [];
    newBlog.comments = [];
    newBlog.hidden = false;

    // save the blog to db
    newBlog.save(async function (err, blog) {
      if (err) {
        console.error(`Error Saving Blog to Database: ${err}`);
        reject({ text: `Error Saving Blog to Database: ${err}`, code: 400 });
        disconnectDB();
      } else {
        try {
          // get the writer user db object
          const filter = { _id: authorID };
          let user = await User.findOne(filter);
          if (user) {
            // update the user's writtenBlog's list
            const newWrittenBlogs = user.writtenBlogs;
            newWrittenBlogs.push(blog.filePath);
            await User.findOneAndUpdate(filter, { writtenBlogs: newWrittenBlogs });
            console.log('Blog Successfully Uploaded to Database');
            disconnectDB();
            resolve({ text: 'Successfully Uploaded to Database', code: 201 });
          } else {
            disconnectDB();
            reject({ text: 'User Not Found', code: 404 });
          }
        } catch (err) {
          console.log('Error Uploading to DB: ', err);
          disconnectDB();
          reject({ text: `Error Uploading to DB: ${err}`, code: 400 });
        }   
      }
    });
  })
  
}

/**
 * Creates a blog file and uploads it to AWS S3 instance
 * @param text 
 * @param author 
 * @param title 
 * @returns Promise<any>
 */
export async function createBlogOnFS(text: string, author: string, title: string, blogID: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    console.log({ text: text, author: author, title: title });

    const postsDirectory = path.join(process.cwd(), 'posts');
    console.log(postsDirectory);

    // create url id / filename with replacing spaces and
    const url = blogID + '_' + title.toLowerCase().replace(/ /g, '-');
    // read all blogs in file, and check if there's no duplicate titles
    const fileNames = fs.readdirSync(postsDirectory);
    fileNames.forEach((filename) => {
      // check if post already exists
      if (filename.replace(/\.md$/, '') == url) {
        // send not acceptable if post exists already
        reject({ text: 'Title already exists', code: 406 });
      }
    });
    // create write stream
    const fileStream = fs.createWriteStream((postsDirectory + '/' + url + '.md'));
    fileStream.write('---\r\n');
    fileStream.write('title: \'' + title + '\'\r\n');
    fileStream.write('date: ' + Date.now() + '\r\n');
    fileStream.write('author: ' + author + '\r\n');
    fileStream.write('---\r\n\r\n');
    fileStream.write(text);
    fileStream.end();
    // create finish event callback - send created code
    fileStream.on('finish', async () => {
      try {
        // upload the file to s3
        if (await uploadFile((postsDirectory + '/' + url + '.md'), (url + '.md'))) {
          // if file is uploaded successfully - delete from local
          fs.unlinkSync((postsDirectory + '/' + url + '.md'));
        }
      } catch (err) {
        console.error(err);
        reject({ text: `Error in uploading to file server: ${err}`, code: 400 });
      }
      resolve({ text: `${(url + '.md')} Successfully Uploaded`, code: 201 });
    });
    // create errror event callback
    fileStream.on('error', (err) => {
      reject({ text: `Error in Writing File: ${err}`, code: 400 });
    });
  });
}
