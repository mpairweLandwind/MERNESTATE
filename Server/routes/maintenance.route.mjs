// routes/maintenanceRoutes.js
import express from 'express';
import {
  createMaintenance,
  getMaintenance,  
  deleteMaintenance,
} from '../controllers/maintenanceController.mjs';
//import { verifyToken } from '../utils/verifyUser.mjs';
import jwtCheck from "../config/auth0Config.js";

const router = express.Router();

router.post('/create', jwtCheck,createMaintenance);
router.get('/get/:id', getMaintenance);
//router.post('/update/:id',verifyToken, updateMaintenance);
router.delete('/delete/:id',jwtCheck, deleteMaintenance);

export default router;
