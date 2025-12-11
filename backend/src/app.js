import express from "express";
import { PORT, NODE_ENV } from "./config/env.js";
import path from "path";
import { connectDB } from "./config/db.js";
import cors from "cors";
import { CLIENT_URL } from "./config/env.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./config/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import { protectRoute } from "./middleware/protectRoute.js";
import chatRoutes from "./routes/chatRoute.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();

// middlewares
app.use(express.json());
// credentials:true ==> server allows a browser to include cookies on request
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// clerk auth middleware
app.use(clerkMiddleware()); // adds "auth" field to request objects

// api routes
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/session", sessionRoutes);

// in this case the "__dirname" is the current directory...so the backend folder
const __dirname = path.resolve();

app.get("/books", async (req, res) => {
  res.send("This is the list of books");
});

// make the app ready for production
if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("failed to start server", error);
  }
};

startServer();
