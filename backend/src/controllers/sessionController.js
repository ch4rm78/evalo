import { chatClient, streamClient } from "../config/stream.js";
import { createId } from "@paralleldrive/cuid2";
import Session from "../models/Session.js";

export const createSession = async (req, res) => {
  try {
    const { problem, difficulty } = req.body;

    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      res
        .status(400)
        .json({ message: "Problem and Difficulty fields are required" });
    }

    // create unique id for stream video call
    const callId = `session_${createId()}`;

    // create a session in the database
    const session = await Session.create({
      problem,
      host: userId,
      difficulty,
      callId,
    });

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        createdBy: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    res.status(201).json({ session });
  } catch (error) {
    console.log(
      "Error in Create Session function in sessionController",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getActiveSessions = async (_, res) => {
  try {
    // populate the "host" field in the session table with the host's information
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.stauts(200).json({ sessions });
  } catch (error) {
    console.log(
      "Error in getActiveSessions function in sessionController",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyRecentSessions = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log(
      "Error in getMyRecentSessions function in sessionController",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params.id;

    const session = await Session.findById(id)
      .populate("host", "name")
      .populate("participant", "name");

    if (!session) res.status(404).json({ message: "Session not Found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log(
      "Error in getSessionById function in sessionController",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const joinSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;
    const session = await Session.findById(id);

    if (!session) res.status(404).json({ message: "Session not Found" });

    // check if the session is active
    if (session.status !== "active") {
      return res
        .status(400)
        .json({ message: "Cannot join a completed session" });
    }

    // check if the participant is the host
    if (session.host.toString() === userId.toString()) {
      return res
        .status(400)
        .json({
          message: "The host cannot join their session as a participant",
        });
    }

    // check if the session already has a participant
    if (session.participant)
      res.status(400).json({ message: "Session is Full" });

    session.participant = userId;
    await session.save();

    // add participant to the stream chat/video call session
    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers({ clerkId });
  } catch (error) {
    console.log(
      "Error in joinSession function in sessionController",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const endSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) res.status(404).json({ message: "Session not Found" });

    // check if the user is the host
    if (session.host.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only the host can end the session" });
    }

    // check if the session is already completed
    if (session.status === "completed") {
      return res
        .status(400)
        .json({ message: "The session has already been completed" });
    }

    // delete stream video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // delete stream chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    session.status = "completed";
    await session.save();
    res
      .status(200)
      .json({ message: "Session has been completed successfully", session });
  } catch (error) {
    console.log(
      "Error in endSession function in sessionController",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};
