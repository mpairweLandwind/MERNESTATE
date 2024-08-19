import './PropertyCard.css'
//import { AiFillHeart } from 'react-icons/ai'
import { truncate } from 'lodash'
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Heart from "../Heart/Heart";

const PropertyCard = ({ card }) => {
  const navigate = useNavigate();

  return (
    <div className="flexColStart r-card"
      onClick={() => navigate(`../properties/${card.id}`)}
    >
      <Heart id={card?.id} />
      <img src={card.image} alt="home" />
      <span className="secondaryText r-price">
        <span style={{ color: "orange" }}>$</span>
        <span>{card.regularPrice}</span>
      </span>
      <span className="primaryText">{truncate(card.name, { length: 20 })}</span>
      <span className="secondaryText">{truncate(card.description, { length: 80 })}</span>
    </div>
  );
};

// Define prop types for validation
PropertyCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.PropTypes.string.isRequired,
    regularPrice: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
};

export default PropertyCard;
