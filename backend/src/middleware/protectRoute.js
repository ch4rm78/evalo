import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

      // check for user in the database
      const user = await User.findOne({ clerkId });

      if (!user) return res.status(404).json({ message: "User not found" });

      // add the user object to the request
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in the protectRoute Middleware");
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
