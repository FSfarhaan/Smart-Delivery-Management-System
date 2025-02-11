import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MongoDB URI is missing in .env file");
}

interface GlobalMongoose {
  mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
}

const globalWithMongoose = global as unknown as GlobalMongoose;
globalWithMongoose.mongoose = globalWithMongoose.mongoose || { conn: null, promise: null };

export async function connectDB(): Promise<Mongoose> {
  if (globalWithMongoose.mongoose.conn) return globalWithMongoose.mongoose.conn;

  if (!globalWithMongoose.mongoose.promise) {
    globalWithMongoose.mongoose.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "smart-delivery",
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }

  globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
  return globalWithMongoose.mongoose.conn;
}
