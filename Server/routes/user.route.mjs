import express from 'express';
import { deleteUser, updateUser,  getUserListings, getUser, checkEmail, savePost,
    profilePosts,getUserMaintenances
   } from '../controllers/user.controller.mjs';
import { verifyToken } from '../utils/verifyUser.mjs';
//import { getNotificationNumber } from '../controllers/user.controller.mjs';

import {
    bookVisit,
    cancelBooking,
    createUser,
    getAllBookings,
    getAllFavorites,
    toFav,
  } from "../controllers/user.controller.mjs";
  import jwtCheck from '../config/auth0Config.js';


const router = express.Router();

router.post("/register",jwtCheck,createUser);
router.post("/bookVisit/:id", jwtCheck, bookVisit);
router.post("/allBookings", getAllBookings);
router.post("/removeBooking/:id", jwtCheck, cancelBooking);
router.post("/toFav/:rid", jwtCheck, toFav);
router.post("/allFav/", jwtCheck, getAllFavorites);


router.get('/check-email/:email', checkEmail);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/', verifyToken, getUserListings)
router.get('/maintenances/', verifyToken, getUserMaintenances)
router.get('/:id', verifyToken, getUser)
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);


//router.get('/user-role-monthly-counts',verifyToken, getUserRoleMonthlyCounts);

//router.get("/notification", verifyToken, getNotificationNumber);


export {router as userRouter};