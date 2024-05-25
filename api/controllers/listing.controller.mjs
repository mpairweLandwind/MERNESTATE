import prisma from "../lib/prisma.js";

export const createListing = async (req, res) => {
  try {
    const listing = await prisma.listing.create({
      data: req.body
    });
    res.status(201).json(listing);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create listing" });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found!' });
    }

    if (req.user.id !== listing.userRef) {
      return res.status(401).json({ message: 'You can only delete your own listings!' });
    }

    await prisma.listing.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(200).json({ message: 'Listing has been deleted!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete listing" });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found!' });
    }

    if (req.user.id !== listing.userRef) {
      return res.status(401).json({ message: 'You can only update your own listings!' });
    }

    const updatedListing = await prisma.listing.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.status(200).json(updatedListing);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update listing" });
  }
};

export const getListing = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found!' });
    }
    res.status(200).json(listing);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get listing" });
  }
};

export const getListings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const listings = await prisma.listing.findMany({
      where: {
        name: {
          contains: req.query.searchTerm || '',
          mode: 'insensitive'
        },
        offer: req.query.offer !== 'false',
        furnished: req.query.furnished !== 'false',
        parking: req.query.parking !== 'false',
        type: req.query.type !== 'all' ? req.query.type : undefined
      },
      orderBy: {
        [req.query.sort || 'createdAt']: req.query.order || 'desc'
      },
      skip: startIndex,
      take: limit
    });
    res.status(200).json(listings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get listings" });
  }
};
