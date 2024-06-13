import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Filter from '../components/Filter';
import Map from '../components/Map';
import Card from '../components/Card/Card';
import './user.scss';
import Chat from '../components/chat/Chat'; // Import Chat component

function User() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [chats, setChats] = useState([]); // State to hold chats

  const { currentUser, token } = useSelector(state => state.user);

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

  const fetchChats = useCallback(async () => {
    try {
      const response = await axios.get('/api/chats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setChats(response.data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      setChats([]);
    }
  }, [token]);

  const handleChatClick = (receiverId) => {
    // Handle chat click logic here, e.g., opening a chat box
    console.log('Chat clicked for receiverId:', receiverId);
    // You can implement your logic to open the chat here
  };

  useEffect(() => {
    if (currentUser && token) {
      fetchListings('/api/listing/get?offer=true&limit=4', setOfferListings);
      fetchListings('/api/listing/get?type=rent&limit=4', setRentListings);
      fetchListings('/api/listing/get?type=sale&limit=4', setSaleListings);
      fetchChats();
    }
  }, [currentUser, fetchListings, fetchChats, token]);

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
                <Card key={listing.id} listing={listing} onChatClick={handleChatClick}>
                  <Chat chats={chats} /> {/* Pass chats to Chat component */}
                </Card>
              ))
            ) : (
              <p>No rent listings available</p>
            )}

            <h2 className="text-xl font-bold text-gray-800">Offer Listings</h2>
            {offerListings.length > 0 ? (
              offerListings.map((listing) => (
                <Card key={listing.id} listing={listing} onChatClick={handleChatClick}>
                  <Chat chats={chats} /> {/* Pass chats to Chat component */}
                </Card>
              ))
            ) : (
              <p>No offer listings available</p>
            )}

            <h2 className="text-xl font-bold text-gray-800">Sale Listings</h2>
            {saleListings.length > 0 ? (
              saleListings.map((listing) => (
                <Card key={listing.id} listing={listing} onChatClick={handleChatClick}>
                  <Chat chats={chats} /> {/* Pass chats to Chat component */}
                </Card>
              ))
            ) : (
              <p>No sale listings available</p>
            )}
          </div>
        </div>
      </div>
      <div className="mapContainer">
        <Map items={[...offerListings, ...rentListings, ...saleListings]} />
      </div>
    </div>
  );
}

export default User;
