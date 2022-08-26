import { getFirestoreInstance } from '../server/server.service';

/**
 * Retrieves an array of all the blog post data from Firestore
 * @returns Promise<FirebaseFirestore.DocumentData[]>
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

/**
 * Retrieves the most recent posts from the DB
 * @param postLimit - Specifies how many posts are retrieved
 * @returns Promise<FirebaseFirestore.DocumentData[]>
 */
export async function getRecentPosts(postLimit = 6): Promise<FirebaseFirestore.DocumentData[]> {
  try {
    const firestore = await getFirestoreInstance();
    const blogsSnapshot = await firestore.collection('blogs')
      .orderBy('date', 'desc').limit(postLimit).get();
    return blogsSnapshot.docs.map(doc => doc.data());
  } catch (err) {
    console.error('\nCould not fetch blog posts from Firestore: ', err, '\n');
    return null;
  }
}

/**
 * Retrieves one post from Firestore
 * @param id - the blog pageKey id
 * @returns Promise<FirebaseFirestore.DocumentData> 
 */
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

/**
 * Retrieves all posts that an author has written
 * @param authorID - The mongoDB generated User ID that points to the blog author
 * @returns Promise<FirebaseFirestore.DocumentData[]>
 */
export async function getPostsByAuthorID(authorID: string) : Promise<FirebaseFirestore.DocumentData[]> {
  try {
    const firestore = await getFirestoreInstance();

    const blogsSnapshot = await firestore.collection('blogs')
      .where('authorID', '==', authorID)
      .orderBy('date', 'desc').get();
    return blogsSnapshot.docs.map(doc => doc.data());
  } catch (err) {
    console.error('\nCould not fetch blog posts from DB: ', err, '\n');
    return null;
  }
}
