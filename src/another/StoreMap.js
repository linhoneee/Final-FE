import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './StoreLocator.css';  // Import the CSS file

// Custom icon for store
const storeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/869/869636.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

// Component to fit bounds after map is rendered
const FitMapBounds = ({ bounds }) => {
    const map = useMap();
    
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds);
        }
    }, [bounds, map]);

    return null;
};

const StoreLocator = () => {
    const [stores] = useState([
        {
            id: 1,
            name: 'Hanoi Store',
            position: [21.028511, 105.804817],
            address: '123 Old Quarter, Hoan Kiem, Hanoi',
        },
        {
            id: 2,
            name: 'Danang Store',
            position: [16.047079, 108.206230],
            address: '456 Beach Road, Son Tra, Danang',
        }
    ]);

    const [selectedStore, setSelectedStore] = useState(stores[0]);
    const [userPosition, setUserPosition] = useState(null);
    const [route, setRoute] = useState([]);
    const mapRef = useRef(null);

    // Fetch route between user position and store using Mapbox Directions API
    const getRoute = async (userPosition, storePosition) => {
        const API_KEY = 'pk.eyJ1IjoibGluaGVoZWhlaGVoIiwiYSI6ImNtMjQ3b3U2MzBkNXgybnNkNWdsZWFqYWwifQ.xIwS3-5eMZu0w5SsczzNDw'; 
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userPosition[1]},${userPosition[0]};${storePosition[1]},${storePosition[0]}?geometries=geojson&access_token=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
            const coordinates = data.routes[0].geometry.coordinates;
            const geoJsonRoute = coordinates.map(coord => [coord[1], coord[0]]);
            setRoute(geoJsonRoute);
        }
    };

    // Request user location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
        
                    console.log('Latitude:', latitude);
                    console.log('Longitude:', longitude);
        
                    setUserPosition([latitude, longitude]);
                },
                (error) => {
                    console.error('Error getting user position:', error);
                },
                {
                    enableHighAccuracy: true,  // Bật độ chính xác cao
                    timeout: 10000,            // Thời gian chờ (10 giây)
                    maximumAge: 0              // Không sử dụng kết quả cũ
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    // Automatically calculate and fetch route when user position or store changes
    useEffect(() => {
        if (userPosition && selectedStore) {
            getRoute(userPosition, selectedStore.position);
        }
    }, [userPosition, selectedStore]);

    // Calculate bounds to fit all markers and route on the map
    const calculateBounds = () => {
        if (!userPosition || !selectedStore) return null;
        
        const allPositions = [userPosition, selectedStore.position];
        
        if (route.length > 0) {
            allPositions.push(...route);
        }

        return L.latLngBounds(allPositions);
    };

    const bounds = calculateBounds();

    return (
        <div className="store-locator">
            <div className="store-header">
                <h1>How to find us</h1>
                <p>
                    The University of Greenwich is based in London and Medway. You can reach our campuses by car or via public transport 
                    (including bus and rail), with easy connections from airports in London.
                </p>
            </div>

            {/* Store selection buttons */}
            <div className="store-buttons">
                {stores.map(store => (
                    <button key={store.id} onClick={() => setSelectedStore(store)}>
                        {store.name}
                    </button>
                ))}
            </div>

            {/* Map and store information */}
            <div className="store-content">
                <div className="map-section">
                    <MapContainer
                        center={userPosition || [21.028511, 105.804817]}  // Default center if userPosition not available
                        zoom={13}  // Default zoom level
                        style={{ height: '400px', width: '100%' }}
                        whenCreated={(mapInstance) => mapRef.current = mapInstance}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {/* Marker for user position */}
                        {userPosition && (
                            <Marker position={userPosition}>
                                <Popup>Your Location</Popup>
                            </Marker>
                        )}

                        {/* Marker for selected store */}
                        <Marker position={selectedStore.position} icon={storeIcon}>
                            <Popup>{selectedStore.name}</Popup>
                        </Marker>

                        {/* Display route */}
                        {route && route.length > 0 && (
                            <Polyline positions={route} color="blue" />
                        )}

                        {/* Fit bounds to show all markers and route */}
                        {bounds && <FitMapBounds bounds={bounds} />}
                    </MapContainer>
                </div>

                {/* Store information */}
                <div className="store-info">
                    <h3>{selectedStore.name}</h3>
                    <p>Address: {selectedStore.address}</p>
                    <div className="transport-links">
                        <h4>Transport Links</h4>
                        <p>DLR Cutty Sark (approx. 3 min walk)</p>
                        <p>Greenwich and Maze Hill (approx. 8 min walk)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreLocator;
