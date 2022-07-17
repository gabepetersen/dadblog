import mongoose from 'mongoose';
import * as admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore';
import { getApps } from 'firebase-admin/app';

// Big thanks to @paradoxinversion - Jedai Saboteur for the nice MongoDB w/ Next js example
// https://github.com/paradoxinversion/nextjs-mongodb.git

export async function connectDB() {
  var connectionString: string;

  // checking if the app is running in production mode
  if (process.env.NODE_ENV === 'production') {
    connectionString = process.env.MONGODB_URI;
  } else {
    // grabbing local .env file variables if in development mode
    // this is important for tokens too!!!
    require('dotenv').config();
    connectionString = process.env.MONGODB_URI;
  }

  try {
    // connect to the database
    const connection = await mongoose.connect(connectionString);
    console.log("Database Connected");
    return connection;
  } catch (err) {
    console.log("Can't connect to the database");
    throw err;
  }
}

export async function disconnectDB() {
  if (mongoose.connection) {
    await mongoose.connection.close(() => {
      console.log("Database Disconnected");
    })
  } else {
    console.error("No Current Connection Exists - Call connectDB() to start one");
  }
}

export async function getFirestoreInstance() {
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

  const firebaseConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_TOKEN);

  try {
    if (getApps().length) {
      const app = admin.app();
      return getFirestore(app);
    }
    console.log("Connecting to firebase");
    const app = admin.initializeApp({ credential: admin.credential.cert(firebaseConfig) });
    return getFirestore(app);
  } catch (err) {
    console.error("Error connecting to firebase", err);
    return null;
  }
}
