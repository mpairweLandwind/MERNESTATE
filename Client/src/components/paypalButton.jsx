import  { useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const PaypalButton = ({ amount, userId, propertyId, propertyType }) => {

  useEffect(() => {
    const addPaypalScript = async () => {
      if (!window.paypal) {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}&currency=USD`;
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => handlePayment();
        document.body.appendChild(script);
      } else {
        handlePayment();
      }
    };

    const handlePayment = () => {
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
      }).render('#paypal-button-container');
    };

    addPaypalScript();
  }, [amount, userId, propertyId, propertyType]);

  return <div id="paypal-button-container"></div>;
};

PaypalButton.propTypes = {
  amount: PropTypes.number.isRequired,
  userId: PropTypes.string.isRequired,
  propertyId: PropTypes.string.isRequired,
  propertyType: PropTypes.string.isRequired,
};

export default PaypalButton;
