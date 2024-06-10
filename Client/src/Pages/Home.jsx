import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import ListingItem from '../components/ListingItem';
import CountUp from 'react-countup';
import './home.scss';



export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (url, setter) => {
    try {
      const response = await axios.get(url);
      setter(response.data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      setter([]);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetchData('/api/listing/get?offer=true&limit=4', setOfferListings),
      fetchData('/api/listing/get?type=rent&limit=4', setRentListings),
      fetchData('/api/listing/get?type=sale&limit=4', setSaleListings),
    ]).finally(() => setIsLoading(false));
  }, []);

  const renderListings = (listings) => (
    listings.length > 0 ? listings.map((listing) => (
      <ListingItem listing={listing} key={listing.id} />
    )) : <p>No listings available</p>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='page-container'>
      <section className="section-hero">
        <div className="container">
          <div className="content">
            <div className="background"></div>
            <div className="text-content">
              <h1><span>Effortlessly</span> Rent and Manage Your Dream Property with Our Seamless Online Platform</h1>
              <p>Find a variety of properties that suit you very easily.<br />Forget all difficulties in finding a residence for you.</p>
              <div className="get-started">
                <Link to={'/search'} className="link"><button>Let`s get started <img src="./right_arrow.png" /></button></Link>
              </div>
              <div className="stats">
                <div className="stat-item">
                  <h1 className="number"><CountUp className='count' start={8800} end={9000} duration={4} />+</h1>
                  <h2>Premium Products</h2>
                </div>
                <div className="stat-item">
                  <h1 className="number"><CountUp className='count' start={1950} end={2000} duration={4} />+</h1>
                  <h2>Happy Customers</h2>
                </div>
                <div className='stat-item'>
                  <h1 className="number"><CountUp className='count' end={28} />+</h1>
                  <h2>Award Winnings</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="image-container">
            <img src="./bg.png" alt="Hero" />
          </div>
        </div>
      </section>

      <Swiper navigation className='swiper-section'>
        {offerListings.length ? offerListings.map(listing => (
          <SwiperSlide key={listing.id}>
            <div style={{
              backgroundImage: `url(${listing.imageUrls?.[0]})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }} className='swiper-slide'>
              <div className="slide-content"></div>
              <div className="details">
                <h3>{listing.title}</h3>
                <p>{listing.description}</p>
                <Link to={`/listing/${listing.id}`} className="view-link">View Details</Link>
              </div>
            </div>
          </SwiperSlide>
        )) : (
          <SwiperSlide className='swiper-slider-2'>
            <div className='failed'>
              <p>No listings available</p>
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      <div className='listings-section'>
        {offerListings.length > 0 && (
          <div>
            <h2>Recent offers</h2>
            <Link className='link' to={'/search?offer=true'}>Show more offers</Link>
            <div className='grid'>
              {renderListings(offerListings)}
            </div>
          </div>
        )}
        {rentListings.length > 0 && (
          <div>
            <h2>Recent places for rent</h2>
            <Link className='link' to={'/search?type=rent'}>Show more places for rent</Link>
            <div className='grid'>
              {renderListings(rentListings)}
            </div>
          </div>
        )}
        {saleListings.length > 0 && (
          <div>
            <h2>Recent places for sale</h2>
            <Link className='link' to={'/search?type=sale'}>Show more places for sale</Link>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {renderListings(saleListings)}
            </div>
          </div>
        )}
        {!offerListings.length && !rentListings.length && !saleListings.length && (
          <div className='content'>
            <h2>No Listings Available</h2>
            <p>Check back later for more listings or try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
