import { useEffect, useState } from 'react';

const usePayPalScript = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.paypal) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID'; // Replace with your PayPal client ID
    script.onload = () => {
      setLoaded(true);
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
