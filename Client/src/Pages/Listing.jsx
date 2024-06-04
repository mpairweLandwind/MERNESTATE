import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation ,useLoaderData  } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector } from 'react-redux';
import { FaMapMarkerAlt} from 'react-icons/fa';
import DOMPurify from "dompurify";
import Map from '../components/Map';
//, FaParking, FaShare 
import axios from 'axios';  // Import Axios
import Contact from '../components/Contact';
import { fetchData } from '../lib/utils';
import './listing.scss'

export default function Listing() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector(state => state.user);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);

  useEffect(() => {
    // Redirect if currentUser or token is not valid
    if (!currentUser || !currentUser.token) {
      navigate('/sign-in', { state: { from: location }, replace: true });
    } else {
      const fetchListing = async () => {
        try {
          const response = await axios.get(`/api/listing/get/${params.listingId}`);
          setListing(response.data);
          setError(!response.data.success);
        } catch (error) {
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      fetchListing();
    }
  }, [params.listingId, currentUser, navigate, location]);

  const handleContactClick = () => {
    setContact(true);
  };

  if (!currentUser || !currentUser.token) {
    // This is just in case to prevent rendering if the check in useEffect somehow fails
    return null;
  }


  const handleSave = async () => {
    if (!currentUser) {
      navigate("/sign-in");
    }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      await fetchData(`/users/save { postId: post.id }`, { method: 'POST' }); 
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  return (
    <main className="features">
    {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
    {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
    {listing && !loading && !error && (
        <div className="singlePage">
            <div className="details">
                <div className="wrapper">
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
                    <div className="info">
                        <div className="top">
                            <div className="post">
                                <h1>{listing.name}</h1>
                                <div className="address">
                                    <FaMapMarkerAlt className='text-green-700' />
                                    <span>{listing.address}</span>
                                </div>
                                <div className="price">
                                    ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                                    {listing.type === 'rent' && ' / month'}
                                </div>
                            </div>
                            <div className="user">
                              <img src={listing.user.avatar} alt="" />
                               <span>{listing.user.username}</span>
                            </div>
                        </div>
                        <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(listing.postDetail.desc),
              }}
            ></div>
                    </div>
                </div>
            </div>
            <div className="features">
                <div className="wrapper">
                    <div className="listVertical">
                        <div className="feature">
                        <img src="/utility.png" alt="" />
                            <div className="featureText">
                                <span>Water Supply</span>
                                <p>{listing.utilities.water ? "Included" : "Not included"}</p>
                            </div>
                        </div>
                        <div className="feature">
                        <img src="/pet.png" alt="" />
                            <div className="featureText">
                                <span>Pet Policy</span>
                                <p>{listing.petFriendly ? "Pets Allowed" : "No Pets Allowed"}</p>
                            </div>
                        </div>
                        <div className="feature">
                        <img src="/fee.png" alt="" />
                            <div className="featureText">
                                <span>Income Requirement</span>
                                <p>{listing.incomeRequirement}</p>
                            </div>
                        </div>
                    </div>
                    <div className="sizes">
                        <div className="size">
                        <img src="/size.png" alt="" />
                            <span>{listing.size} sqft</span>
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
                                <p>{listing.nearby.school}m away</p>
                            </div>
                        </div>
                        <div className="feature">
                        <img src="/bus.png" alt="" />
                            <div className="featureText">
                                <span>Bus Stop</span>
                                <p>{listing.nearby.busStop}m away</p>
                            </div>
                        </div>
                        <div className="feature">
                        <img src="/fee.png" alt="" />
                            <div className="featureText">
                                <span>Restaurant</span>
                                <p>{listing.nearby.restaurant}m away</p>
                            </div>

                        </div>
                    </div>
                    <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[listing]} />
          </div>

                </div>
            </div>
            <div className="actions">
                {currentUser && (
                    <button onClick={handleContactClick} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                        <img src="/chat.png" alt="" />
                        Contact landlord
                    </button>
                )}
                {contact && <Contact listing={listing} authToken={currentUser.token} />}
                <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
            </div>
        </div>
    )}
</main>

  );
}