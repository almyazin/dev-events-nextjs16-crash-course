import "server-only";
import mongoose, { type ConnectOptions, type Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// NOTE: Validate MONGODB_URI lazily inside connectDB() to avoid failing at import time.

interface MongooseConnectionCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

type GlobalWithMongooseCache = typeof globalThis & {
  mongooseCache?: MongooseConnectionCache;
};

const globalWithCache = globalThis as GlobalWithMongooseCache;

// Reuse the same cache object across hot reloads in development.
const cached = globalWithCache.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalWithCache.mongooseCache) {
  globalWithCache.mongooseCache = cached;
}

/**
 * Connect to MongoDB using a cached Mongoose connection.
 * Prevents creating multiple concurrent connections in development.
 */
export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable.");
    }

    const options: ConnectOptions = {
      bufferCommands: false,
    };

    // Store the in-flight promise so parallel requests share one connection attempt.
    cached.promise = mongoose.connect(MONGODB_URI, options);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise so a future request can retry the connection.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
