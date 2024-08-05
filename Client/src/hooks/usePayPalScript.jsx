import { useEffect, useState } from 'react';

const usePayPalScript = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.paypal) {
      setLoaded(true);
      return;
    }


    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    if (!clientId) {
      console.error('PayPal Client ID is not set');
      return;
    }
    console.log(`PayPal Client ID: ${clientId}`);

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`; // Replace with your PayPal client ID
    script.onload = () => {
      setLoaded(true);
      console.log('PayPal SDK loaded successfully');
    };
    script.onerror = () => {
      console.error('PayPal SDK could not be loaded.');
      setLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return loaded;
};

export default usePayPalScript;
