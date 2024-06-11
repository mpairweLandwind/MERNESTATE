import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.js';
import prisma from "../lib/prisma.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));

  try {
    if (!req.body.role) {
      return next(errorHandler(400, 'Role is required'));
    }

    let dataToUpdate = {
      username: req.body.username,
      email: req.body.email,
      role: req.body.role,
      avatar: req.body.avatar,
    };

    if (req.body.password) {
      dataToUpdate.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: dataToUpdate,
    });

    const { password, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));

  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res) => {
  const requestedUserId = req.query.id; // Accessing the user ID from query parameters

  try {
    // Find the user by ID to ensure the user exists
    const user = await prisma.user.findUnique({
      where: {
        id: requestedUserId, // Ensure this is a string that matches your user ID type
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve all listings where userRef matches the requestedUserId
    const userListings = await prisma.listing.findMany({
      where: {
        userRef: requestedUserId, // Assuming userRef is the field that references the user in the listings table
      },
    });

    res.status(200).json({ listings: userListings }); // Structured response
  } catch (error) {
    console.error('Error retrieving user listings:', error);
    res.status(500).json({ message: 'Failed to get user listings' }); // Structured error response
  }
};




export const getUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return next(errorHandler(404, 'User not found!'));

    const { password, ...rest } = user;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};



export const checkEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const exists = !!user;

    res.json({ exists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.listingId;
  const tokenUserId = req.userRef;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userRef_postId: {
          userRef: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userRef: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to save the post!" });
  }
};


export const profilePosts = async (req, res) => {
  const tokenUserId = req.userRef;
  try {
    const userPosts = await prisma.listing.findMany({
      where: { userRef: tokenUserId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userRef: tokenUserId },
      include: {
        listing: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userRef;
  try {
    const number = await prisma.chat.count({
      where: {
        userRefs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });

    // Check if number is null or undefined
    if (number == null) {
      // Return 0 or handle null case as needed
      res.status(200).json(0);
    } else {
      res.status(200).json(number);
      console.log("no. of msga"+number);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get notification count!" });
  }
};
