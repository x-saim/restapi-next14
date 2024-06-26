import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log('Already connected.');
    return;
  }
  if (connectionState === 2) {
    console.log('Connecting...');
    return;
  }
  try {
    mongoose.connect(MONGODB_URI, {
      dbName: 'next14-mongodb-restapi',
      bufferCommands: true,
    });
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error('Error: ', err);
  }
};

export default connect;
