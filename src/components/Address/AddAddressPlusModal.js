import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import AddressService from '../../services/AddressService';
import AddressFields from '../AddressFields';
import AddressMap from '../AddressMap';
import L from 'leaflet';
import './AddAddressPlusModal.css';
import { radioClasses } from '@mui/material';

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

  const modalRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    axios.get('https://vapi.vnappmob.com/api/province/')
      .then(response => setProvinces(response.data.results))
      .catch(error => console.error(error));
  }, []);

  if(provinces){
    console.log('hihi',provinces);
  }
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

    if (!address.receiverName || !address.provinceCity || !address.district || !address.ward || !address.street) {
      alert("Please fill in all the address fields.");
      return;
    }


    const addressToSend = {
      ...address,
      provinceCity: address.provinceCityName,
      district: address.districtName,
      ward: address.wardName
    };
    // khi log ra, provinceCity, district, ward vãn hiển thị tên nhưng khi add vào nó sẽ lưu vào tọa độ
    // nếu không có provinceCityName, districtName, wardName nó sẽ lưu tọa độ
    console.log(addressToSend)

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
    <div className="add-address-plus-modal-overlay">
      <div className="add-address-plus-modal" ref={modalRef}>
        <div className="add-address-plus-modal-header">
          <h2>Thêm Địa Chỉ</h2>
        </div>
        <div className="add-address-plus-modal-content">
          <div className="add-address-plus-modal-left">
            <form onSubmit={addAddress}>
              <AddressFields 
                address={address}
                handleChange={handleChange}
                provinces={provinces}
                districts={districts}
                wards={wards}
                setAddress={setAddress}
              />
              <button type="submit" className="btn">Thêm Địa Chỉ</button>
              <button type="button" className="btn cancel-btn" onClick={onClose}>Thoát</button>
            </form>
          </div>
          <div className="add-address-plus-modal-right">
            <div className="map-container">
              <AddressMap address={address} setAddress={setAddress} />
            </div>
            {address.latitude && address.longitude && (
              <div className="coordinates">
                <h3>Vị Trí Địa Lý</h3>
                <p>Kinh độ: {address.longitude}</p>
                <p>Vĩ độ: {address.latitude}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddressPlusModal;
