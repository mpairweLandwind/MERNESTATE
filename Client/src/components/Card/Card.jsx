import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import './Card.scss';

function Card({ listing }) {
    // Check if listing is undefined or null
    if (!listing) {
        return <div>Loading...</div>; // Or any other loading indicator or message
    }

    return (
        <div className='card'>
            <Link to={`/listing/${listing.id}`} className="imageContainer">
                <img src={listing.imageUrls[0]} alt="" />
            </Link>
            <div className="textContainer">
                <h2 className="title">
                    <Link to={`/listing/${listing.id}`}>
                        {listing.name}
                    </Link>
                </h2>
                <p className="adress">
                <img src="/pin.png" alt="" />
                    {listing.address}
                </p>
                <span className="price">${listing.offer ? listing.discountPrice : listing.regularPrice}</span>
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
        id: PropTypes.string.isRequired, // Ensure this matches your actual data structure
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
