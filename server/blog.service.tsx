import { connectDB, disconnectDB, getFirestoreInstance } from './server.service';
import Blog from './db-schemas/blog';
import User from './db-schemas/user';
import { Client, ClientErrorCode, APIErrorCode } from '@notionhq/client';
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
 * Uploads the blog content to the Notion DB
 * @param text
 * @param author
 * @param title
 * @param blogID
 * @returns Promise<any>
 */
export async function createBlogOnNotion(text: string, author: string, title: string, blogID: string): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      require('dotenv').config();
    }

    const pageKey = title.toLowerCase().replace(/ /g, '-'); // To do - make sure this is not already a title
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
      emoji: true, // refer to https://github.com/showdownjs/showdown/wiki/Emojis
    });
    const contentHTML = mkConverter.makeHtml(text);

    try {
      const notion = new Client({ auth: process.env.NOTION_DB_KEY })
      const databaseId = process.env.NOTION_POST_TABLE_ID;

      const response = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          title: { title: [{ "text": { "content": title } }] },
          pageKey: { "rich_text": [{ "text": { "content": pageKey } }] },
          author: { "rich_text": [{ "text": { "content": author } }] },
          date: { "rich_text": [{ "text": { "content": date } }] },
          content: { "rich_text": [{ "text": { "content": contentHTML } }] },
          blogID: { "rich_text": [{ "text": { "content": blogID } }] },
        },
      });
      // Fix later: refactor to remove this ts-ignore for broken notion types
      // @ts-ignore
      if (!response.url) {
        reject({ text: 'Could not upload data to Notion', code: 400 })
      }
      resolve({ text: 'Successfully uploaded to Notion DB', code: 201 });
    } catch (err) {
      var message = '';
      switch (err.code) {
        case ClientErrorCode.RequestTimeout:
          message = 'Timed out connecting to notion DB: '
          break
        case APIErrorCode.ObjectNotFound:
          message = 'Could not find notion DB page: ';
          break
        case APIErrorCode.Unauthorized:
          message = 'Unauthorized access to notion DB: ';
          break;
        default:
          message = 'Error connecting to notion instance: ';
      }
      reject({ text: (message + err.name + '-' + err.message + ': { ' + err.cause + '}'), code: 400 });
    }
  });
}

/**
 * Uploads the blog content to the Notion DB
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