import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popupContainer">
          <img src={item.imageUrls[0]} alt="" />
          <div className="textContainer">
            <Link to={`/${item.id}`}>{item.name}</Link>
            <span>{item.bedrooms} bedrooms</span>
            <b>$ {item.regularPrice}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

Pin.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    bedrooms: PropTypes.number.isRequired,
    regularPrice: PropTypes.number.isRequired,
  }).isRequired,
};

export default Pin;
