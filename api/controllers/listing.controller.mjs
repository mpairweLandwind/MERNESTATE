import prisma from '../lib/prisma.js';

export const createListing = async (req, res) => {
  try {
    const listing = await prisma.listing.create({
      data: {
        ...req.body,
        userRef: req.user.id, // Associate the listing with the current user
      },
      select: {
        id: true, // Selectively retrieve only the ID of the newly created listing
        name: true, // Optionally retrieve other fields as needed
        // Add other fields as necessary
      }
    });
    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      _id: listing.id, // Ensuring the ID is returned under the key '_id'
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


// Get a specific listing by ID
export const getListing = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID parameter is required' });
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: id },
      select: {
        _id: true, // Selectively retrieve the ID of the listing
        name: true,
        description: true,
        price: true,
        // additional fields as necessary
      }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({
      success: true,
      listing: {
        ...listing,
        _id: listing.id // Ensuring the ID is returned under the key '_id'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get multiple listings with filters
export const getListings = async (req, res, next) => {
  try {
    const { searchTerm, offer, furnished, parking, type, sort, order, limit, startIndex } = req.query;
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
    };

    if (type !== undefined && type !== 'all') {
      whereClause.type = type;
    }

    const listings = await prisma.listing.findMany({
      where: whereClause,
      orderBy: {
        [sort || 'createdAt']: order || 'desc',
      },
      skip: parsedStartIndex,
      take: parsedLimit,
      select: {
        _id: true, // Ensure ID is included
        name: true,
        description: true,
        price: true,
        // additional fields as needed
      }
    });

    res.status(200).json({
      success: true,
      listings: listings.map(listing => ({
        ...listing,
        _id: listing.id // Mapping database 'id' to '_id'
      }))
    });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, 'Failed to get listings'));
  }
};