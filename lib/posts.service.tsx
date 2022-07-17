import Blog from '../server/db-schemas/blog';
import { connectDB, disconnectDB, getFirestoreInstance } from '../server/server.service';

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
