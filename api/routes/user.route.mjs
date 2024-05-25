import express from 'express';
import { deleteUser, updateUser,  getUserListings, getUser, checkEmail, savePost,
    profilePosts,
    getNotificationNumber} from '../controllers/user.controller.mjs';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();


router.get('/check-email/:email', checkEmail);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListings)
router.get('/:id', verifyToken, getUser)
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);



export default router;