// Modify this file: listing.controller.mjs

import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listing.controller.mjs';
import { verifyToken } from '../utils/verifyUser.js';

// Middleware to check if the user has the required role
const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).send('Access Denied');
  }
  next();
};

const router = express.Router();

// Assume that verifyToken middleware adds the user's role to req.user
router.post('/create', [verifyToken], createListing);
router.delete('/delete/:id', [verifyToken], deleteListing);
router.put('/update/:id', [verifyToken], updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

export default router;