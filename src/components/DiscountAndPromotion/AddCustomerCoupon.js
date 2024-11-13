import React, { useState } from 'react';
import CustomerCouponService from '../../services/CustomerCouponService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddCustomerCoupon.css';

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
    const customerCoupon = { code, description, discountPercentage, startDate, endDate, maxUsage, minimumOrderValue, discountType };
    CustomerCouponService.createCustomerCoupon(customerCoupon).then(() => {
      fetchCustomerCoupons();
      closeModal();
    });
  };

  return (
    <div className="add-customer-coupon-container">
      <h2 className="add-customer-coupon-header">Add Customer Coupon</h2>
      <form className="add-customer-coupon-form">
        <div className="add-customer-coupon-form-group">
          <label className="add-customer-coupon-label">Code</label>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="add-customer-coupon-input" />
        </div>
        <div className="add-customer-coupon-form-group">
          <label className="add-customer-coupon-label">Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="add-customer-coupon-input" />
        </div>
        <div className="add-customer-coupon-form-group">
          <label className="add-customer-coupon-label">Discount Percentage</label>
          <input type="text" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} className="add-customer-coupon-input" />
        </div>
        <div className="add-customer-coupon-form-group">
          <label className="add-customer-coupon-label">Start Date</label>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} minDate={new Date()} className="add-customer-coupon-input" />
        </div>
        <div className="add-customer-coupon-form-group">
          <label className="add-customer-coupon-label">End Date</label>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} minDate={new Date()} className="add-customer-coupon-input" />
        </div>
        <div className="add-customer-coupon-form-group">
          <label className="add-customer-coupon-label">Max Usage</label>
          <input type="text" value={maxUsage} onChange={(e) => setMaxUsage(e.target.value)} className="add-customer-coupon-input" />
        </div>
        <div className="add-customer-coupon-form-group">
          <label className="add-customer-coupon-label">Minimum Order Value</label>
          <input type="text" value={minimumOrderValue} onChange={(e) => setMinimumOrderValue(e.target.value)} className="add-customer-coupon-input" />
        </div>
        <div className="add-customer-coupon-form-group">
          <label className="add-customer-coupon-label">Discount Type</label>
          <input type="text" value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="add-customer-coupon-input" />
        </div>
        <button onClick={saveCustomerCoupon} className="add-customer-coupon-button add-customer-coupon-button-primary">Save</button>
        <button onClick={closeModal} className="add-customer-coupon-button add-customer-coupon-button-danger">Cancel</button>
      </form>
    </div>
  );
};

export default AddCustomerCoupon;
