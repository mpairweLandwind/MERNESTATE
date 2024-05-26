import express from 'express';
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
  getUserListings
} from '../controllers/listing.controller.mjs';
import { verifyToken } from '../utils/verifyUser.js';

// Middleware to check if the user has the required role
const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).send('Access Denied');
  }
  next();
};

const router = express.Router();

// Routes with verifyToken middleware
router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.put('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.get('/user/listings/:userId', verifyToken, getUserListings);

export default router;
