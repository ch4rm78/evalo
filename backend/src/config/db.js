import mongoose from "mongoose";
import { DB_URL } from "./env.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URL);
    console.log("Connected to MongoDB", conn.connection.host);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
