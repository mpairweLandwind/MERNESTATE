//controllers/paymentController.js
import paypal from '@paypal/checkout-server-sdk';
import { client, generateAccessToken } from '../paypal.mjs';
import prisma from '../lib/prisma.mjs';

export const createOrder = async (req, res) => {
    const { amount, userId, propertyId, propertyType } = req.body;

    try {
        const accessToken = await generateAccessToken();
        const request = new paypal.orders.OrdersCreateRequest();
        request.headers.Authorization = `Bearer ${accessToken}`;
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount
                }
            }]
        });

        const order = await client.execute(request);

        // Save transaction to database
        const transaction = await prisma.transaction.create({
            data: {
                userId,
                propertyId,
                amount: parseFloat(amount),
                status: 'CREATED',
                ...(propertyType === 'listing' ? { listing: { connect: { id: propertyId } } } : {}),
                ...(propertyType === 'maintenance' ? { maintenance: { connect: { id: propertyId } } } : {})
            },
        });

        res.status(201).json({ id: order.result.id, transactionId: transaction.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const captureOrder = async (req, res) => {
    const { orderID, transactionId } = req.body;

    try {
        const accessToken = await generateAccessToken();
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.headers.Authorization = `Bearer ${accessToken}`;
        request.requestBody({});

        const capture = await client.execute(request);

        // Update transaction status in database
        await prisma.transaction.update({
            where: { id: transactionId },
            data: { status: 'COMPLETED' },
        });

        res.status(200).json(capture.result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
