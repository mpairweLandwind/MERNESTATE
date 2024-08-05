import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import './Card.scss';
import { useSelector } from 'react-redux';


function MCard({ maintenance }) {
  const { currentUser, token } = useSelector(state => state.user);
  

  if (!maintenance) {
    return <div>Loading...</div>; // Or any other loading indicator or message
  }

 

  if (!currentUser || !token) {
    return null;
  }

  return (
    <div className='card'>     
      <Link to={`/maintenance/${maintenance.id}`} className="imageContainer">
        <img src={maintenance.imageUrls[0]} alt={maintenance.name} />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/maintenance/${maintenance.id}`}>
            {maintenance.name}
          </Link>
        </h2>
        <p className="type">Type: {maintenance.type}</p>
        <p className="status">Status: {maintenance.status}</p>
        <p className="address">
          <img src="/pin.png" alt="" />
          {maintenance.address}, {maintenance.city}
        </p>
        <span className="discountPrice">
          Maintenance Charge: ${maintenance.maintenanceCharge}
        </span>
       
      </div>
    </div>
  );
}

MCard.propTypes = {
  maintenance: PropTypes.shape({
    id: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    maintenanceCharge: PropTypes.number.isRequired,
    userRef: PropTypes.string.isRequired,
  }),
};

export default MCard;
