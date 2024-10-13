import express from "express";
import { verifyToken } from "../middleware/verifyToke.js";

import { addMessage } from "../controllers/message.controller.js";

const router = express.Router();

// Route handler

router.post("/:chatId", verifyToken, addMessage);

export default router;
