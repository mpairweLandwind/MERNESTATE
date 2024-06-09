import { MapContainer, TileLayer } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
// import Pin from "./pin/Pin";
import PropTypes from 'prop-types';
import Pin from "./pin/Pin";

function Map({ items }) {
    return (
      <MapContainer
      center={
        items.length === 1
          ? [items[0].latitude, items[0].longitude]
          : [-3.361260, 29.347916]
      }
      zoom={7}
      scrollWheelZoom={false}
      className="map"
    >
      <TileLayer
        attribution={`  $${items[0]?.regularPrice}`}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
    
    );
}

Map.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      latitude: PropTypes.number.isRequired,
      regularPrice: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
      bedroom: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Map;
