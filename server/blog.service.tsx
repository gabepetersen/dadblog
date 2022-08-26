import { connectDB, disconnectDB, getFirestoreInstance } from './server.service';
import User from './db-schemas/user';
import showdown from 'showdown';
import { WriteResult } from 'firebase-admin/firestore';

/**
 * Adds a blog to a user's writtenBlog list
 * @param authorID 
 * @param title 
 * @returns Promise<any>
 */
export async function addBlogToUserData(authorID: string, title: string) {
  try {
    await connectDB();
    const userFilter = { _id: authorID }
    let user = await User.findOne(userFilter);
    if (user) {
      // update the user's writtenBlog's list
      const pageKey = title.toLowerCase().replace(/ /g, '-');
      const newWrittenBlogs = user.writtenBlogs;
      newWrittenBlogs.push(pageKey);
      await User.findOneAndUpdate(userFilter, { writtenBlogs: newWrittenBlogs });
    } else {
      throw new Error("User does not exist - cannot add to writtenBlogs");
    }
    disconnectDB();
  } catch (err) {
    throw new Error("Error trying to update user's written blogs: ", { cause: err });
  }
}

/**
 * Uploads the blog content to Firestore
 * @param text
 * @param author
 * @param authorID
 * @param title
 * @param blogID
 * @returns Promise<WriteResult>
 */
export async function createBlogOnFirestore(text: string, author: string, authorID: string, title: string, blogID: string): Promise<WriteResult> {
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

  return docRef.create({
    author, authorID, blogID, comments: [], content,
    date, hidden: false, pageKey, stars: [], title
  });
}
