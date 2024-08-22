import { useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import usePayPalScript from '../hooks/usePayPalScript';

const PaypalButton = ({ amount, userId, propertyId, propertyType }) => {
  const scriptLoaded = usePayPalScript();
  const serverUrl = "http://localhost:3000";

  useEffect(() => {
    if (!scriptLoaded) {
      console.error('PayPal script not loaded.');
      return;
    }
    if (!userId || !propertyId || !propertyType || !amount) {
      console.error('Missing required fields:', { userId, propertyId, propertyType, amount });
      return;
    }

    const handlePayment = () => {
      try {
        window.paypal.Buttons({
          createOrder: (data, actions) => actions.order.create({
            purchase_units: [{ amount: { value: amount.toString() } }],
          }),
          onApprove: (data, actions) => actions.order.capture().then(details => {
            console.log('Transaction successful | completed by', details.payer.name.given_name);
            axios.post(`${serverUrl}/api/paypal/create-order`, {
              userId, propertyId, propertyType, amount, orderId: data.orderID,
            })
            .then(response => console.log('Transaction saved', response.data))
            .catch(error => console.error('Error saving transaction', error));
          }),
          onError: err => console.error('PayPal Button error', err),
          onCancel: data => console.log('PayPal payment cancelled', data),
        }).render('#paypal-button-container');
      } catch (error) {
        console.error('Error initializing PayPal Buttons:', error);
      }
    };

    handlePayment();
  }, [scriptLoaded, amount, userId, propertyId, propertyType]);

  return scriptLoaded && userId && propertyId && propertyType && amount ? (
    <div id="paypal-button-container"></div>
  ) : (
    <div>Loading PayPal Button...</div>
  );
};

PaypalButton.propTypes = {
  amount: PropTypes.number.isRequired,
  userId: PropTypes.string.isRequired,
  propertyId: PropTypes.string.isRequired,
  propertyType: PropTypes.string.isRequired,
};

export default PaypalButton;
