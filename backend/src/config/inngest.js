import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "Evalo" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    if (!newUser) {
      throw new Error("Invalid user data");
    }

    await User.create(newUser);
    console.log("New User Created Succesfully", newUser);
    // try {
    //   if (!newUser) {
    //     throw new Error("Invalid user data");
    //   }
    //   const user = await User.create(newUser);
    //   console.log("New User Created Succesfully", user);
    // } catch (error) {
    //   console.error("Failed to sync user", error);
    // }
  }
);

const deleteUser = inngest.createFunction(
  { id: "delete-user" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;

    await User.deleteOne({ clerkId: id });
    console.log("User Deleted Succesfully", id);
    // try {
    //   if (!newUser) {
    //     throw new Error("Invalid user data");
    //   }
    //   const user = await User.create(newUser);
    //   console.log("New User Created Succesfully", user);
    // } catch (error) {
    //   console.error("Failed to sync user", error);
    // }
  }
);

export const functions = [syncUser, deleteUser];
