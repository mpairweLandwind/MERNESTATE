import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import './Card.scss';

function Card({ listing }) {
    // Check if listing is undefined or null
    if (!listing) {
        return <div>Loading...</div>; // Or any other loading indicator or message
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
        <div className='card'>
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
                        <button className="icon">
                            <img src="/save.png" alt="" />
                        </button>
                        <button className="icon">
                            <img src="/chat.png" alt="" />
                        </button>
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
    })
};

export default Card;
