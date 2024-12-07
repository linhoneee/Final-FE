import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerCouponService from '../../services/CustomerCouponService';
import Modal from 'react-modal';
import AddCustomerCoupon from './AddCustomerCoupon';
import EditCustomerCoupon from './EditCustomerCoupon';
import './CustomerCouponList.css';
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast function

Modal.setAppElement('#root'); // Cấu hình phần tử gốc cho Modal

const CustomerCouponList = () => {
  const [customerCoupons, setCustomerCoupons] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);

  useEffect(() => {
    fetchCustomerCoupons();
  }, []);

  const fetchCustomerCoupons = async () => {
    try {
      const response = await CustomerCouponService.getAllCustomerCoupons();
      setCustomerCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      showGeneralToast('Không thể tải danh sách mã giảm giá.', 'error');
    }
  };

  const deleteCustomerCoupon = (id) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa mã giảm giá này?');
    if (confirmDelete) {
      CustomerCouponService.deleteCustomerCoupon(id)
        .then(() => {
          setCustomerCoupons((prevCoupons) =>
            prevCoupons.filter((coupon) => coupon.id !== id)
          );
          showGeneralToast('Mã giảm giá đã được xóa thành công!', 'success');
        })
        .catch((error) => {
          console.error('Error deleting coupon:', error);
          showGeneralToast('Có lỗi xảy ra khi xóa mã giảm giá', 'error');
        });
    }
  };

  const openAddModal = () => setShowAddModal(true);

  const openEditModal = (coupon) => {
    setCurrentCoupon(coupon);
    setShowEditModal(true);
  };

  const closeAddModal = () => setShowAddModal(false);

  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentCoupon(null);
  };

  return (
    <div className="customer-coupon-list-container">
      <h2 className="customer-coupon-list-title">Danh sách Phiếu giảm giá</h2>
      <button onClick={openAddModal} className="customer-coupon-list-add-btn">
        Thêm Phiếu giảm giá
      </button>
      <table className="customer-coupon-list-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Mô tả</th>
            <th>Tỷ lệ giảm giá</th>
            <th>Thời gian hiệu lực</th>
            <th>Số lần sử dụng tối đa</th>
            <th>Số lần sử dụng hiện tại</th>
            <th>Giá trị đơn hàng tối thiểu</th>
            <th>Loại giảm giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
  {customerCoupons.map((coupon) => {
    const currentDate = new Date();
    const isExpired = new Date(coupon.endDate) < currentDate; // Kiểm tra hết hạn
    const isMaxUsageReached = coupon.currentUsage >= coupon.maxUsage; // Kiểm tra đã đạt số lần sử dụng tối đa

    // Xác định class cho màu nền
    let rowClass = '';
    if (isExpired && isMaxUsageReached) {
      rowClass = 'expired-max-usage';
    } else if (isExpired) {
      rowClass = 'expired';
    } else if (isMaxUsageReached) {
      rowClass = 'max-usage-reached';
    }

    // Xác định thông báo cần hiển thị
    let statusMessage = '';
    if (isExpired && isMaxUsageReached) {
      statusMessage = 'Đã hết hạn sử dụng và đạt số lần sử dụng tối đa.';
    } else if (isExpired) {
      statusMessage = 'Đã hết hạn sử dụng.';
    } else if (isMaxUsageReached) {
      statusMessage = 'Đã đạt số lần sử dụng tối đa.';
    }

    return (
      <tr key={coupon.id} className={rowClass}>
        <td>{coupon.code}</td>
        <td>{coupon.description}</td>
        <td>{coupon.discountPercentage}</td>
        <td>{`${new Date(coupon.startDate).toLocaleDateString()} - ${new Date(coupon.endDate).toLocaleDateString()}`}</td>
        <td>{coupon.maxUsage}</td>
        <td>{coupon.currentUsage}</td>
        <td>{coupon.minimumOrderValue}</td>
        <td>{coupon.discountType}</td>
        <td>
          <button
            onClick={() => openEditModal(coupon)}
            className="customer-coupon-list-action-btn"
          >
            Cập Nhật
          </button>
          <button
            onClick={() => deleteCustomerCoupon(coupon.id)}
            className="customer-coupon-list-action-btn customer-coupon-list-delete-btn"
          >
            Xóa
          </button>
          {/* Hiển thị dòng chữ đỏ nếu có vấn đề */}
          {statusMessage && (
            <div colSpan="9" style={{ color: 'red', fontWeight: 'bold', marginTop: '8px', fontSize: '0.9rem' }}>
              {statusMessage}
            </div>
          )}
        </td>
      </tr>
    );
  })}
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
