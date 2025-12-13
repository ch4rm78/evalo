import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { STREAM_API_KEY, STREAM_API_SECRET } from "./env.js";

if (!STREAM_API_KEY || !STREAM_API_SECRET) {
  console.error("Stream API key or API Secret is missing");
}

// Initialize chat client (using singleton pattern as per docs)
export const chatClient = StreamChat.getInstance(
  STREAM_API_KEY,
  STREAM_API_SECRET
);

export const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData);
    return userData;
  } catch (error) {
    console.error("Error Upserting Stream User:", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await streamClient.deleteUser(userId);
    console.log("Stream User Successfully deleted");
  } catch (error) {
    console.error("Error Deleting Stream User:", error);
  }
};

// todo: add another methode to generateToken
