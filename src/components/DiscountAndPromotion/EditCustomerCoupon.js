import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomerCouponService from '../../services/CustomerCouponService';
import './EditCustomerCoupon.css';

const EditCustomerCoupon = ({ coupon, closeModal, fetchCustomerCoupons }) => {
  const [code, setCode] = useState(coupon.code);
  const [description, setDescription] = useState(coupon.description);
  const [discountPercentage, setDiscountPercentage] = useState(coupon.discountPercentage);
  const [startDate, setStartDate] = useState(new Date(coupon.startDate));
  const [endDate, setEndDate] = useState(coupon.endDate ? new Date(coupon.endDate) : null);
  const [maxUsage, setMaxUsage] = useState(coupon.maxUsage);
  const [minimumOrderValue, setMinimumOrderValue] = useState(coupon.minimumOrderValue);
  const [discountType, setDiscountType] = useState(coupon.discountType);

  const updateCustomerCoupon = (e) => {
    e.preventDefault();
    const updatedCoupon = { code, description, discountPercentage, startDate, endDate, maxUsage, minimumOrderValue, discountType };
    CustomerCouponService.updateCustomerCoupon(updatedCoupon, coupon.id).then(() => {
      fetchCustomerCoupons();
      closeModal();
    });
  };

  return (
    <div className="edit-customer-coupon-modal-container">
      <div className="edit-customer-coupon-modal-content">
        <h2 className="edit-customer-coupon-modal-title">Chỉnh sửa mã giảm giá</h2>
        <form className="edit-customer-coupon-form">
          <div className="edit-customer-coupon-form-group">
            <label className="edit-customer-coupon-label">Mã giảm giá</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="edit-customer-coupon-input"
            />
          </div>
          <div className="edit-customer-coupon-form-group">
            <label className="edit-customer-coupon-label">Mô tả</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="edit-customer-coupon-input"
            />
          </div>
          <div className="edit-customer-coupon-form-group">
            <label className="edit-customer-coupon-label">Phần trăm giảm giá</label>
            <input
              type="text"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              className="edit-customer-coupon-input"
            />
          </div>
          <div className="edit-customer-coupon-form-group">
            <label className="edit-customer-coupon-label">Ngày bắt đầu</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              minDate={new Date()}
              className="edit-customer-coupon-input"
            />
          </div>
          <div className="edit-customer-coupon-form-group">
            <label className="edit-customer-coupon-label">Ngày kết thúc</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={new Date()}
              className="edit-customer-coupon-input"
            />
          </div>
          <div className="edit-customer-coupon-form-group">
            <label className="edit-customer-coupon-label">Sử dụng tối đa</label>
            <input
              type="text"
              value={maxUsage}
              onChange={(e) => setMaxUsage(e.target.value)}
              className="edit-customer-coupon-input"
            />
          </div>
          <div className="edit-customer-coupon-form-group">
            <label className="edit-customer-coupon-label">Giá trị đơn hàng tối thiểu</label>
            <input
              type="text"
              value={minimumOrderValue}
              onChange={(e) => setMinimumOrderValue(e.target.value)}
              className="edit-customer-coupon-input"
            />
          </div>
          <div className="edit-customer-coupon-form-group">
            <label className="edit-customer-coupon-label">Loại giảm giá</label>
            <input
              type="text"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="edit-customer-coupon-input"
            />
          </div>
          <button
            onClick={updateCustomerCoupon}
            className="edit-customer-coupon-btn edit-customer-coupon-btn-primary"
          >
            Cập nhật
          </button>
          <button
            onClick={closeModal}
            className="edit-customer-coupon-btn edit-customer-coupon-btn-danger"
          >
            Hủy
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerCoupon;
