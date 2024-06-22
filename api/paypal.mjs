// backend/paypal.js
import paypal from '@paypal/checkout-server-sdk';
 
// PayPal environment configuration
let environment = new paypal.core.SandboxEnvironment('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET');
let client = new paypal.core.PayPalHttpClient(environment);

export {client};
