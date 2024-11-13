import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AddressService from '../../services/AddressService';
import AddAddressPlusModal from './AddAddressPlusModal'; 
import './AddressList.css';
const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate();
  const userID = useSelector(state => state.auth.userID); // Lấy userID từ Redux store

  const fetchAddresses = useCallback(() => {
    AddressService.getAddressesByUserId(userID).then((response) => {
      // Sắp xếp danh sách địa chỉ, đưa địa chỉ mặc định lên đầu
      const sortedAddresses = response.data.sort((a, b) => b.isPrimary - a.isPrimary);
      setAddresses(sortedAddresses);
    });
  }, [userID]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const deleteAddress = (id) => {
    AddressService.deleteAddress(id).then(() => {
      setAddresses(addresses.filter((address) => address.id !== id));
    });
  };

  const setPrimaryAddress = (id) => {
    const addressToUpdate = addresses.find(address => address.id === id);
    addressToUpdate.isPrimary = true;

    AddressService.updateAddress(userID, addressToUpdate, id).then(() => {
      fetchAddresses(); // Fetch updated addresses
    }).catch(handleError);
  };

  const handleError = (error) => {
    console.error('Error:', error);
  };

  const handleShowModal = () => {
    setShowModal(true); // Open the modal when the new button is clicked
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleSave = () => {
    fetchAddresses(); // Refresh address list after saving new address
    setShowModal(false); // Close the modal
  };

  return (
    <div className="address-list-container">
      <h2>Address List</h2>
      <div className="address-list-buttons">
  <button onClick={() => navigate(`/user/${userID}/add-address`)} className="address-list-button address-list-button-primary">Add Address</button>
  <button onClick={handleShowModal} className="address-list-button address-list-button-secondary">Select Address</button>
</div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Receiver Name</th>
            <th>Province/City</th>
            <th>District</th>
            <th>Ward</th>
            <th>Street</th>
            <th>Status</th>
            {/* <th>Latitude</th>
            <th>Longitude</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address) => (
            <tr key={address.id}>
              <td>{address.id}</td>
              <td>{address.receiverName}</td>
              <td>{address.provinceCity}</td>
              <td>{address.district}</td>
              <td>{address.ward}</td>
              <td>{address.street}</td>
              <td>{address.isPrimary ? 'Mặc định' : ' '}</td>
              {/* <td>{address.latitude}</td>
              <td>{address.longitude}</td> */}
    <td>
  <button className="action-button edit-button" onClick={() => navigate(`/user/${userID}/edit-address/${address.id}`)}>Edit</button>
  <button className="action-button delete-button" onClick={() => deleteAddress(address.id)}>Delete</button>
  {!address.isPrimary && (
    <button className="action-button primary-button" onClick={() => setPrimaryAddress(address.id)}>Thiết lập mặc định</button>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <AddAddressPlusModal
          userId={userID}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AddressList;
