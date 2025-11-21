import { StreamChat } from "stream-chat";
import { STREAM_API_KEY, STREAM_API_SECRET } from "./env";

if (!STREAM_API_KEY || !STREAM_API_SECRET) {
  console.error("Stream API key or API Secret is missing");
}

export const streamClient = StreamChat.getInstance(
  STREAM_API_KEY,
  STREAM_API_SECRET
);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData);
    return userData;
  } catch (error) {
    console.error("Error Upserting Stream User:", error);
  }
};

export const deleteStreamUser = async (userData) => {
  try {
    await streamClient.deleteUser(userId);
    console.log("Stream User Successfully deleted");
  } catch (error) {
    console.error("Error Deleting Stream User:", error);
  }
};

// todo: add another methode to generateToken
