import { config } from "dotenv";

config({ path: ".env" });

export const {
  PORT,
  NODE_ENV,
  DB_URL,
  CLERK_SECRET_KEY,
  CLERK_PUBLISHABLE_KEY,
  STREAM_API_KEY,
  STREAM_API_SECRET,
  INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY,
  CLIENT_URL,
} = process.env;
