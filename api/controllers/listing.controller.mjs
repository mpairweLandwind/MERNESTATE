import prisma from '../lib/prisma.js';

export const createListing = async (req, res) => {
  try {
    const listing = await prisma.listing.create({
      data: {
        ...req.body,
        userRef: req.user.id, // Associate the listing with the current user
      },
    });
    res.status(201).json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create listing' });
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


export const getListing = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found!' });
    }
    res.status(200).json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get listing' });
  }
};

export const getListings = async (req, res, next) => {
  try {
    const { searchTerm, offer, furnished, parking, type, sort, order, limit, startIndex } = req.query;
    const parsedLimit = parseInt(limit, 10) || 9;
    const parsedStartIndex = parseInt(startIndex, 10) || 0;

    const listings = await prisma.listing.findMany({
      where: {
        name: {
          contains: searchTerm || '',
          mode: 'insensitive',
        },
        ...(offer !== undefined && { offer: offer === 'true' }),
        ...(furnished !== undefined && { furnished: furnished === 'true' }),
        ...(parking !== undefined && { parking: parking === 'true' }),
        ...(type !== 'all' && type !== undefined && { type }),
      },
      orderBy: {
        [sort || 'createdAt']: order || 'desc',
      },
      skip: parsedStartIndex,
      take: parsedLimit,
    });

    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, 'Failed to get listings'));
  }
};