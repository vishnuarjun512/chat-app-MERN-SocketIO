import express from "express";
import {
  createConversation,
  createMessage,
  deleteConversation,
  getAllFriends,
  getMessages,
} from "../controllers/conversation.controller.js";

const router = express.Router();

router.post("/", createConversation);
router.post("/deleteConversation", deleteConversation);
router.post("/message", createMessage);
router.get("/message/:conversationId", getMessages);

router.get("/:userId", getAllFriends);

export default router;
