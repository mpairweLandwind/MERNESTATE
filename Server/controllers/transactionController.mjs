// controllers/transactionController.mjs

import prisma from '../lib/prisma.mjs'; // Adjust the path to your Prisma client


export const createTransaction = async (req, res) => {
  const { amount, orderId, propertyId, propertyType, userId } = req.body;

  try {
    // Validate required fields
    if (!amount || !orderId || !propertyId || !propertyType || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        paypalOrderId: orderId,
        propertyId,
        userId,
        status: 'Pending',
        ...(propertyType === 'listing' ? { listing: { connect: { id: propertyId } } } : {}),
        ...(propertyType === 'maintenance' ? { maintenance: { connect: { id: propertyId } } } : {}),
      },
    });

    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message });
  }
};
