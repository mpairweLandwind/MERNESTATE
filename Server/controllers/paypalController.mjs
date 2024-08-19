//import paypal from '@paypal/checkout-server-sdk';
//import { client } from '../paypal.mjs';
import prisma from '../lib/prisma.mjs';

// export const createOrder = async (req, res) => {
//     const { amount, userId, propertyId, propertyType } = req.body;

//     try {
//         const request = new paypal.orders.OrdersCreateRequest();
//         request.prefer("return=representation");
//         request.requestBody({
//             intent: 'CAPTURE',
//             purchase_units: [{
//                 amount: {
//                     currency_code: 'USD',
//                     value: amount,
//                 },
//             }],
//         });

//         const order = await client.execute(request);

//         // Save transaction to database
//         const transaction = await prisma.transaction.create({
//             data: {
//                 orderID: order.result.id,
//                 userId,
//                 propertyId,
//                 amount: parseFloat(amount),
//                 status: 'CREATED',
//                 ...(propertyType === 'listing' ? { listing: { connect: { id: propertyId } } } : {}),
//                 ...(propertyType === 'maintenance' ? { maintenance: { connect: { id: propertyId } } } : {}),
//             },
//         });

//         res.status(201).json({ id: order.result.id, transactionId: transaction.id });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// export const captureOrder = async (req, res) => {
//     const { orderID } = req.body;

//     try {
//         const request = new paypal.orders.OrdersCaptureRequest(orderID);
//         request.requestBody({});

//         const capture = await client.execute(request);

//         // Update transaction status in the database
//         const transaction = await prisma.transaction.update({
//             where: { orderID },
//             data: { status: 'COMPLETED' },
//         });

//         res.status(200).json({ capture: capture.result, transactionId: transaction.id });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


export const createOrder = async (req, res) => {
    try {
      const { userId, propertyId, propertyType, amount, orderId } = req.body;
  
      // Create a new transaction in the database using Prisma
      const transaction = await prisma.transaction.create({
        data: {
          userId,
          propertyId,
          propertyType,
          amount,
          orderId,
          status: 'completed',
        },
      });
  
      // Respond with the created transaction
      res.status(201).json({ message: 'Transaction completed successfully', transaction });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Error creating order', error });
    }
  };