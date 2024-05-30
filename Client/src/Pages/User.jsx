import { useEffect, useState } from 'react';

import Filter from '../components/Filter';
import Map from '../components/Map';
import "./user.scss";
import Card from '../components/Card/Card';

function User() {
    const [offerListings, setOfferListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);

      // Fetch function for offer listings
      const fetchOfferListings = async () => {
        try {
            const response = await fetch('/api/listing/get?offer=true&limit=4');
            const data = await response.json();
            setOfferListings(data);
        } catch (error) {
            console.error('Failed to fetch offer listings:', error);
        }
    };

     // Fetch function for rent listings
     const fetchRentListings = async () => {
        try {
            const response = await fetch('/api/listing/get?type=rent&limit=4');
            const data = await response.json();
            setRentListings(data);
        } catch (error) {
            console.error('Failed to fetch rent listings:', error);
        }
    };

    // Fetch function for sale listings
    const fetchSaleListings = async () => {
        try {
            const response = await fetch('/api/listing/get?type=sale&limit=4');
            const data = await response.json();
            setSaleListings(data);
        } catch (error) {
            console.error('Failed to fetch sale listings:', error);
        }
    };

     // Use useEffect to call the fetch functions on component mount
     useEffect(() => {
        fetchOfferListings();
        fetchRentListings();
         fetchSaleListings();
    }, []);

    return (
        <div className="listPage">
            <div className="listContainer">
                <div className="wrapper">
                    <Filter />
                    <div className="title">
                        <h2 className="primaryText">Rent Listings</h2>
                        {rentListings.map(item => <Card key={item._id} listing={item} />)}

                        <h2 className="text-xl font-bold text-gray-800">Offer Listings</h2>
                    {offerListings.map(item => <Card key={item._id} listing={item} />)}

                    <h2 className="text-xl font-bold text-gray-800">Sale Listings</h2> 
                    {saleListings.map(item => <Card key={item._id} listing={item} />)}

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