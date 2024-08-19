import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// PayPal environment configuration
let environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
let client = new paypal.core.PayPalHttpClient(environment);

export { client };
