import React, { useState, useEffect } from 'react';
import ShippingService from '../../services/ShippingService';
import './UpdateShipping.css';

const UpdateShipping = ({ shipping, closeModal, fetchShippings }) => {
  const [updatedShipping, setUpdatedShipping] = useState({
    name: '',
    pricePerKm: '',
    pricePerKg: ''
  });

  useEffect(() => {
    if (shipping) {
      setUpdatedShipping(shipping);
    }
  }, [shipping]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedShipping({
      ...updatedShipping,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ShippingService.updateShippingById(updatedShipping, shipping.id)
      .then(() => {
        fetchShippings();
        closeModal();
      })
      .catch(error => {
        console.error('Error updating shipping:', error);
      });
  };

  return (
    <div className="update-shipping-modal-container">
      <div className="update-shipping-modal-content">
        <h2 className="update-shipping-modal-header">Cập nhật loại vận chuyển</h2>
        <form className="update-shipping-modal-form" onSubmit={handleSubmit}>
          <div className="update-shipping-modal-form-group">
            <label className="update-shipping-modal-label">Tên:</label>
            <input
              type="text"
              name="name"
              value={updatedShipping.name}
              onChange={handleChange}
              className="update-shipping-modal-input"
            />
          </div>
          <div className="update-shipping-modal-form-group">
            <label className="update-shipping-modal-label">Giá theo Km:</label>
            <input
              type="number"
              name="pricePerKm"
              value={updatedShipping.pricePerKm}
              onChange={handleChange}
              className="update-shipping-modal-input"
            />
          </div>
          <div className="update-shipping-modal-form-group">
            <label className="update-shipping-modal-label">Giá theo Kg:</label>
            <input
              type="number"
              name="pricePerKg"
              value={updatedShipping.pricePerKg}
              onChange={handleChange}
              className="update-shipping-modal-input"
            />
          </div>
          <div className="update-shipping-modal-buttons">
            <button type="submit" className="update-shipping-modal-button update-shipping-modal-button-primary">Cập nhật loại vận chuyển</button>
            <button type="button" onClick={closeModal} className="update-shipping-modal-button update-shipping-modal-button-danger">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateShipping;
