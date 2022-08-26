import User from '../server/db-schemas/user';
import Blog from '../server/db-schemas/blog';
import { connectDB, disconnectDB, getFirestoreInstance } from '../server/server.service';

/**
 * Returns an array of all the blog post data from MongoDB
 * @returns Promise<Array>
 */
export async function getSortedPostsData() : Promise<FirebaseFirestore.DocumentData[]>  {
  try {
    const firestore = await getFirestoreInstance();
    const blogsSnapshot = await firestore.collection('blogs')
      .orderBy('date', 'desc').get();
    return blogsSnapshot.docs.map(doc => doc.data());
  } catch (err) {
    console.error('\nCould not fetch blog posts from Firestore: ', err, '\n');
    return null;
  }
}

export async function getPostData(id: string) : Promise<FirebaseFirestore.DocumentData> {
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

export async function getPostsByAuthor(authorPageKey: string) : Promise<FirebaseFirestore.DocumentData[]> {
  try {
    // connect to the database
    await connectDB();
    const firestore = await getFirestoreInstance();

    // seperate queries so we don't directly associate username with the blog
    // this way we can use the authorID to associate with the blog since it won't change
    const userData = await User.find({ pageKey: authorPageKey });
    disconnectDB();
    const userid = userData[0]._id.toHexString();

    const blogsSnapshot = await firestore.collection('blogs')
      .where('authorID', '==', userid)
      .orderBy('date', 'desc').get();
    return blogsSnapshot.docs.map(doc => doc.data());
  } catch (err) {
    console.error('\nCould not fetch blog posts from DB: ', err, '\n');
    return null;
  }
}
