import mongoose from 'mongoose';

// Big thanks to @paradoxinversion - Jedai Saboteur for the nice MongoDB w/ Next js example
// https://github.com/paradoxinversion/nextjs-mongodb.git

export default async function connectDB() {
  var connectionString: string;


  // checking if the app is running in production mode
  if (process.env.NODE_ENV === 'production') {
    connectionString = process.env.MONGODB_URI;
  } else {
    // grabbing local .env file variables if in development mode
    require('dotenv').config();
    connectionString = process.env.MONGODB_URI;
  }

  try {
    // connect to the database
    const connection = await mongoose.connect(connectionString, { useNewUrlParser: true, });
    return connection;
  } catch (err) {
    console.log("Can't connect to the database");
    throw err;
  }
}