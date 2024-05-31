import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

export default function Contact({ listing, authToken }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);  
  // Retrieve tenant details from Redux store
  const tenant = useSelector(state => state.user);

  useEffect(() => {
    const fetchLandlord = async () => {
      if (listing && listing.userRef) {
        setLoading(true);
        try {
          const res = await fetch(`/api/user/${listing.userRef}`, {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          });
          const data = await res.json();
          setLandlord(data);
          setError(false);
        } catch (error) {
          console.error(error);
          setError(true);
        }
        setLoading(false);
      }
    };
    
    fetchLandlord();
  }, [listing, authToken]); // React to changes in listing or authToken

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {loading && <p>Loading landlord details...</p>}
      {error && <p>Could not load landlord details. Please try again later.</p>}
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>
            {' '}for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='3'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>
          <a
            href={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=Hi ${landlord.username},%0A%0A${message}%0A%0AFrom: ${tenant.name || 'Your Name'}, ${tenant.email || 'your.email@example.com'}`}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message
          </a>
        </div>
      )}
    </>
  );
}

// Define propTypes for Contact component
Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  authToken: PropTypes.string,
};