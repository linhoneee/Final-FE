import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddressService from '../../services/AddressService';

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams(); // Lấy userId từ URL parameters

  const fetchAddresses = useCallback(() => {
    AddressService.getAddressesByUserId(userId).then((response) => {
      // Sắp xếp danh sách địa chỉ, đưa địa chỉ mặc định lên đầu
      const sortedAddresses = response.data.sort((a, b) => b.isPrimary - a.isPrimary);
      setAddresses(sortedAddresses);
    });
  }, [userId]);

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

    AddressService.updateAddress(userId, addressToUpdate, id).then(() => {
      fetchAddresses(); // Fetch updated addresses
    }).catch(handleError);
  };

  const handleError = (error) => {
    console.error('Error:', error);
  };

  return (
    <div>
      <h2>Address List</h2>
      <button onClick={() => navigate(`/user/${userId}/add-address`)}>Add Address</button>
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
            <th>Latitude</th>
            <th>Longitude</th>
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
              <td>{address.latitude}</td>
              <td>{address.longitude}</td>
              <td>
                <button onClick={() => navigate(`/user/${userId}/edit-address/${address.id}`)}>Edit</button>
                <button onClick={() => deleteAddress(address.id)}>Delete</button>
                {!address.isPrimary && <button onClick={() => setPrimaryAddress(address.id)}>Thiết lập mặc định</button>}
                {/* && bình thường sẽ được hiểu là và nhưng trong trường hợp này
              dùng để nói về điều kiện hiển thị 1 phần tử */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddressList;
