import React, { useState } from 'react';
import CustomerCouponService from '../../services/CustomerCouponService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddCustomerCoupon.css';
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast function

const AddCustomerCoupon = ({ closeModal, fetchCustomerCoupons }) => {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [maxUsage, setMaxUsage] = useState('');
  const [minimumOrderValue, setMinimumOrderValue] = useState('');
  const [discountType, setDiscountType] = useState('');

  const saveCustomerCoupon = (e) => {
    e.preventDefault();
    
    const customerCoupon = { 
      code, 
      description, 
      discountPercentage, 
      startDate, 
      endDate, 
      maxUsage, 
      minimumOrderValue, 
      discountType 
    };
  
    CustomerCouponService.createCustomerCoupon(customerCoupon)
      .then(() => {
        fetchCustomerCoupons();
        
        closeModal();
        showGeneralToast("Mã giảm giá đã được tạo thành công!", "success");
      })
      .catch((error) => {
        console.error('Error saving customer coupon:', error);
        
        if (error.response && error.response.data) {
          const { message } = error.response.data;
          showGeneralToast(message, "error");
        } else {
          showGeneralToast("Có lỗi xảy ra khi tạo mã giảm giá", "error");
        }
      });
  };
  

  return (
    <div className="add-customer-coupon-modal-container">
  <div className="add-customer-coupon-modal-content">
    <h2 className="add-customer-coupon-modal-header">Thêm Phiếu Giảm Giá Khách Hàng</h2>
    <form className="add-customer-coupon-form">
      <div className="add-customer-coupon-form-group">
        <label className="add-customer-coupon-label">Mã</label>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="add-customer-coupon-input" />
      </div>
      <div className="add-customer-coupon-form-group">
        <label className="add-customer-coupon-label">Mô tả</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="add-customer-coupon-input" />
      </div>
      <div className="add-customer-coupon-form-group">
        <label className="add-customer-coupon-label">Tỷ lệ giảm giá</label>
        <input type="text" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} className="add-customer-coupon-input" />
      </div>
      <div className="add-customer-coupon-form-group">
        <label className="add-customer-coupon-label">Ngày bắt đầu</label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} minDate={new Date()} className="add-customer-coupon-input" />
      </div>
      <div className="add-customer-coupon-form-group">
        <label className="add-customer-coupon-label">Ngày kết thúc</label>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} minDate={startDate} className="add-customer-coupon-input" />
      </div>
      <div className="add-customer-coupon-form-group">
        <label className="add-customer-coupon-label">Số lần sử dụng tối đa</label>
        <input type="text" value={maxUsage} onChange={(e) => setMaxUsage(e.target.value)} className="add-customer-coupon-input" />
      </div>
      <div className="add-customer-coupon-form-group">
        <label className="add-customer-coupon-label">Giá trị đơn hàng tối thiểu</label>
        <input type="text" value={minimumOrderValue} onChange={(e) => setMinimumOrderValue(e.target.value)} className="add-customer-coupon-input" />
      </div>
      <div className="add-customer-coupon-form-group">
        <label className="add-customer-coupon-label">Loại giảm giá</label>
        <input type="text" value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="add-customer-coupon-input" />
      </div>
      <div className="add-customer-coupon-button-group">
        <button onClick={saveCustomerCoupon} className="add-customer-coupon-button add-customer-coupon-button-primary">Lưu</button>
        <button type="button" onClick={closeModal} className="add-customer-coupon-button add-customer-coupon-button-danger">Hủy</button>
      </div>
    </form>
  </div>
</div>

  );
};

export default AddCustomerCoupon;
