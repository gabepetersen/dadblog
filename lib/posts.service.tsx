import Blog from '../server/db-schemas/blog';
import { connectDB, disconnectDB, getFirestoreInstance } from '../server/server.service';
import { Client, ClientErrorCode, APIErrorCode } from '@notionhq/client';

/**
 * Returns an array of all the blog post data from MongoDB
 * @returns Promise<Array>
 */
export async function getSortedPostsData() {
  try {
    // connect to the database
    await connectDB();

    const allPostsData = await Blog.find({}, { _id: 0 }).lean();
    disconnectDB();
    // sort posts by date - and convert the date to be serialized properly
    return allPostsData.map((post) => {
      var postNew = post;
      postNew.date = post.date.getTime();
      return postNew;
    }).sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (err) {
    console.error('\nCould not fetch blog posts from DB: ', err, '\n');
    return {};
  }
}

/**
 * Returns an object with blog post data and the content from Notion
 * @param id
 * @returns Object
 */
export async function getPostDataNotion(id: string) {
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_DB_KEY })
    const databaseId = process.env.NOTION_POST_TABLE_ID;

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'pageKey',
        rich_text: {
          equals: id
        }
      }
    });
    
    const pageID = response.results[0].id;
    // Fix later: refactor to remove this ts-ignore for broken notion types
    // @ts-ignore
    const pageProperties = response.results[0].properties;

    return {
      id: pageID,
      pageKey: pageProperties.pageKey.rich_text[0].plain_text,
      title: pageProperties.title.title[0].plain_text,
      date: pageProperties.date.rich_text[0].plain_text,
      author: pageProperties.author.rich_text[0].plain_text,
      contentHTML: pageProperties.content.rich_text[0].plain_text
    }
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
    console.error(message, err.name, err.message, err.cause);
    return null;
  }
}

export async function getPostData(id: string) {
  const firestore = await getFirestoreInstance();

  const docRef = firestore.doc(`blogs/${id}`);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    return docSnap.data();
  } else if (!firestore) {
    throw new Error('Cannot connect to firestore instance');
  } else {
    throw new Error('Document does not exist on firestore')
  }
}