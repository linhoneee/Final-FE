import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddressService from '../../services/AddressService';
import AddressFields from '../AddressFields';
import AddressMap from '../AddressMap';
import L from 'leaflet'; 

// Fix the default icon issue for Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AddAddressPlusModal = ({ userId, onClose, onSave }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [address, setAddress] = useState({
    receiverName: '',
    provinceCity: '',
    provinceCityName: '',
    district: '',
    districtName: '',
    ward: '',
    wardName: '',
    street: '',
    isPrimary: false,
    latitude: 21.028511, // Default coordinates for Hanoi
    longitude: 105.804817 // Default coordinates for Hanoi
  });

  useEffect(() => {
    axios.get('https://vapi.vnappmob.com/api/province/')
      .then(response => setProvinces(response.data.results))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (address.provinceCity) {
      axios.get(`https://vapi.vnappmob.com/api/province/district/${address.provinceCity}`)
        .then(response => setDistricts(response.data.results))
        .catch(error => console.error(error));
      updateMap(`${address.provinceCityName}, Vietnam`);
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [address.provinceCity, address.provinceCityName]);

  useEffect(() => {
    if (address.district) {
      axios.get(`https://vapi.vnappmob.com/api/province/ward/${address.district}`)
        .then(response => setWards(response.data.results))
        .catch(error => console.error(error));
      updateMap(`${address.districtName}, ${address.provinceCityName}, Vietnam`);
    } else {
      setWards([]);
    }
  }, [address.district, address.districtName, address.provinceCityName]);

  useEffect(() => {
    if (address.ward) {
      updateMap(`${address.wardName}, ${address.districtName}, ${address.provinceCityName}, Vietnam`);
    }
  }, [address.ward, address.wardName, address.districtName, address.provinceCityName]);

  const updateMap = (addressString) => {
    axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: addressString,
        format: 'json',
        addressdetails: 1,
        limit: 1
      }
    })
    .then(response => {
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setAddress(prevState => ({
          ...prevState,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon)
        }));
      } else {
        console.error('Could not find coordinates for this address');
      }
    })
    .catch(error => {
      console.error('Error fetching coordinates:', error);
    });
  };

  const addAddress = (e) => {
    e.preventDefault();
    const addressToSend = {
      ...address,
      provinceCity: address.provinceCityName,
      district: address.districtName,
      ward: address.wardName
    };
    AddressService.createAddress(userId, addressToSend).then(() => {
      onSave();
      onClose();
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Address Plus</h2>
        <form onSubmit={addAddress}>
          <AddressFields 
            address={address}
            handleChange={handleChange}
            provinces={provinces}
            districts={districts}
            wards={wards}
            setAddress={setAddress}
          />
          <AddressMap address={address} setAddress={setAddress} />
          {address.latitude && address.longitude && (
            <div>
              <h3>Coordinates</h3>
              <p>Longitude: {address.longitude}</p>
              <p>Latitude: {address.latitude}</p>
            </div>
          )}
          <button type="submit">Add Address</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddAddressPlusModal;
