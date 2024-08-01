import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ShippingService from '../../services/ShippingService';

const UpdateShipping = () => {
  const [shipping, setShipping] = useState({
    name: '',
    pricePerKm: '',
    pricePerKg: ''
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    ShippingService.findShippingById(id)
      .then((response) => {
        setShipping(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching shipping data:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipping({
      ...shipping,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ShippingService.updateShippingById(shipping, id)
      .then(response => {
        navigate('/shippings');
      })
      .catch(error => {
        console.error('Error updating shipping:', error);
      });
  };

  return (
    <div>
      <h2>Update Shipping Type</h2>
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
        <button type="submit">Update Shipping</button>
      </form>
    </div>
  );
};

export default UpdateShipping;
