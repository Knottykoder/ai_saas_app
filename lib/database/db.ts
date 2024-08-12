import { Mongoose } from "mongoose";

const mongoose = require("mongoose");

const MONGODB_URL = process.env.NEXT_PUBLIC_MONOGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connToDB = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error("Missing DB url");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, { dbName: "ai_saas", bufferCommands: false,useNewUrlParser: true,
      useUnifiedTopology: true});

    cached.conn = await cached.promise
    return cached.conn
};
