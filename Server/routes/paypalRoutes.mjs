import express from 'express';
import { createOrder,  } from '../controllers/paypalController.mjs';

const router = express.Router();

router.post('/create-order', createOrder);
//router.post('/capture-order', captureOrder);

export default router;
