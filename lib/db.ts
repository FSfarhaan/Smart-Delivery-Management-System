import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MongoDB URI is missing in .env file");
}

// Extend global object to include mongoose cache
declare global {
  var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
}

// Use globalThis to prevent type errors
globalThis.mongoose = globalThis.mongoose || { conn: null, promise: null };

export async function connectDB(): Promise<Mongoose> {
  if (globalThis.mongoose.conn) return globalThis.mongoose.conn;

  if (!globalThis.mongoose.promise) {
    globalThis.mongoose.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "smart-delivery", // Database Name
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }

  globalThis.mongoose.conn = await globalThis.mongoose.promise;
  return globalThis.mongoose.conn;
}
