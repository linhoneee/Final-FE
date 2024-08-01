import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShippingService from '../../services/ShippingService';

const AddShipping = () => {
  const [shipping, setShipping] = useState({
    name: '',
    pricePerKm: '',
    pricePerKg: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipping({
      ...shipping,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ShippingService.createShipping(shipping)
      .then(response => {
        navigate('/shippings');
      })
      .catch(error => {
        console.error('Error creating shipping:', error);
      });
  };

  return (
    <div>
      <h2>Add Shipping Type</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={shipping.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Price Per Km:</label>
          <input
            type="text"
            name="pricePerKm"
            value={shipping.pricePerKm}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Price Per Kg:</label>
          <input
            type="text"
            name="pricePerKg"
            value={shipping.pricePerKg}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Shipping</button>
      </form>
    </div>
  );
};

export default AddShipping;
