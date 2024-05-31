import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Filter from '../components/Filter';
import Map from '../components/Map';
import Card from '../components/Card/Card';
import "./user.scss";

const renderListings = (listings) => {
  console.log('Listings:', listings); // Add console log to check listings
  return listings.length > 0 ? (
    listings.map((listing) => (
      <Card key={listing.id} listing={listing} />
    ))
  ) : (
    <p>No listings available</p>
  );
}

function User() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  const { currentUser , token} = useSelector(state => state.user);

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
          <Filter />
          <div className="title">
            <h2 className="primaryText">Rent Listings</h2>
            {renderListings(rentListings)}

            <h2 className="text-xl font-bold text-gray-800">Offer Listings</h2>
            {renderListings(offerListings)}

            <h2 className="text-xl font-bold text-gray-800">Sale Listings</h2>
            {renderListings(saleListings)}
          </div>
        </div>
      </div>
      <div className="mapContainer">
        <Map listings={[...offerListings, ...rentListings, ...saleListings]} />
      </div>
    </div>
  );
}

export default User;
