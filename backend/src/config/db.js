import mongoose from 'mongoose';
import env from './env.js';

/** Connect to MongoDB with retry-friendly logging */
export async function connectDB() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(env.mongodbUri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}

export default connectDB;
