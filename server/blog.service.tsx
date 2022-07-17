import { connectDB, disconnectDB, getFirestoreInstance } from './server.service';
import Blog from './db-schemas/blog';
import User from './db-schemas/user';
import showdown from 'showdown';
import { MongoBlogPost } from '../lib/types';
import { WriteResult } from 'firebase-admin/firestore';

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
    newBlog.blogID = blogID;
    newBlog.comments = [];
    newBlog.date = Date.now();
    newBlog.hidden = false;
    newBlog.pageKey = title.toLowerCase().replace(/ /g, '-'); // To do - make sure this is not already a title
    newBlog.stars = [];
    newBlog.title = title;

    // save the blog to db
    newBlog.save(async function (err: Error, blog: MongoBlogPost) {
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
            newWrittenBlogs.push(blog.blogID);
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
 * Uploads the blog content to Firestore
 * @param text
 * @param author
 * @param title
 * @param blogID
 * @returns Promise<any>
 */
export async function createBlogOnFirestore(text: string, author: string, title: string, blogID: string): Promise<WriteResult> {
  const firestore = await getFirestoreInstance();

  const pageKey = title.toLowerCase().replace(/ /g, '-');
  const docRef = firestore.doc(`blogs/${pageKey}`);
  const date = Date.now() + '';

  // Refer to https://www.npmjs.com/package/showdown for options list
  const mkConverter = new showdown.Converter({
    ghCompatibleHeaderId: true,
    parseImgDimensions: true,
    simplifiedAutoLink: true,
    excludeTrailingPunctuationFromURLs: true,
    literalMidWordAsterisks: true,
    strikethrough: true,
    tasklists: true,
    simpleLineBreaks: true,
    requireSpaceBeforeHeadingText: true,
    emoji: true // refer to https://github.com/showdownjs/showdown/wiki/Emojis
  });
  const content = mkConverter.makeHtml(text);

  return docRef.create({ author, blogID, content, date, title });
}
