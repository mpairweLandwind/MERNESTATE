// backend/paypal.js
import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// PayPal environment configuration
let environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
let client = new paypal.core.PayPalHttpClient(environment);

const generateAccessToken = async () => {
  const request = new paypal.core.AccessTokenRequest({
    grant_type: 'client_credentials'
  });

  try {
    const response = await client.execute(request);
    return response.result.access_token;
  } catch (error) {
    console.error('Error generating access token:', error);
    throw new Error('Unable to generate access token');
  }
};

export { client, generateAccessToken };
