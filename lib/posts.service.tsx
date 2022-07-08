import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Client, ClientErrorCode, APIErrorCode } from '@notionhq/client';

// get current posts folder under current working directory
const postsDirectory = path.join(process.cwd(), 'posts');

// get blog post data from markdown files
export function getSortedPostsData() {
  // get file names under /posts
  console.log("\nposts directory for articles: ", postsDirectory);
  const fileNames = fs.readdirSync(postsDirectory);
  console.log("\nfilenames for articles: ", fileNames);
  const allPostsData = fileNames.map((fileName) => {

    // remove the blog id and '.md' from filename to get id
    const id = fileName.split('_')[1].replace(/\.md$/, '');

    // read markdwon file as a string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data as {date: string, title: string, author: string}
    }
  });
  // sort posts by date
  return allPostsData.sort((a, b) => {
    if(a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  // get all file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  /**
    Returns array that looks like this:
    [
      {
        params: {
          id: 'ssg-ssr'
        }
      },
      {
        params: {
          id: 'pre-rendering'
        }
      }
    ]
   */
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.split('_')[1].replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id: string) {
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
