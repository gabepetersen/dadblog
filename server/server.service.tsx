import mongoose from 'mongoose';

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