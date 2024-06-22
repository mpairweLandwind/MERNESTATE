// routes/maintenanceRoutes.js
import express from 'express';
import {
  createMaintenance,
  getMaintenance,  
  deleteMaintenance,
} from '../controllers/maintenanceController.mjs';
import { verifyToken } from '../utils/verifyUser.mjs';

const router = express.Router();

router.post('/create', verifyToken,createMaintenance);
router.get('/get/:id', getMaintenance);
//router.post('/update/:id',verifyToken, updateMaintenance);
router.delete('/delete/:id',verifyToken, deleteMaintenance);

export default router;
