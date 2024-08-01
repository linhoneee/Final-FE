import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import FitBounds from './FitBoundsCheckout';

const DistanceData = ({ distanceData, routeCoordinates }) => (
  <div>
      <h3>Distance Data</h3>
      <p><strong>User ID:</strong> {distanceData.userId}</p>
      <p><strong>Receiver Name:</strong> {distanceData.receiverName}</p>
      <p><strong>Address:</strong> {distanceData.street}, {distanceData.ward}, {distanceData.district}, {distanceData.provinceCity}</p>
      <p><strong>Origin Latitude:</strong> {distanceData.originLatitude}</p>
      <p><strong>Origin Longitude:</strong> {distanceData.originLongitude}</p>
      <p><strong>Warehouse ID:</strong> {distanceData.warehouseId}</p>
      <p><strong>Warehouse Name:</strong> {distanceData.warehouseName}</p>
      <p><strong>Warehouse Address:</strong> {distanceData.warehouseWard}, {distanceData.warehouseDistrict}, {distanceData.warehouseProvinceCity}</p>
      <p><strong>Destination Latitude:</strong> {distanceData.destinationLatitude}</p>
      <p><strong>Destination Longitude:</strong> {distanceData.destinationLongitude}</p>
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
          <FitBounds bounds={routeCoordinates} />
        </MapContainer>
      </>
    )}
  </div>
);

export default DistanceData;
