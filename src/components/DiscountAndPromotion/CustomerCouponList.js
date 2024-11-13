import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerCouponService from '../../services/CustomerCouponService';
import Modal from 'react-modal';
import AddCustomerCoupon from './AddCustomerCoupon';
import EditCustomerCoupon from './EditCustomerCoupon';
import './CustomerCouponList.css';

Modal.setAppElement('#root'); // Cấu hình phần tử gốc cho Modal

const CustomerCouponList = () => {
  const [customerCoupons, setCustomerCoupons] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);

  useEffect(() => {
    fetchCustomerCoupons();
  }, []);

  const fetchCustomerCoupons = () => {
    CustomerCouponService.getAllCustomerCoupons().then((response) => {
      setCustomerCoupons(response.data);
    });
  };

  const deleteCustomerCoupon = (id) => {
    CustomerCouponService.deleteCustomerCoupon(id).then(() => {
      setCustomerCoupons(customerCoupons.filter((coupon) => coupon.id !== id));
    });
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const openEditModal = (coupon) => {
    setCurrentCoupon(coupon);
    setShowEditModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentCoupon(null);
  };

  return (
    <div className="customer-coupon-list-container">
      <h2 className="customer-coupon-list-title">Customer Coupon List</h2>
      <button onClick={openAddModal} className="customer-coupon-list-add-btn">Add Customer Coupon</button>
      <table className="customer-coupon-list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Description</th>
            <th>Discount Percentage</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Max Usage</th>
            <th>Minimum Order Value</th>
            <th>Discount Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customerCoupons.map((coupon) => (
            <tr key={coupon.id}>
              <td>{coupon.id}</td>
              <td>{coupon.code}</td>
              <td>{coupon.description}</td>
              <td>{coupon.discountPercentage}</td>
              <td>{coupon.startDate}</td>
              <td>{coupon.endDate}</td>
              <td>{coupon.maxUsage}</td>
              <td>{coupon.minimumOrderValue}</td>
              <td>{coupon.discountType}</td>
              <td>
                <button onClick={() => openEditModal(coupon)} className="customer-coupon-list-action-btn">Edit</button>
                <button onClick={() => deleteCustomerCoupon(coupon.id)} className="customer-coupon-list-action-btn customer-coupon-list-delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding Customer Coupon */}
      <Modal
        isOpen={showAddModal}
        onRequestClose={closeAddModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <AddCustomerCoupon closeModal={closeAddModal} fetchCustomerCoupons={fetchCustomerCoupons} />
      </Modal>

      {/* Modal for Editing Customer Coupon */}
      {showEditModal && currentCoupon && (
        <Modal
          isOpen={showEditModal}
          onRequestClose={closeEditModal}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <EditCustomerCoupon
            coupon={currentCoupon}
            closeModal={closeEditModal}
            fetchCustomerCoupons={fetchCustomerCoupons}
          />
        </Modal>
      )}
    </div>
  );
};

export default CustomerCouponList;
