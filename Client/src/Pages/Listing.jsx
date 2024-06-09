import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaMapMarkerAlt ,FaShare} from 'react-icons/fa';
//import DOMPurify from 'dompurify';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import Map from '../components/Map';
import Contact from '../components/Contact';
import './listing.scss';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [listing, setListing] = useState(null);
  const { currentUser, token } = useSelector(state => state.user);
  const [contact, setContact] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!currentUser || !token) {
      navigate('/sign-in', { state: { from: location }, replace: true });
    } else {
      const fetchListing = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/api/listing/get/${params.listingId}`);
          if (response.data.error) {
            setError(true);
          } else {
            setListing(response.data);
            setSaved(response.data.isSaved);
            setError(false);
          }
        } catch (err) {
          console.error('Error fetching listing:', err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      fetchListing();
    }
  }, [params.listingId, currentUser, token, navigate, location]);

  const handleContactClick = () => {
    setContact(true);
  };

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
    <main className="features">
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
      {listing && !loading && !error && (
        <div className="singlePage">
          <div className="details">
            <div className="wrapper mt-3  ml-2">
              <Swiper navigation>
                {listing.imageUrls.map(url => (
                  <SwiperSlide key={url}>
                    <div
                      className='h-[550px]'
                      style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}
                    ></div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
              
              <div className="info ">
                <div className="top ml-4">
                  <div className="post ">
                    <h1>{listing.name}</h1>
                    <div className="address">
                      <FaMapMarkerAlt className='text-green-700' />
                      <span>{listing.address}</span>
                    </div>
                    <div className="price">
                         {listing.offer ? (
                                   <span className="discount-price">
                            ${listing.discountPrice.toLocaleString('en-US')} (Discounted)
                                  </span>
                                 ) : (
                                         <span className="regular-price">
                                                 ${listing.regularPrice.toLocaleString('en-US')} (Regular)
                                     </span>
                                      ) }
                                     {listing.type === 'rent' && ' / month'}
                        </div>
    
                    
                  </div>
                  <div className="user">
                    <img src={listing.user.avatar} alt="" />
                    <span>{listing.user.username}</span>
                  </div>
                </div>
                {/* <div
                  className="bottom"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(listing.postDetail.desc),
                  }}
                ></div> */}
              </div>
            </div>
          </div>
          <div className="features">
            <div className="wrapper mt-4">
                 <p> <span>{listing.postDetail.desc}</span></p>         
              <div className="listVertical">
                <div className="feature">
                  <img src="/utility.png" alt="" />
                  <div className="featureText">
                    <span>Utilities</span>
                    <p>{listing.postDetail.utilities === "owner" ? "Owner is responsible" : "Tenant is responsible"}</p>
                  </div>
                </div>
                <div className="feature">
                  <img src="/pet.png" alt="" />
                  <div className="featureText">
                    <span>Pet Policy</span>
                    <p>{listing.postDetail.pet === "allowed" ? "Pets Allowed" : "Pets not Allowed"}</p>
                  </div>
                </div>
                <div className="feature">
                  <img src="/fee.png" alt="" />
                  <div className="featureText">
                    <span>Income Requirement</span>
                    <p>{listing.postDetail.income}</p>
                  </div>
                </div>
              </div>
              <div className="sizes">
                <div className="size">
                  <img src="/size.png" alt="" />
                  <span>{listing.postDetail.size} sqft</span>
                </div>
                <div className="size">
                  <img src="/bed.png" alt="" />
                  <span>{listing.bedrooms} beds</span>
                </div>
                <div className="size">
                  <img src="/bath.png" alt="" />
                  <span>{listing.bathrooms} bath</span>
                </div>
              </div>
              <div className="listHorizontal">
                <div className="feature">
                  <img src="/school.png" alt="" />
                  <div className="featureText">
                    <span>School</span>
                    <p>{listing.postDetail.school > 999
                      ? listing.postDetail.school / 1000 + "km"
                      : listing.postDetail.school + "m"}{" "}
                      away</p>
                  </div>
                </div>
                <div className="feature">
                  <img src="/bus.png" alt="" />
                  <div className="featureText">
                    <span>Bus Stop</span>
                    <p>{listing.postDetail.bus}m away</p>
                  </div>
                </div>
                <div className="feature">
                  <img src="/restal.png" alt="" />
                  <div className="featureText">
                    <span>Restaurant</span>
                    <p>{listing.postDetail.restaurant}m away</p>
                  </div>
                </div>
              </div>
              <p className="title">Location</p>
              <div className="mapContainer">
                <Map items={[listing]} />
              </div>
            </div>
         
            <div className="flex justify-between items-center">
  {currentUser && (
    <button onClick={handleContactClick} className='flex items-center rounded-full  button contact'>
      <img src="/msg1.png" alt="" className="w-10 h-10 mr-2" />
      <p className='text-gray-700'> Contact Landlord</p>
    </button>
  )}
  {contact && <Contact listing={listing} authToken={token} />}
  <button
    onClick={handleSave}
    className={`flex text-gray-700 rounded-full   items-center button save ${saved ? 'saved' : ''}`}
  >
    <img src="/wish.png" alt="" className="w-10 h-10 mr-2 " />
  <span className='text-gray-700'> {saved ? "Place Saved" : "Save the Place"}</span>  
  </button>
</div>

        </div>
        </div>
      )}
    </main>
  );
}
