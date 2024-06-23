import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.mjs';
import prisma from '../lib/prisma.mjs';
import { ObjectId } from 'mongodb';



export const updateUser = async (req, res, next) => {
  // Log the received data
  console.log('Received data:', req.body);

  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only update your own account!'));
  }

  try {
    // Ensure role is provided in the request body
    if (!req.body.role) {
      return next(errorHandler(400, 'Role is required'));
    }

    let dataToUpdate = {};

    // Add fields to dataToUpdate if they exist in req.body
    if (req.body.username) {
      dataToUpdate.username = req.body.username;
    }
    if (req.body.email) {
      dataToUpdate.email = req.body.email;
    }
    if (req.body.role) {
      dataToUpdate.role = req.body.role;
    }
    if (req.body.avatar) {
      dataToUpdate.avatar = req.body.avatar;
    }
    if (req.body.password) {
      dataToUpdate.password = await bcrypt.hash(req.body.password, 10);
    }

    // Check if dataToUpdate is empty
    if (Object.keys(dataToUpdate).length === 0) {
      return next(errorHandler(400, 'No valid fields to update'));
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id }, // Treat id as a string
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

// userController.js
export const getNotificationNumber = async (req, res) => {
  try {
    const tokenUserId = req.userRef // Hardcoded valid ObjectId for testing
    console.log('user id:',tokenUserId)
    if (!ObjectId.isValid(tokenUserId)) {
      console.error("Invalid user ID format");
      return res.status(400).json({ message: "Invalid user ID format" });
    }

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

    console.log('Query successful, count:', number);
    res.status(200).json({ count: number });
  } catch (err) {
    console.error('Error in getNotificationNumber:', err.message);
    res.status(500).json({ message: "Failed to get notification count!" });
  }
};
export const getUserRoleMonthlyCounts = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1); // January 1st of current year
    const endDate = new Date(currentYear, 11, 31); // December 31st of current year

    // Assuming you want to count by role and month without raw SQL
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        NOT: {
          role: 'admin'
        }
      },
      select: {
        createdAt: true,
        role: true
      }
    });

    // Processing data in JavaScript to group by month and role
    const counts = users.reduce((acc, user) => {
      const month = user.createdAt.getMonth();
      const role = user.role;
      if (!acc[month]) acc[month] = { landlord: 0, user: 0 };
      if (role === 'landlord' || role === 'user') {
        acc[month][role]++;
      }
      return acc;
    }, {});

    // Transform counts into the desired array format
    const result = Object.keys(counts).map(month => ({
      month: new Date(0, month).toLocaleString('default', { month: 'short' }),
      ...counts[month]
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching monthly user role counts:", error);
    res.status(500).send("Failed to fetch data.");
  }
};


export const getUserMaintenances = async (req, res) => {
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
    const userMaintenances = await prisma.maintenance.findMany({
      where: {
        userRef: requestedUserId, // Assuming userRef is the field that references the user in the listings table
      },
    });

    res.status(200).json({ maintenances: userMaintenances }); // Structured response
  } catch (error) {
    console.error('Error retrieving user listings:', error);
    res.status(500).json({ message: 'Failed to get user listings' }); // Structured error response
  }
};


export const getAdminEmailController = async (req, res) => {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: 'admin' },
      select: { email: true },
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    res.json({ data: { email: admin.email } });
    console.log('Admin email:', admin.email);
  } catch (error) {
    console.error('Error fetching admin email:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};