import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';

const AddressMap = ({ address, setAddress }) => {
  const handleMapClick = (e) => {
    setAddress(prevState => ({
      ...prevState,
      latitude: e.latlng.lat,
      longitude: e.latlng.lng
    }));
  };

  const LocationMarker = () => {
    useMapEvents({
      click: handleMapClick
    });
    return null;
  };

  const SetViewOnClick = ({ coords }) => {
    const map = useMap();
    map.setView(coords, map.getZoom());
    return null;
  };

  return (
    <div style={{ height: '400px', marginTop: '20px' }}>
      <MapContainer center={[address.latitude, address.longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[address.latitude, address.longitude]} />
        <SetViewOnClick coords={[address.latitude, address.longitude]} />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default AddressMap;
