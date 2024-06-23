import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Slider from '../components/slider/Slider';
import { FaMapMarkerAlt, FaShare } from 'react-icons/fa';
import Map from '../components/Map';
import MContact from '../components/Mcontact';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import PaypalButton from '../components/paypalButton';

import './maintenance.scss';

export default function Maintenance() {
  const { currentUser, token } = useSelector(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [maintenance, setMaintenance] = useState(null);
  const [contact, setContact] = useState(false);
  

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!currentUser || !token) {
      navigate('/sign-in', { state: { from: location }, replace: true });
    } else {
      const fetchMaintenance = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/api/maintenance/get/${params.maintenanceId}`);
          if (response.data.error) {
            setError(true);
          } else {
            setMaintenance(response.data);          
            setError(false);
          }
        } catch (err) {
          console.error('Error fetching maintenance:', err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      fetchMaintenance();
    }
  }, [params.maintenanceId, currentUser, token, navigate, location]);

  const handleContactClick = () => {
    setContact(true);
  };

 
  if (!currentUser || !token) {
    return null;
  }

  return (
    <main className="features">
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
      {maintenance && !loading && !error && (
        <div className="singlePage">
          <div className="details">
            <div className="wrapper ml-2">
            {maintenance && maintenance.imageUrls && (
              <Slider images={maintenance.imageUrls} />
              )}
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
              <div className="info">
                <div className="top ml-4">
                  <div className="post">
                    <h1>{maintenance.name}</h1>
                    <div className="address">
                      <FaMapMarkerAlt className='text-green-700' />
                      <span>{maintenance.address}</span>
                    </div>
                    <div className="price">
                      ${maintenance.maintenanceCharge}
                    </div>
                  </div>
                  <div className="user">
                    <img src={maintenance.user.avatar} alt=" photo" />
                    <span>{maintenance.user.username}</span>
                  </div>
                 
                </div>
                <div className='user mt-4 flex-2'>
                  {currentUser && !contact && (
                  <Tooltip title="Click to send email to company" placement="top" arrow>
                    <Button onClick={handleContactClick} className='flex rounded-full contact'>
                      <img src="/msg1.png" alt="" className="w-12 h-12  flex " />
                      <p className='text-gray-700 text-xl font-extrabold'> Send Email to company</p>
                    </Button>
                  </Tooltip>
                )}
                 {contact && <MContact  maintenance={maintenance} authToken={token} />}
                 </div>
              </div>
            </div>
          </div>
          <div className='features'>
            <div className="wrapper mt-8 pt-5">
           
                <>
                  <p><span>{maintenance.description}</span></p>
                  <div className="listVertical">
                    <div className="feature">
                      <img src="/utility.png" alt="" />
                      <div className="featureText">
                        <span>Type</span>
                        <p>{maintenance.type}</p>
                      </div>
                    </div>
                    <div className="feature">
                      <img src="/pet.png" alt="" />
                      <div className="featureText">
                        <span>Furnished</span>
                        <p>{maintenance.furnished ? "Yes" : "No"}</p>
                      </div>
                    </div>
                    <div className="feature">
                      <img src="/fee.png" alt="" />
                      <div className="featureText">
                        <span>Parking</span>
                        <p>{maintenance.parking ? "Available" : "Not Available"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="sizes">
                    <div className="size">
                      <img src="/size.png" alt="" />
                      <span>{maintenance.size} sqft</span>
                    </div>
                    <div className="size">
                      <img src="/year.png" alt="" />
                      <span>Built in {maintenance.yearBuilt}</span>
                    </div>
                    <div className="size">
                      <img src="/renovation.png" alt="" />
                      <span>Last renovated: {maintenance.lastRenovationDate ? new Date(maintenance.lastRenovationDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="listHorizontal">
                    <div className="feature">
                      <img src="/materials.png" alt="" />
                      <div className="featureText">
                        <span>Materials Used</span>
                        <p>{maintenance.materialsUsed}</p>
                      </div>
                    </div>
                    <div className="feature">
                      <img src="/value.png" alt="" />
                      <div className="featureText">
                        <span>Estimated Value</span>
                        <p>${maintenance.estimatedValue?.toLocaleString('en-US') || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="feature">
                      <img src="/condition.png" alt="" />
                      <div className="featureText">
                        <span>Condition</span>
                        <p>{maintenance.condition}</p>
                      </div>
                    </div>
                  </div>
                  <p className="title">Maintenance History</p>
                  <div className="historyContainer">
                    {maintenance.maintenanceHistory.map(history => (
                      <div key={history.id} className="historyItem">
                        <p>Date: {new Date(history.date).toLocaleDateString()}</p>
                        <p>Description: {history.description}</p>
                        <p>Cost: ${history.cost.toLocaleString('en-US')}</p>
                      </div>
                    ))}
                  </div>
                  <p className="title">Location</p>
                  <div className="mapContainer">
                    <Map items={[maintenance]} />
                  </div>
                </>
                <div className='mt-4 bg-slate-600'>
                <PaypalButton
                  amount={maintenance.maintenanceCharge}
                  userId={currentUser.id}
                  propertyId={maintenance.id}
                  propertyType={maintenance.type}
                />
              </div>
            
              
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
