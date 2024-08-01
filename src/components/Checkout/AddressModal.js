import React from 'react';
import '../../Css/AddressModal.css';

const AddressModal = ({ defaultAddress, addresses, onClose, onSelect, onChangeAddress }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
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
    <h4>Default Address</h4>
    {defaultAddress ? (
      <>
        <p>{defaultAddress.receiverName}</p>
        <p>{defaultAddress.street}, {defaultAddress.ward}, {defaultAddress.district}, {defaultAddress.provinceCity}</p>
        <button onClick={onChangeAddress}>Change Address</button>
      </>
    ) : (
      <p>Loading default address...</p>
    )}
  </div>
);

export { AddressModal, DefaultAddress };
