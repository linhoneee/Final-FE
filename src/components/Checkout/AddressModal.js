import React from 'react';
import './AddressModal.css';

const AddressModal = ({ defaultAddress, addresses, onClose, onSelect, onChangeAddress }) => {
  return (
    <div className="address-modal">
      <div className="address-modal-content">
        <span className="address-modal-close" onClick={onClose}>&times;</span>
        <h2>Select Address</h2>
        <ul>
          {addresses.map(address => (
            <li key={address.id} onClick={() => onSelect(address)}>
              <p>{address.receiverName}</p>
              <p>{address.street}, {address.ward}, {address.district}, {address.provinceCity}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const DefaultAddress = ({ defaultAddress, onChangeAddress }) => (
  <div className="default-address">
    <h4>Địa Chỉ</h4>
    {defaultAddress ? (
      <>
        <p>{defaultAddress.receiverName}</p>
        <p>{defaultAddress.street}, {defaultAddress.ward}, {defaultAddress.district}, {defaultAddress.provinceCity}</p>
        <button onClick={onChangeAddress}>Đổi Địa Chỉ</button>
      </>
    ) : (
      <p>Loading default address...</p>
    )}
  </div>
);

export { AddressModal, DefaultAddress };
