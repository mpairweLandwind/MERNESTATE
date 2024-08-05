
import PropTypes from 'prop-types'; // Import PropTypes for props validation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faMapMarkerAlt, faDollarSign, faBed, faBath, faUtensils, faDog, faFileInvoiceDollar, faSchool, faBus, faUtensilSpoon } from '@fortawesome/free-solid-svg-icons'; // Import necessary Font Awesome icons
import { Swiper, SwiperSlide } from 'swiper/react';
import Map from './components/Map';

function SinglePropertyView({ listing, currentUser }) {
    return (
        <div className='flex flex-col md:flex-col md:overflow-scroll h-full'>
            <div className="flex-3 overflow-y-scroll md:h-auto md:mb-12">
                <Swiper
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                >
                    {listing.imageUrls.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img src={image} alt={`Image ${index}`} className="w-full h-full" />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="mt-12">
                    <div className="flex justify-between gap-5">
                        <div className="flex flex-col">
                            <h1 className="font-normal">{listing.title}</h1>
                            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 mr-2 text-gray-700" />
                                <span>{listing.address}</span>
                            </div>
                            <div className="py-1.5 bg-yellow-200 bg-opacity-50 rounded-sm w-max text-lg font-light">
                                <FontAwesomeIcon icon={faDollarSign} className="h-4 w-4 mr-1 text-yellow-700" />
                                {listing.price}
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-5 p-5 rounded-lg bg-yellow-200 bg-opacity-20 font-semibold">
                            <img src={currentUser?.img} alt="" className="w-12 h-12 rounded-full" />
                            <span>{currentUser?.name}</span>
                        </div>
                    </div>
                    <div className="mt-12 text-gray-700 leading-5">
                        {listing.description}
                    </div>
                </div>
            </div>
            <div className="flex-2 bg-pink-50 h-full overflow-y-scroll">
                <div className="p-5 flex flex-col gap-5">
                    <p className="font-bold text-lg mb-2.5">General</p>
                    <div className="flex flex-col gap-5 p-5 bg-white rounded-lg">
                        <div className="flex items-center gap-2.5">
                            <FontAwesomeIcon icon={faUtensils} className="h-6 w-6 text-gray-600" />
                            <div>
                                <span className="font-bold">Utilities</span>
                                <p className="text-sm">Renter is responsible</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <FontAwesomeIcon icon={faDog} className="h-6 w-6 text-gray-600" />
                            <div>
                                <span className="font-bold">Pet Policy</span>
                                <p className="text-sm">Pets allowed</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <FontAwesomeIcon icon={faFileInvoiceDollar} className="h-6 w-6 text-gray-600" />
                            <div>
                                <span className="font-bold">Property Fees</span>
                                <p className="text-sm">Must have 3x the rent in total household income</p>
                            </div>
                        </div>
                    </div>
                    <p className="font-bold text-lg mb-2.5">Sizes</p>
                    <div className="flex justify-between p-5 bg-white rounded-lg">
                        <div className="flex items-center gap-2.5">
                            <FontAwesomeIcon icon={faUtensilSpoon} className="h-6 w-6 text-gray-600" />
                            <span>80sqft</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <FontAwesomeIcon icon={faBed} className="h-6 w-6 text-gray-600" />
                            <span>2 beds</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <FontAwesomeIcon icon={faBath} className="h-6 w-6 text-gray-600" />
                            <span>1 bathroom</span>
                        </div>
                    </div>
                    <p className="font-bold text-lg mb-2.5">Nearby Places</p>
                    <div className="flex justify-between p-5 bg-white rounded-lg">
                        <div className="flex items-center gap-2.5">
                            <FontAwesomeIcon icon={faSchool} className="h-6 w-6 text-gray-600" />
                            <div>
                                <span className="font-bold">School</span>
                                <p className="text-sm">250m away</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <FontAwesomeIcon icon={faBus} className="h-6 w-6 text-gray-600" />
                            <div>
                                <span className="font-bold">Bus Stop</span>
                                <p className="text-sm">100m away</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <FontAwesomeIcon icon={faUtensils} className="h-6 w-6 text-gray-600" />
                            <div>
                                <span className="font-bold">Restaurant</span>
                                <p className="text-sm">200m away</p>
                            </div>
                        </div>
                    </div>
                    <p className="font-bold text-lg mb-2.5">Location</p>
                    <div className="mapContainer w-full h-48 mb-5">
                        <Map items={[listing]} />
                    </div>
                    <div className="flex justify-between">
                        <button className="p-5 flex items-center gap-1.5 bg-white border border-yellow-300 rounded-sm cursor-pointer">
                            <img src="/chat.png" alt="" className="w-4 h-4" />
                            Send a Message
                        </button>
                        <button className="p-5 flex items-center gap-1.5 bg-white border border-yellow-300 rounded-sm cursor-pointer">
                            <img src="/save.png" alt="" className="w-4 h-4" />
                            Save the place
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// PropTypes for props validation
SinglePropertyView.propTypes = {
    listing: PropTypes.shape({
        imageUrls: PropTypes.arrayOf(PropTypes.string),
        title: PropTypes.string,
        address: PropTypes.string,
        price: PropTypes.number,
        description: PropTypes.string
    }).isRequired,
    currentUser: PropTypes.shape({
        img: PropTypes.string,
        name: PropTypes.string
    })
};

export default SinglePropertyView;
