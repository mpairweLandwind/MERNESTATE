import { useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import usePayPalScript from '../hooks/usePayPalScript';

const PaypalButton = ({ amount, userId, propertyId, propertyType }) => {
  const scriptLoaded = usePayPalScript();

  useEffect(() => {
    if (scriptLoaded) {
      const handlePayment = () => {
        try {
          window.paypal.Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: amount,
                  },
                }],
              });
            },
            onApprove: (data, actions) => {
              return actions.order.capture().then(details => {
                console.log('Transaction completed by', details.payer.name.given_name);
                // Call your backend to save the transaction
                axios.post('/api/transaction/save', {
                  userId,
                  propertyId,
                  propertyType,
                  amount,
                  orderId: data.orderID,
                }).then(response => {
                  console.log('Transaction saved', response);
                }).catch(error => {
                  console.error('Error saving transaction', error);
                });
              });
            },
            onError: (err) => {
              console.error('PayPal Button error', err);
            },
            onCancel: (data) => {
              console.log('PayPal payment cancelled', data);
            },
          }).render('#paypal-button-container');
        } catch (error) {
          console.error('Error rendering PayPal Buttons', error);
        }
      };

      handlePayment();
    }
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
