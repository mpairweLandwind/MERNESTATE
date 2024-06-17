import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import './Card.scss';
import { IoChatbubbleEllipses } from "react-icons/io5";
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Card({ listing, onChatClick }) {

  const { currentUser, token } = useSelector(state => state.user);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  if (!listing) {
    return <div>Loading...</div>; // Or any other loading indicator or message
  }

  let discountPercentage = 0;
  let newPrice = listing.regularPrice;

  if (listing.offer) {
    newPrice = listing.regularPrice * 0.5;  // 50% off the regular price
    if (listing.discountPrice > 0) {
      newPrice = Math.min(newPrice, listing.regularPrice - listing.discountPrice);
    }
  } else if (listing.discountPrice > 0) {
    newPrice = listing.regularPrice - listing.discountPrice;
  }
  
  discountPercentage = (1 - newPrice / listing.regularPrice) * 100;

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    try {
      const response = await axios.post('/api/user/save', { listingId: listing.id }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.data.message) {
        throw new Error('Failed to save the listing');
      }
      setSaved(true);
    } catch (error) {
      console.error('Error saving the listing:', error);
      setError(true);
    }
  };

  if (!currentUser || !token) {
    return null;
  }

  return (
    <div className='card'>
      {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
      <Link to={`/listing/${listing.id}`} className="imageContainer">
        <img src={listing.imageUrls[0]} alt={listing.name} />
        {(listing.offer || listing.discountPrice > 0) && (
          <div className="discountBadge">
            {discountPercentage}% OFF
          </div>
        )}
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/listing/${listing.id}`}>
            {listing.name}
          </Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          {listing.address}
        </p>
        <span className="price">
          {listing.discountPrice > 0 ? (
            <>
              <span className="lineThrough">${listing.regularPrice}</span>
              <span className="discountPrice">${newPrice}</span>                          
            </>
          ) : (
            <>
              <span className="lineThrough">${listing.regularPrice}</span>
              <span className="label-regular ml-2">(Regular Price)</span>
            </>
          )}
        </span>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms` : `${listing.bedrooms} bedroom`}</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bathroom`}</span>
            </div>
          </div>
          <div className="icons">
            <Tooltip title="Click to save the place to wishlist" placement="top" arrow>
              <Button
                variant="outlined" color='primary'
                onClick={handleSave}
                className={`chat-icon-button ${saved ? 'saved' : ''}`}
                startIcon={<img src="/save.png" alt="" />}
              >
                {saved ? 'Saved' : 'Save'}
              </Button>
            </Tooltip>
            <Tooltip title="Click to open chat" placement="top" arrow>
              <Button
                variant="contained"
                color="primary"
                className="chat-icon-button"
                onClick={() => onChatClick(listing.userRef)}
               
              >
                 <IoChatbubbleEllipses size={24} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  listing: PropTypes.shape({
    id: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    offer: PropTypes.bool,
    discountPrice: PropTypes.number,
    regularPrice: PropTypes.number.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    userRef: PropTypes.string.isRequired,
  }),
  onChatClick: PropTypes.func.isRequired
};

export default Card;
