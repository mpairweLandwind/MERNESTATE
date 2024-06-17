import express from 'express';
import { deleteUser, updateUser,  getUserListings, getUser, checkEmail, savePost,
    profilePosts,getUserRoleMonthlyCounts
    } from '../controllers/user.controller.mjs';
import { verifyToken } from '../utils/verifyUser.mjs';
//import { getNotificationNumber } from '../controllers/user.controller.mjs';


const router = express.Router();


router.get('/check-email/:email', checkEmail);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/', verifyToken, getUserListings)
router.get('/:id', verifyToken, getUser)
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);
router.get('/user-role-monthly-counts', getUserRoleMonthlyCounts);

//router.get("/notification", verifyToken, getNotificationNumber);


export default router;