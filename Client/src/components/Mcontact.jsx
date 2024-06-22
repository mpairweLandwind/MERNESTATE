import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

export default function MContact({ maintenance }) {
  const [adminEmail, setAdminEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Retrieve currentUser and token from Redux store
  const { currentUser, token } = useSelector(state => state.user);

  useEffect(() => {
    const fetchAdminEmail = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/user/admin', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Failed to fetch admin email');
        const data = await res.json();

        console.log('Fetched admin email:', data.data.email);
        setAdminEmail(data.data.email);
        setError(false);
      } catch (error) {
        console.error('Error fetching admin email:', error);
        setError(true);
      }
      setLoading(false);
    };

    fetchAdminEmail();
  }, [token]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const sendEmail = async () => {
    const emailData = {
      senderEmail: currentUser.email,
      senderName: currentUser.username,
      recipientEmail: adminEmail,
      subject: `Regarding ${maintenance.name}`,
      message: message
    };

    // Log emailData to the console for debugging
    console.log("Sending email with the following data:", emailData);

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });
      if (!response.ok) throw new Error('Failed to send email');
      alert('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email');
    }
  };

  return (
    <>
      {loading && <p>Loading admin email...</p>}
      {error && <p>Could not load admin email. Please try again later.</p>}
      {adminEmail && (
        <div className='flex flex-col gap-2 w-1/2'>
          <p>
            Contact admin regarding{' '}
            <span className='font-semibold'>{maintenance.name.toLowerCase()}</span>
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
          <Tooltip title="Click to send email to admin" placement="top" arrow>
            <Button
              onClick={sendEmail}
              className='bg-slate-700 text-gray-900 text-center p-3 uppercase rounded-md hover:opacity-95'
            >
              Send Message
            </Button>
          </Tooltip>
        </div>
      )}
    </>
  );
}

MContact.propTypes = {
  maintenance: PropTypes.shape({
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
