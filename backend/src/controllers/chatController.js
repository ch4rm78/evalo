import { chatClient } from "../config/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    // use clerk ID for stream not mongodb id
    // it should match the id in the stream dashboard
    const token = chatClient.createToken(req.user.clerkId);
    return res.status(200).json({
      token,
      userId: req.user.clerkId,
      userName: req.user.name,
      userImage: req.user.image,
    });
  } catch (error) {
    console.log(`Error in chatController at getStreamToken function${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
