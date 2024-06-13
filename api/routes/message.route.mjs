import express from "express";
import {
  addMessage
} from "../controllers/message.controller.mjs";
import { verifyToken } from '../utils/verifyUser.mjs';

const router = express.Router();


router.post("/:chatId", verifyToken, addMessage);

export default router;
