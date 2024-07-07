// import { Marker, Popup } from 'react-leaflet';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBed, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

// function Pin({ listing }) {
//     return (
//         <Marker position={[listing.latitude, listing.longitude]}>
//             <Popup>
//                 <div className="popupContainer flex gap-4 items-center">
//                     <img src={listing.imageUrls[0]} alt={listing.name} className="w-16 h-16 object-cover rounded-full" />
//                     <div className="textContainer">
//                         <Link to={`/listing/${listing._id}`} className="font-semibold">{listing.name}</Link>
//                         <div className="flex items-center">
//                             <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 mr-2 text-gray-600" />
//                             <span className="text-sm text-gray-600">{listing.address}</span>
//                         </div>
//                         <div className="flex items-center">
//                             <FontAwesomeIcon icon={faBed} className="h-4 w-4 mr-2 text-gray-600" />
//                             <span className="text-sm text-gray-600">{listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms` : `${listing.bedrooms} bedroom`}</span>
//                         </div>
//                         <span className="text-sm text-green-600">${listing.offer ? listing.discountPrice : listing.regularPrice}</span>
//                     </div>
//                 </div>
//             </Popup>
//         </Marker>
//     );
// }

// Pin.propTypes = {
//     listing: PropTypes.shape({
//         _id: PropTypes.string.isRequired,
//         imageUrls: PropTypes.arrayOf(PropTypes.string),
//         name: PropTypes.string.isRequired,
//         address: PropTypes.string.isRequired,
//         offer: PropTypes.bool,
//         discountPrice: PropTypes.number,
//         regularPrice: PropTypes.number.isRequired,
//         bedrooms: PropTypes.number.isRequired,
//         bathrooms: PropTypes.number.isRequired,
//         latitude: PropTypes.number.isRequired,
//         longitude: PropTypes.number.isRequired,
//     }).isRequired
// };

// export default Pin;
