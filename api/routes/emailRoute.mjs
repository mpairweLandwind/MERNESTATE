import emailController  from '../controllers/emailController.mjs'
import { verifyToken } from '../utils/verifyUser.mjs';
import express from 'express';

const router = express.Router();

router.post('/send', verifyToken, emailController.sendEmail);

export default router