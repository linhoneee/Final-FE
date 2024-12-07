import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AddressService from '../../services/AddressService';
import AddAddressPlusModal from './AddAddressPlusModal'; 
import './AddressList.css';
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate();
  const userID = useSelector(state => state.auth.userID); // Lấy userID từ Redux store
  const [loading, setLoading] = useState(false);

  const fetchAddresses = useCallback(() => {
    setLoading(true);
    AddressService.getAddressesByUserId(userID)
      .then((response) => {
              // Sắp xếp danh sách địa chỉ, đưa địa chỉ mặc định lên đầu
        const sortedAddresses = response.data.sort((a, b) => b.isPrimary - a.isPrimary);
        setAddresses(sortedAddresses);
      })
      .catch((error) => console.error('Error fetching addresses:', error))
      .finally(() => setLoading(false));
  }, [userID]);
  

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const deleteAddress = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      AddressService.deleteAddress(id)
        .then(() => {
          setAddresses(addresses.filter((address) => address.id !== id));
          showGeneralToast('Địa chỉ đã được xóa thành công!', 'success');
        })
        .catch((error) => {
          showGeneralToast('Lỗi khi xóa địa chỉ!', 'error');
          console.error('Error deleting address:', error);
        });
    }
  };
  
  

  const setPrimaryAddress = (id) => {
    const addressToUpdate = addresses.find(address => address.id === id);
    addressToUpdate.isPrimary = true;
  
    AddressService.updateAddress(userID, addressToUpdate, id)
      .then(() => {
        fetchAddresses();
        showGeneralToast('Đã đặt địa chỉ này làm địa chỉ chính!', 'success');
      })
      .catch((error) => {
        showGeneralToast('Lỗi khi đặt địa chỉ chính!', 'error');
        console.error('Error setting primary address:', error);
      });
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
      <h2>Danh Sách Địa Chỉ</h2>
      <div className="address-list-buttons">
  <button onClick={handleShowModal} className="address-list-button address-list-button-secondary">Thêm Địa Chỉ</button>
</div>
<table className="address-list-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Tên người nhận</th>
      <th>Địa chỉ</th> {/* Cột mới cho địa chỉ nối lại */}
      <th>Hành động</th> {/* Nút hành động trên cùng một hàng */}
    </tr>
  </thead>
  <tbody>
    {addresses.map((address) => (
      <tr key={address.id}>
        <td>{address.id}</td>
        <td>{address.receiverName}</td>
        <td>
          {`${address.street}, ${address.ward}, ${address.district}, ${address.provinceCity}`}
        </td> {/* Nối địa chỉ */}
        <td className="action-buttons">
          <button
            className="action-button edit-button"
            onClick={() => navigate(`/user/${userID}/edit-address/${address.id}`)}
          >
            Sửa
          </button>
          <button
            className="action-button delete-button"
            onClick={() => deleteAddress(address.id)}
          >
            Xóa
          </button>
          {!address.isPrimary && (
            <button
              className="action-button primary-button"
              onClick={() => setPrimaryAddress(address.id)}
            >
              Đặt làm địa chỉ chính
            </button>
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
