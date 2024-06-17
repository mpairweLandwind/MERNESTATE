import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Await, useLoaderData } from 'react-router-dom';
import Filter from '../components/Filter';
import Map from '../components/Map';
import Card from '../components/Card/Card';
import './user.scss';
import Chat from '../components/chat/Chat';
import Button from '@mui/material/Button';
import { IoCloseCircle } from "react-icons/io5";

function User() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [activeChatReceiverId, setActiveChatReceiverId] = useState(null); // State to track active chat receiver
  const [showChat, setShowChat] = useState(false); // State to track chat visibility

  const currentUser = useSelector(state => state.user.currentUser);
  const token = useSelector(state => state.user.token);
  const { chatData } = useLoaderData();

  const fetchListings = useCallback(async (url, setter) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setter(response.data);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      setter([]);
    }
  }, [token]);

  const handleChatClick = (userRef) => {
    console.log('Chat clicked for userRef:', userRef);
    setActiveChatReceiverId(userRef);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setActiveChatReceiverId(null);
  };

  useEffect(() => {
    if (currentUser && token) {
      fetchListings('/api/listing/get?offer=true&limit=4', setOfferListings);
      fetchListings('/api/listing/get?type=rent&limit=4', setRentListings);
      fetchListings('/api/listing/get?type=sale&limit=4', setSaleListings);
    }
  }, [currentUser, fetchListings, token]);

  if (!currentUser || !token) {
    return <p>Please sign in to view listings.</p>;
  }

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter setListings={setRentListings} />
          <div className="title">
            <h2 className="primaryText">Rent Listings</h2>
            {rentListings.length > 0 ? (
              rentListings.map((listing) => (
                <Card key={listing.id} listing={listing} onChatClick={handleChatClick} />
              ))
            ) : (
              <p>No rent listings available</p>
            )}

            <h2 className="text-xl font-bold text-gray-800">Offer Listings</h2>
            {offerListings.length > 0 ? (
              offerListings.map((listing) => (
                <Card key={listing.id} listing={listing} onChatClick={handleChatClick} />
              ))
            ) : (
              <p>No offer listings available</p>
            )}

            <h2 className="text-xl font-bold text-gray-800">Sale Listings</h2>
            {saleListings.length > 0 ? (
              saleListings.map((listing) => (
                <Card key={listing.id} listing={listing} onChatClick={handleChatClick} />
              ))
            ) : (
              <p>No sale listings available</p>
            )}
          </div>
        </div>
      </div>
      <div className="mapContainer">
       
        {!showChat && <Map items={[...offerListings, ...rentListings, ...saleListings]} />}
    
        {showChat && (
          <div className="chatContainer">
            <Button variant="outlined" onClick={handleCloseChat} className="closeChatButton"> <IoCloseCircle />Close Chat</Button>
            <Suspense fallback={<p>Loading chat...</p>}>
              <Await resolve={chatData} errorElement={<p>Error loading chats!</p>}>
                {(chatData) => (
                  <Chat receiverId={activeChatReceiverId} chats={chatData} />
                )}
              </Await>
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}

export default User;
