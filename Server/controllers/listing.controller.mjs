import prisma from '../lib/prisma.mjs';
import { errorHandler } from '../utils/error.mjs';
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
    // Log the received data for debugging
    console.log('Received data:', req.body);

    // Find the listing by its ID
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
    });

    // Check if the listing exists
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found!' });
    }

    // Verify that the user is authorized to update the listing
    if (req.user.id !== listing.userRef) {
      return res.status(401).json({ message: 'You can only update your own listings!' });
    }

    // Destructure req.body to exclude nested objects and immutable fields
    const { id, postDetail, user, createdAt, approvalStatus, isSaved, ...updateData } = req.body;

    // Convert string fields to appropriate types if necessary
    if (updateData.latitude) {
      updateData.latitude = parseFloat(updateData.latitude);
    }
    if (updateData.longitude) {
      updateData.longitude = parseFloat(updateData.longitude);
    }
    if (updateData.regularPrice) {
      updateData.regularPrice = parseFloat(updateData.regularPrice);
    }
    if (updateData.discountPrice) {
      updateData.discountPrice = parseFloat(updateData.discountPrice);
    }
    if (updateData.bathrooms) {
      updateData.bathrooms = parseInt(updateData.bathrooms, 10);
    }
    if (updateData.bedrooms) {
      updateData.bedrooms = parseInt(updateData.bedrooms, 10);
    }

    // Log the update data for debugging
    console.log('Update data:', updateData);

    // Update the listing with the non-nested data provided
    const updatedListing = await prisma.listing.update({
      where: { id: req.params.id },
      data: updateData,
    });

    // Log the updated listing ID for debugging
    console.log('Updated listing:', updatedListing.id);
    console.log('Updated successfully');

    // Return the id of the updated listing and a success message
    res.status(200).json({ id: updatedListing.id, message: 'Updated successfully' });
  } catch (error) {
    // Log the error for debugging
    console.error('Error updating listing:', error);

    // Handle errors and return a 500 status code
    res.status(500).json({ message: error.message });
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
      include: {
        user: true,  // Include user details in the result
      },
      orderBy: {
        [sort || 'createdAt']: order || 'desc',
      },
      skip: parsedStartIndex,
      take: parsedLimit,
    });

    console.log('Listings found:', listings);

    res.status(200).json(listings.map(listing => ({
      ...listing,
      user: {
        id: listing.user.id,
        username: listing.user.username,
        email: listing.user.email,
        status: listing.user.status
      }
    })));
  } catch (error) {
    console.error('Error occurred:', error);
    next(errorHandler(500, 'Failed to get listings'));
  }
};



// calculating percentage
export const getPropertyStatusPercentages = async (req, res) => {
  try {
    // Fetch total number of listings
    const totalListings = await prisma.listing.count();

    // Fetch count of listings by status
    const statusCounts = await prisma.listing.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    // Calculate percentage for each status
    const statusPercentages = statusCounts.map(item => ({
      name: item.status,
      percentValues: totalListings > 0 ? (item._count.status / totalListings) * 100 : 0,
    }));

    res.json(statusPercentages);
  } catch (error) {
    console.error("Error fetching property status percentages:", error);
    res.status(500).send("Failed to fetch data.");
  }
};