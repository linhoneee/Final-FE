import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import FitBounds from './FitBoundsCheckout';
import './DistanceDataCheckout.css'; // Import the new CSS file

const carIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png', // URL of the car icon image
    iconSize: [38, 38],
    iconAnchor: [22, 22],
    popupAnchor: [-3, -76],
});

const DistanceData = ({ distanceData, routeCoordinates }) => (
    <div className="distance-data-container">
        <h3>Distance Data</h3>
        <div className="address-section">
            <div className="address-box">
                <h4>Receiver Address</h4>
                <p><strong>User ID:</strong> {distanceData.userId}</p>
                <p><strong>Receiver Name:</strong> {distanceData.receiverName}</p>
                <p><strong>Address:</strong> {distanceData.street}, {distanceData.ward}, {distanceData.district}, {distanceData.provinceCity}</p>
                <p><strong>Latitude:</strong> {distanceData.originLatitude}</p>
                <p><strong>Longitude:</strong> {distanceData.originLongitude}</p>
            </div>
            <div className="address-box">
                <h4>Warehouse Address</h4>
                <p><strong>Warehouse ID:</strong> {distanceData.warehouseId}</p>
                <p><strong>Warehouse Name:</strong> {distanceData.warehouseName}</p>
                <p><strong>Address:</strong> {distanceData.warehouseWard}, {distanceData.warehouseDistrict}, {distanceData.warehouseProvinceCity}</p>
                <p><strong>Latitude:</strong> {distanceData.destinationLatitude}</p>
                <p><strong>Longitude:</strong> {distanceData.destinationLongitude}</p>
            </div>
        </div>
        <p><strong>Distance:</strong> {distanceData.distance} km</p>
        {routeCoordinates.length > 0 && (
            <>
                <h4>Route</h4>
                <MapContainer bounds={routeCoordinates} className="route-map">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Polyline positions={routeCoordinates} color="blue" />
                    <Marker position={[distanceData.destinationLatitude, distanceData.destinationLongitude]} icon={carIcon}>
                        <Popup>Warehouse</Popup>
                    </Marker>
                    <Marker position={[distanceData.originLatitude, distanceData.originLongitude]}>
                        <Popup>Receiver</Popup>
                    </Marker>
                    <FitBounds bounds={routeCoordinates} />
                </MapContainer>
            </>
        )}
    </div>
);

export default DistanceData;