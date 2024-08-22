import { useEffect, useState } from 'react';

const usePayPalScript = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const scriptId = 'paypal-js-sdk';

    // Check if the script is already present
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      setLoaded(true);
      return;
    }

    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    if (!clientId) {
      console.error('PayPal Client ID is not set');
      return;
    }
    console.log(`PayPal Client ID: ${clientId}`);

    // Create and append the script
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`; // Replace with your PayPal client ID
    script.async = true;
    script.onload = () => {
      setLoaded(true);
      console.log('PayPal SDK loaded successfully');
    };
    script.onerror = () => {
      console.error('PayPal SDK could not be loaded.');
      setLoaded(false);
    };
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      setLoaded(false);
      console.log('PayPal SDK script removed');
    };
  }, []);

  return loaded;
};

export default usePayPalScript;
