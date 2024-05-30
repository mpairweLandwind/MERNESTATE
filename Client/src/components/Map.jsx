import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import './map.scss';

function Map() {
    const [userLocation, setUserLocation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Function to handle search location
    const handleSearch = async () => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
            } else {
                console.error('Location not found');
            }
        } catch (error) {
            console.error('Error searching location:', error);
        }
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
            },
            error => {
                console.error('Error getting user location:', error);
            }
        );
    }, []);

    const handleInputChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = event => {
        event.preventDefault();
        handleSearch();
    };

    return (
        <div className="h-screen">
            <form onSubmit={handleSearchSubmit} className="p-4">
                <input
                    className="input border-2 text-slate-900  border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Enter location name"
                />
                <button
                    className="btn ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                >
                    Search
                </button>
            </form>
            {userLocation ? (
                <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} className="map">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>Your Location</Popup>
                    </Marker>
                </MapContainer>
            ) : (
                <p>Loading map...</p>
            )}
        </div>
    );
}

export default Map;