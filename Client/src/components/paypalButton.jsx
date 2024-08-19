import { useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import usePayPalScript from '../hooks/usePayPalScript';

const PaypalButton = ({ amount, userId, propertyId, propertyType }) => {
  const scriptLoaded = usePayPalScript();
  const serverUrl = "http://localhost:3000";

  useEffect(() => {
    if (!scriptLoaded || !userId || !propertyId || !propertyType || !amount) {
      console.error('Missing required fields or PayPal script not loaded:', { userId, propertyId, propertyType, amount });
      return;
    }

    const handlePayment = () => {
      window.paypal.Buttons({
        createOrder: (data, actions) => actions.order.create({
          purchase_units: [{ amount: { value: amount } }],
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
    };

    handlePayment();
  }, [scriptLoaded, amount, userId, propertyId, propertyType]);

  return <div id="paypal-button-container"></div>;
};

PaypalButton.propTypes = {
  amount: PropTypes.number.isRequired,
  userId: PropTypes.string.isRequired,
  propertyId: PropTypes.string.isRequired,
  propertyType: PropTypes.string.isRequired,
};

export default PaypalButton;
