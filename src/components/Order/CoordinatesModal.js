import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './CoordinatesModal.css';
import 'leaflet/dist/leaflet.css';

// Custom icon for warehouse (car icon)
const carIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2821/2821850.png',
    iconSize: [38, 38],
    iconAnchor: [22, 22],
    popupAnchor: [-3, -76],
});

// Custom icon for destination (receiver address)
const destinationIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2991/2991231.png',
    iconSize: [38, 38],
    iconAnchor: [22, 22],
    popupAnchor: [-3, -76],
});

// Custom icon for current shipment location (cart icon)
const shipmentIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png',
    iconSize: [38, 38],
    iconAnchor: [22, 22],
    popupAnchor: [-3, -76],
});

const CoordinatesModal = ({ show, handleClose, distanceData }) => {
    const [route, setRoute] = useState([]);
    const [clonePosition, setClonePosition] = useState(null);
    const [progress, setProgress] = useState(0);
    const [closestPoint, setClosestPoint] = useState(null);
    const mapRef = useRef(null); // Add a ref for the map

    const {
        originLatitude,
        originLongitude,
        destinationLatitude,
        destinationLongitude,
        currentLatitude,
        currentLongitude
    } = distanceData || {};

    // Fetch route between destination and origin using Mapbox Directions API
    const getRoute = useCallback(async (origin, destination) => {
        const API_KEY = 'pk.eyJ1IjoibGluaGVoZWhlaGVoIiwiYSI6ImNtMjQ3b3U2MzBkNXgybnNkNWdsZWFqYWwifQ.xIwS3-5eMZu0w5SsczzNDw';
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${destination[1]},${destination[0]};${origin[1]},${origin[0]}?geometries=geojson&overview=full&access_token=${API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const coordinates = data.routes[0].geometry.coordinates;
                const geoJsonRoute = coordinates.map(coord => [coord[1], coord[0]]);
                setRoute(geoJsonRoute);
                setProgress(0);

                if (currentLatitude && currentLongitude) {
                    const closest = findClosestPoint(geoJsonRoute, [currentLatitude, currentLongitude]);
                    setClosestPoint(closest); // Đặt closestPoint để hiển thị trên bản đồ
                    setClonePosition(closest); // Đặt clonePosition để bắt đầu di chuyển từ vị trí gần nhất
                } else {
                    // Tìm điểm gần nhất từ destinationLatitude và destinationLongitude
                    const closest = findClosestPoint(geoJsonRoute, [destinationLatitude, destinationLongitude]);
                    setClosestPoint(closest); // Đặt closestPoint để hiển thị trên bản đồ
                    setClonePosition(closest); // Đặt clonePosition để bắt đầu di chuyển từ vị trí gần nhất với destination
                }
                
                
                

                // Center map to fit the route bounds
                if (mapRef.current) {
                    mapRef.current.fitBounds(geoJsonRoute);
                }
            }
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    }, [currentLatitude, currentLongitude, destinationLatitude, destinationLongitude]);

    // Calculate the closest point on the route to the current location
// Calculate the closest point on the route to the current location
const findClosestPoint = (route, currentLocation) => {
    let minDistance = Infinity;
    let closest = null;

    route.forEach(point => {
        const distance = L.latLng(point).distanceTo(L.latLng(currentLocation));
        if (distance < minDistance) {
            minDistance = distance;
            closest = point;
        }
    });

    return closest; // Trả về closest trực tiếp
};


// Move the shipmentIcon along the route for 3 seconds
// Move the shipmentIcon along the route for 3 seconds
useEffect(() => {
    if (route.length > 1 && closestPoint) { // Sử dụng closestPoint làm điểm bắt đầu nếu có
        const intervalDuration = 50;
        const totalDuration = 3000;
        const totalSteps = totalDuration / intervalDuration;
        const stepSize = 1 / totalSteps;

        const interval = setInterval(() => {
            setProgress(prevProgress => {
                const newProgress = prevProgress + stepSize;
                if (newProgress >= 1) {
                    return 0; // Reset progress để bắt đầu từ đầu
                } else {
                    return newProgress;
                }
            });
        }, intervalDuration);

        return () => clearInterval(interval);
    }
}, [route, closestPoint]);

// Update clone position based on progress
useEffect(() => {
    if (progress >= 0 && progress <= 1 && route.length > 1 && closestPoint) {
        const startIndex = route.findIndex(point => point[0] === closestPoint[0] && point[1] === closestPoint[1]);
        const totalPoints = route.length - 1;
        
        // Xác định điểm bắt đầu và kết thúc cho animation
        const pointIndex = Math.min(startIndex + Math.floor(progress * (totalPoints - startIndex)), totalPoints);
        const nextPointIndex = Math.min(pointIndex + 1, totalPoints);

        const [lat1, lng1] = route[pointIndex];
        const [lat2, lng2] = route[nextPointIndex];

        const lat = lat1 + (lat2 - lat1) * (progress * (totalPoints - startIndex) - (pointIndex - startIndex));
        const lng = lng1 + (lng2 - lng1) * (progress * (totalPoints - startIndex) - (pointIndex - startIndex));

        setClonePosition([lat, lng]);
    }
}, [progress, route, closestPoint]);

    // Fetch route when modal opens
    useEffect(() => {
        if (show && originLatitude && originLongitude && destinationLatitude && destinationLongitude) {
            getRoute([originLatitude, originLongitude], [destinationLatitude, destinationLongitude]);
        }
    }, [show, originLatitude, originLongitude, destinationLatitude, destinationLongitude, getRoute]);

    if (!show || !distanceData) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Tuyến Đường Vận Chuyển</h2>
                    <button className="close-button" onClick={handleClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    {/* <h5>Origin Location (Receiver)</h5>
                    <p><strong>Latitude:</strong> {originLatitude}</p>
                    <p><strong>Longitude:</strong> {originLongitude}</p>
    
                    <h5>Destination (Warehouse)</h5>
                    <p><strong>Latitude:</strong> {destinationLatitude}</p>
                    <p><strong>Longitude:</strong> {destinationLongitude}</p>
    
                    <h5>Current Shipment Location</h5>
                    <p><strong>Latitude:</strong> {currentLatitude}</p>
                    <p><strong>Longitude:</strong> {currentLongitude}</p>
     */}
                    <div className="map-container">
                        <MapContainer
                            center={[destinationLatitude, destinationLongitude]}
                            zoom={10}
                            style={{ height: '400px', width: '100%' }}
                            ref={(map) => { mapRef.current = map }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
    
                            <Marker position={[originLatitude, originLongitude]} icon={destinationIcon}>
                                <Popup>Receiver Location</Popup>
                            </Marker>
    
                            <Marker position={[destinationLatitude, destinationLongitude]} icon={carIcon}>
                                <Popup>Warehouse Location</Popup>
                            </Marker>
    
                            {route.length > 0 && closestPoint && (
                                <>
                                    {/* Đoạn đường từ Warehouse đến Current Shipment Location với màu nhạt */}
                                    <Polyline
                                        positions={route.slice(0, route.findIndex(point => point[0] === closestPoint[0] && point[1] === closestPoint[1]) + 1)}
                                        color="#fc5d14"
                                    />
                                    
                                    {/* Đoạn đường từ Current Shipment Location đến Receiver với màu đậm hơn */}
                                    <Polyline
                                        positions={route.slice(route.findIndex(point => point[0] === closestPoint[0] && point[1] === closestPoint[1]))}
                                        color="#f40331"
                                    />
                                </>
                            )}
    
                            {closestPoint && currentLatitude && currentLongitude && (
                                <Marker position={closestPoint} icon={shipmentIcon}>
                                    <Popup>Current Shipment Location</Popup>
                                </Marker>
                            )}
    
                            {clonePosition && (
                                <Marker position={clonePosition} icon={shipmentIcon}>
                                    <Popup>Moving Shipment</Popup>
                                </Marker>
                            )}
                        </MapContainer>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="close-modal-button" onClick={handleClose}>
                        Thoát
                    </button>
                </div>
            </div>
        </div>
    );
    
};

export default CoordinatesModal;
