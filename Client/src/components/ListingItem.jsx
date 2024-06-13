import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import PropTypes from 'prop-types';
import './listingitem.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBookmark } from '@fortawesome/free-solid-svg-icons';

export default function ListingItem({ listing }) {
  // Add a check to ensure listing is defined
  if (!listing) {
    return <div className='bg-white shadow-md rounded-lg w-full sm:w-[330px] p-4'>Invalid listing data</div>;
  }
  let discountPercentage = 0;
  let newPrice = listing.regularPrice;

  if (listing.offer) {
    // Calculate new price based on the offer
    newPrice = listing.regularPrice * 0.5;  // 50% off the regular price

    if (listing.discountPrice > 0) {
      // Calculate new price as the lesser of the two discounts
      newPrice = Math.min(newPrice, listing.regularPrice - listing.discountPrice);
    }
  } else if (listing.discountPrice > 0) {
    // No offer, just a discount price
    newPrice = listing.regularPrice - listing.discountPrice;
  }

  // Calculate discount percentage based on the final newPrice
  discountPercentage = (1 - newPrice / listing.regularPrice) * 100;
  return (
    <div className='listing-item'>
      <Link to={`/listing/${listing.id}`}>
        <div className='listing-header'>
          <img
            src={listing.imageUrls?.[0] || 'default-image-url.jpg'}
            alt='listing cover'
          />
          {discountPercentage > 0 && (
            <div className='discountBadge'>
              {discountPercentage.toFixed(0)}% OFF
            </div>
          )}
        </div>
        <div className='listing-content'>
          <p className='name poppins-black'>
            {listing.name}
          </p>
          <div className='listing-container'>
            <MdLocationOn className='icon-small' />
            <p className='listing-address'>
              {listing.address}
            </p>
          </div>
          <p className='listing-description'>
            {listing.description}
          </p>
          <span className="price poppins-black">
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

          <div className="bed-bath-info">
            <div className='left'>
              <div className='listing-detail  poppins-medium '>
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </div>
              <div className='listing-detail poppins-medium'>
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </div>
            </div>
            <div className="right">
              <div className="icons">
                <button className="icon">
                  <FontAwesomeIcon icon={faHeart} className='awesome-icon' />
                </button>
                <button className="icon">
                  <FontAwesomeIcon icon={faBookmark} className='awesome-icon' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Define PropTypes for ListingItem
ListingItem.propTypes = {
  listing: PropTypes.shape({
    id: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    description: PropTypes.string,
    offer: PropTypes.bool,
    discountPrice: PropTypes.number,
    regularPrice: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
  }).isRequired,
};
