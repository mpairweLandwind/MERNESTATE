import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, Await, useLoaderData } from 'react-router-dom';
import List from '../components/List';
import './Profile.scss';
import Chat from '../components/chat/Chat';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card/Card';
import { clearCurrentUser } from '../redux/user/userSlice';
import { handleLogout, fetchData } from '../lib/utils';
import MCard from '../components/Card/MCard';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, token } = useSelector(state => state.user);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [userMaintenances, setUserMaintenances] = useState([]);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const { chatData } = useLoaderData();

  const handleShowListings = useCallback(async () => {
    try {
      setShowListingsError(false);
      const data = await fetchData(`/api/user/listings/?id=${currentUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!data.listings || !Array.isArray(data.listings)) {
        throw new Error('Data is not an array');
      }

      setUserListings([...new Set(data.listings.map(listing => JSON.stringify(listing)))].map(str => JSON.parse(str)));
    } catch (error) {
      setShowListingsError(true);
      console.error('Error fetching listings:', error);
    }
  }, [currentUser.id, token]);

  const handleShowMaintenance = useCallback(async () => {
    try {
      setShowListingsError(false);
      const data = await fetchData(`/api/user/maintenances/?id=${currentUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!data.maintenances || !Array.isArray(data.maintenances)) {
        throw new Error('Data is not an array');
      }

      setUserMaintenances([...new Set(data.maintenances.map(maintenance => JSON.stringify(maintenance)))].map(str => JSON.parse(str)));
    } catch (error) {
      setShowListingsError(true);
      console.error('Error fetching maintenances:', error);
    }
  }, [currentUser.id, token]);

  const onLogOut = () => handleLogout(navigate, dispatch, clearCurrentUser);

  useEffect(() => {
    handleShowListings();
    handleShowMaintenance();
  }, [handleShowListings, handleShowMaintenance]);

  const handleListingDelete = async (listingId) => {
    try {
      const response = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      setUserListings(prev => prev.filter(listing => listing._id !== listingId));
      setDeleteSuccess(true);

      setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const handleMaintenanceDelete = async (maintenanceId) => {
    try {
      const response = await fetch(`/api/maintenance/delete/${maintenanceId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      setUserMaintenances(prev => prev.filter(maintenance => maintenance._id !== maintenanceId));
      setDeleteSuccess(true);

      setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error deleting maintenance:', error);
    }
  };

  return (
    <div className='flex'>
      <Sidebar onLogout={onLogOut} />
      <div className="profilePage ">
        <div className="details">
          <div className="wrapper">
            <div className="title">
              <h1><b>User Information</b></h1>
            </div>
            <div className="info">
              <span>
                Photo:
                <img
                  src={currentUser?.avatar || "./landlord.png"}
                  className='bg-white'
                  alt="User"
                />
              </span>
              <span>Username: <b>{currentUser?.username}</b></span>
              <span>E-mail: <b>{currentUser?.email}</b></span>
            </div>
            <div className="title">
              <h1>My List</h1>
            </div>
            <div>
              {userListings.length > 0 && (
                <>
                  <h2 className='text-2xl text-slate-900 p-4 font-extrabold'>Listings</h2>
                  <List listings={userListings} />
                  {userListings.map((listing) => <Card key={listing.id} listing={listing} />)}
                </>
              )}
              {userMaintenances.length > 0 && (
                <>
                 <h2 className="text-2xl font-extrabold text-slate-900 p-4">Maintenances</h2>

                  <List maintenances={userMaintenances} />
                  {userMaintenances.map((maintenance) => <MCard key={maintenance.id} maintenance={maintenance} />)}
                </>
              )}
              {userListings.length === 0 && userMaintenances.length === 0 && (
                <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing listings or maintenances' : 'No listings or maintenances found'}</p>
              )}
            </div>
          </div>
        </div>
        <div className="chatContainer ">
          <div className="wrapper ">
            {deleteSuccess && (
              <div className="alert alert-success text-green-600 text-xl">
                Property deleted successfully!
              </div>
            )}
           
            <div className='flex flex-col gap-4 mt-3 '>
              {userListings.length > 0 && (
                <>
                  <h1 className='text-center mt-7 text-2xl font-semibold'>Property List</h1>
                  {userListings.map((listing) => (
                    <div
                      key={listing.id}
                      className='border rounded-lg p-3 flex justify-between items-center gap-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out'
                    >
                      <Link to={`/landlord/listing/${listing.id}`}>
                        <img
                          src={listing.imageUrls[0]}
                          alt='Listing cover'
                          className='h-16 w-16 rounded-full object-cover'
                        />
                      </Link>
                      <Link
                        className='text-slate-700 font-semibold hover:underline truncate flex-1'
                        to={`/landlord/listing/${listing.id}`}
                      >
                        <p>{listing.name}</p>
                      </Link>
                      <div className='flex flex-col items-center'>
                        <button
                          onClick={() => handleListingDelete(listing.id)}
                          className='text-red-500 uppercase flex items-center gap-2 bg-red-100 p-2 rounded mb-2 hover:bg-red-200 transition-colors duration-300 ease-in-out'
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                        <Link to={`/landlord/update-listing/${listing.id}`}>
                          <button className='text-green-500 uppercase flex items-center gap-2 bg-green-100 p-2 rounded hover:bg-green-200 transition-colors duration-300 ease-in-out'>
                            <FontAwesomeIcon icon={faEdit} /> Edit
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {userMaintenances.length > 0 && (
                <>
                  <h1 className='text-center mt-7 text-2xl font-semibold'>Maintenance List</h1>
                  {userMaintenances.map((maintenance) => (
                    <div
                      key={maintenance.id}
                      className='border rounded-lg p-3 flex justify-between items-center gap-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out'
                    >
                      <Link to={`/landlord/maintenance/${maintenance.id}`}>
                        <img
                          src={maintenance.imageUrls[0]}
                          alt='Maintenance cover'
                          className='h-16 w-16 rounded-full object-cover'
                        />
                      </Link>
                      <Link
                        className='text-slate-700 font-semibold hover:underline truncate flex-1'
                        to={`/landlord/maintenance/${maintenance.id}`}
                      >
                        <p>{maintenance.name}</p>
                      </Link>
                      <div className='flex flex-col items-center'>
                        <button
                          onClick={() => handleMaintenanceDelete(maintenance.id)}
                          className='text-red-500 uppercase flex items-center gap-2 bg-red-100 p-2 rounded mb-2 hover:bg-red-200 transition-colors duration-300 ease-in-out'
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                        <Link to={`/landlord/update-maintenance/${maintenance.id}`}>
                          <button className='text-green-500 uppercase flex items-center gap-2 bg-green-100 p-2 rounded hover:bg-green-200 transition-colors duration-300 ease-in-out'>
                            <FontAwesomeIcon icon={faEdit} /> Edit
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <Suspense fallback={<p>Loading...</p>}>
              <Await resolve={chatData} errorElement={<p>Error loading chats!</p>}>
                {(chatData) => <Chat chats={chatData} />}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
