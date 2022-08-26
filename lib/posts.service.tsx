import { getFirestoreInstance } from '../server/server.service';

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
