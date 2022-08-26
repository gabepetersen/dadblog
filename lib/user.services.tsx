import User from '../server/db-schemas/user';
import { connectDB, disconnectDB } from '../server/server.service';

export async function getUserByPageKey(authorPageKey: string) : Promise<typeof User|any> {
  try {
    await connectDB();
    // we don't want to include the salt or hash in this result
    // even though it probably wouldn't cause any issues if it was,
    // we want to make sure everything is top of security
    const userData = await User.find(
      { pageKey: authorPageKey },
      { salt: 0, hash: 0, confirmed: 0 });
    disconnectDB();

    return userData[0];
  } catch (err) {
    console.error('\nCould not fetch User object from DB: ', err, '\n');
    return null;
  }
}

export async function getAuthors() {
  try {
    await connectDB();
    // _id and date is causing serialization issues
    const userData = await User.find(
      { role: 'writer' },
      { _id: 0, salt: 0, hash: 0, confirmed: 0, date: 0 }).lean();
    disconnectDB();

    return userData;
  } catch (err) {
    console.error('\nCould not fetch User objects from DB: ', err, '\n');
    return null;
  }
}