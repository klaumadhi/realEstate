import express from "express";
import {
  shouldBeAdmin,
  shouldBeLoggedIn,
} from "../controllers/test.controller.js";
import { verifyToken } from "../middleware/verifyToke.js";

const router = express.Router();

// Route handler
router.get("/should-be-logged-in", verifyToken, shouldBeLoggedIn);
router.get("/should-be-admin", shouldBeAdmin);

export default router;
