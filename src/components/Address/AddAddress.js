import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AddressService from '../../services/AddressService';

const AddAddress = () => {
  const userId = useSelector(state => state.auth.userID);
  const [address, setAddress] = useState({
    receiverName: '',
    provinceCity: '',
    district: '',
    ward: '',
    street: '',
    isPrimary: false,
    latitude: '',
    longitude: ''
  });

  const navigate = useNavigate();

  if (!userId) {
    // Xử lý trường hợp userId không tồn tại
    return <div>User not found. Please log in.</div>;
  }

  const addAddress = (e) => {
    e.preventDefault();
    AddressService.createAddress(userId, address).then(() => {
      navigate(`/user/${userId}/addresses`);
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress({ ...address, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div>
      <h2>Add Address</h2>
      <form onSubmit={addAddress}>
        <label>Receiver Name</label>
        <input type="text" name="receiverName" value={address.receiverName} onChange={handleChange} required />
        <label>Province/City</label>
        <input type="text" name="provinceCity" value={address.provinceCity} onChange={handleChange} required />
        <label>District</label>
        <input type="text" name="district" value={address.district} onChange={handleChange} required />
        <label>Ward</label>
        <input type="text" name="ward" value={address.ward} onChange={handleChange} required />
        <label>Street</label>
        <input type="text" name="street" value={address.street} onChange={handleChange} required />
        <label>Is Primary</label>
        <input type="checkbox" name="isPrimary" checked={address.isPrimary} onChange={handleChange} />
        <label>Latitude</label>
        <input type="number" name="latitude" value={address.latitude} onChange={handleChange} required />
        <label>Longitude</label>
        <input type="number" name="longitude" value={address.longitude} onChange={handleChange} required />
        <button type="submit">Add Address</button>
      </form>
    </div>
  );
};

export default AddAddress;
