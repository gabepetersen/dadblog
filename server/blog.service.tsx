import { connectDB, disconnectDB } from './server.service';
import { uploadFile } from '../server/storage.service';
import Blog from './db-schemas/blog';
import User from './db-schemas/user';

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';



/**
 * Creates a blog object from the db schema and puts it on the database
 * @description NOTE: updates the author's writtenBlog's array on the database too
 * @param author 
 * @param authorID 
 * @param title 
 */
export async function createBlogOnDB(author: string, authorID: string, title: string): Promise<any> {

  console.log({ author: author, authorID: authorID, title: title });
  // connect to the database
  try {
    await connectDB();
  } catch (err) {
    console.error(`Error Connecting to Database: ${err}`);
    return { text: `Error Connecting to Database: ${err}`, code: 400 };
  }

  var newBlog = new Blog();
  newBlog.author = author;
  newBlog.authorID = authorID;
  newBlog.title = title;
  // this will be id_file-name.md
  newBlog.filePath = (newBlog._id.toString() + '_' + title.toLowerCase().replace(/ /g, '-') + '.md');
  newBlog.date = Date.now();
  newBlog.stars = [];
  newBlog.comments = [];
  newBlog.hidden = false;

  var result = {};
  newBlog.save(async function (err, blog) {
    if (err) {
      console.error(`Error Saving Blog to Database: ${err}`);
      result = { text: `Error Saving Blog to Database: ${err}`, code: 400 };
    } else {
      // update the User's written Blogs 
      User.findOne({ _id: authorID }, async (err, user) => {
        if (err) {
          result = { text: `Error Updating User Object in Database: ${err}`, code: 400 };
          return;
        }
        // add the blog id to the user's writtenBlogs list
        user.writtenBlogs.push(blog._id);
        // make sure to save it silly ;-;
        await user.save();
      });
      console.log('Blog Successfully Uploaded to Database');
      result = { text: 'Successfully Uploaded to Database', filepath: blog.filePath, code: 201 };
    }
  });
  disconnectDB();
  return result;
}


export async function createBlogOnFS(text: string, author: string, title: string): Promise<any> {

  console.log({ text: text, author: author, title: title });

  const postsDirectory = path.join(process.cwd(), 'posts');
  console.log(postsDirectory);
  const blogID = uuidv4();

  // create url id / filename with replacing spaces and
  const url = blogID + '_' + title.toLowerCase().replace(/ /g, '-');
  // read all blogs in file, and check if there's no duplicate titles
  const fileNames = fs.readdirSync(postsDirectory);
  fileNames.forEach((filename) => {
    // check if post already exists
    if (filename.replace(/\.md$/, '') == url) {
      // send not acceptable if post exists already
      return { text: 'Title already exists', code: 406 };
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
      return { text: `Error in uploading to file server: ${err}`, code: 400 };
    }   
    return { text: `${(url + '.md')} Successfully Uploaded`, code: 201 };
  });
  // create errror event callback
  fileStream.on('error', (err) => {
    return { text: `Error in Writing File: ${err}`, code: 400 };
  })
}
