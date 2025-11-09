import mongoose from "mongoose";
import { DB_URL } from "./env.js";

if (!DB_URL) {
  throw new Error("Please provide a valid database URL");
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URL);
    console.log("Connected to MongoDB", conn.connection.host);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
