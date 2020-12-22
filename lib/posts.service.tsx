import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

// get current posts folder under current working directory
const postsDirectory = path.join(process.cwd(), 'posts');

// get blog post data from markdown files
export function getSortedPostsData() {
  // get file names under /posts
  console.log("posts directory: ", postsDirectory);
  const fileNames = fs.readdirSync(postsDirectory);
  console.log("filenames: ", fileNames);
  const allPostsData = fileNames.map((fileName) => {

    // remove the blog id and '.md' from filename to get id
    const id = fileName.split('_')[1].replace(/\.md$/, '');

    // read markdwon file as a string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    console.log('fileContents: ', fileContents);

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
  // have to do a little filtering since we have renamed our blog files :/
  console.log("posts directory in individual post: ", postsDirectory);
  const fileNames = fs.readdirSync(postsDirectory);
  var correctFile = '';
  console.log("file names in individual post: ", fileNames);
  fileNames.forEach((filename) => {
    if (filename.includes(`${id}.md`)) {
      correctFile = filename;
    } 
  })
  // make sure to get full path
  const fullPath = path.join(postsDirectory, correctFile);
  console.log("full path in individual post: ", fullPath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  console.log("file contents in individual post: ", fileContents);

  // use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // use remark to convert markdown to HTML string
  const processedContent = await remark().use(html).process(matterResult.content)
  const contentHTML = processedContent.toString();

  // Combine data with the id and contentHTML

  return {
    id, 
    contentHTML,
    ...matterResult.data as {date: string, title: string, author: string}
  }
}
