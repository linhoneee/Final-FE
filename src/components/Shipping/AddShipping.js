import React, { useState } from 'react';
import ShippingService from '../../services/ShippingService';
import './AddShipping.css';

const AddShipping = ({ closeModal, fetchShippings }) => {
  const [shipping, setShipping] = useState({
    name: '',
    pricePerKm: '',
    pricePerKg: ''
  });

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
      .then(() => {
        fetchShippings();
        closeModal();
      })
      .catch(error => {
        console.error('Error creating shipping:', error);
      });
  };

  return (
    <div className="add-shipping-modal-container">
      <div className="add-shipping-modal-content">
        <h2 className="add-shipping-modal-header">Thêm loại vận chuyển</h2>
        <form className="add-shipping-modal-form" onSubmit={handleSubmit}>
          <div className="add-shipping-modal-form-group">
            <label className="add-shipping-modal-label">Tên:</label>
            <input
              type="text"
              name="name"
              value={shipping.name}
              onChange={handleChange}
              className="add-shipping-modal-input"
            />
          </div>
          <div className="add-shipping-modal-form-group">
            <label className="add-shipping-modal-label">Giá theo Km:</label>
            <input
              type="number"
              name="pricePerKm"
              value={shipping.pricePerKm}
              onChange={handleChange}
              className="add-shipping-modal-input"
            />
          </div>
          <div className="add-shipping-modal-form-group">
            <label className="add-shipping-modal-label">Giá theo Kg:</label>
            <input
              type="number"
              name="pricePerKg"
              value={shipping.pricePerKg}
              onChange={handleChange}
              className="add-shipping-modal-input"
            />
          </div>
          <div className="add-shipping-modal-buttons">
            <button type="submit" className="add-shipping-modal-btn add-shipping-modal-btn-primary">Thêm loại vận chuyển</button>
            <button type="button" onClick={closeModal} className="add-shipping-modal-btn add-shipping-modal-btn-danger">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShipping;
