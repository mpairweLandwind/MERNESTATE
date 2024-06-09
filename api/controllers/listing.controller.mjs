import prisma from '../lib/prisma.js';
import { errorHandler } from '../utils/error.js';
import jwt from "jsonwebtoken";


export const createListing = async (req, res) => {

  console.log('Request Body:', req.body); 

  const { listingData, postDetail } = req.body;


  // Log incoming request data for debugging
  console.log('Received postData:', listingData);
  console.log('Received postDetail:', postDetail);
  console.log('User:', req.user);

  // Check if required fields are present
  if (!listingData || !listingData.name || !listingData.type ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const userId = req.user.id; // Extract user ID from the verified token

    const listing = await prisma.listing.create({
      data: {
        ...listingData,
        userRef: userId, // Reference the user ID from the request object
        postDetail: postDetail ? { create: postDetail } : undefined,
      },
      select: {
        id: true,
        name: true,
        // Add other fields as necessary
      }
    });

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      _id: listing.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create listing', error: error.message });
  }
};



export const deleteListing = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found!' });
    }

    if (req.user.id !== listing.userRef) {
      return res.status(401).json({ message: 'You can only delete your own listings!' });
    }

    await prisma.listing.delete({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: 'Listing has been deleted!' });
    console.log("listing deleted successfully!")
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete listing' });
  }
};


export const updateListing = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found!' });
    }

    if (req.user.id !== listing.userRef) {
      return res.status(401).json({ message: 'You can only update your own listings!' });
    }

    const updatedListing = await prisma.listing.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(updatedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update listing' });
  }
};

/// Get a specific listing by ID, including post details and user info if a token is provided
export const getListing = async (req, res) => {
  const { id } = req.params;

  // Check if the ID parameter is provided
  if (!id) {
    return res.status(400).json({ error: 'ID parameter is required' });
  }

  try {
    // Find the listing with the associated post details and user info
    const listing = await prisma.listing.findUnique({
      where: { id: id },
      include: {
        postDetail: true, // Assuming your listing has a relation to postDetail
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    // Check if the listing was not found
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Extract the authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Process the request based on the presence of a token
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
          // Respond with an error if the token is invalid
          return res.status(403).json({ error: 'Invalid token' });
        }

        // Check if the current user has saved this post
        const saved = await prisma.savedPost.findUnique({
          where: {
            userRef_postId: {
              postId: id,
              userRef: payload.id,
            },
          },
        });

        // Respond with the listing and its saved status
        return res.status(200).json({ ...listing, isSaved: saved ? true : false });
      });
    } else {
      // Respond with the listing but indicate it is not saved (no token provided)
      res.status(200).json({ ...listing, isSaved: false });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Failed to retrieve listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get multiple listings with filters
export const getListings = async (req, res, next) => {
  try {
    const { searchTerm, offer, furnished, parking, type, sort, order, limit, startIndex, city, property, bedrooms, minPrice, maxPrice } = req.query;
    const parsedLimit = parseInt(limit, 10) || 9;
    const parsedStartIndex = parseInt(startIndex, 10) || 0;

    const whereClause = {
      name: {
        contains: searchTerm || '',
        mode: 'insensitive',
      },
      ...(offer !== undefined && { offer: offer === 'true' }),
      ...(furnished !== undefined && { furnished: furnished === 'true' }),
      ...(parking !== undefined && { parking: parking === 'true' }),
      ...(city && { city }),
      ...(property && { property }),
      ...(bedrooms && { bedrooms: parseInt(bedrooms) }),
      ...(minPrice && maxPrice && {
        regularPrice: {
          gte: parseFloat(minPrice),
          lte: parseFloat(maxPrice),
        },
      }),
    };

    // Check if type is defined and not 'all'
    if (type !== undefined && type !== 'all') {
      whereClause.type = type;
    }

    console.log('Query parameters:', req.query);
    console.log('Where clause:', whereClause);

    const listings = await prisma.listing.findMany({
      where: whereClause,
      orderBy: {
        [sort || 'createdAt']: order || 'desc',
      },
      skip: parsedStartIndex,
      take: parsedLimit,
    });

    console.log('Listings found:', listings);

    res.status(200).json(listings);
  } catch (error) {
    console.error('Error occurred:', error);
    next(errorHandler(500, 'Failed to get listings'));
  }
};
