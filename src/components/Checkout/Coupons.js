import React from 'react';
import { TextField } from '@material-ui/core';
import './Coupons.css'; // Import the new CSS file

const Coupons = ({ coupons, voucherCode, handleVoucherCodeChange, handleCouponSelect, handleApplyCoupon }) => (
  <div className="coupons-container">
    <h3>Coupons</h3>
    <select onChange={handleCouponSelect}>
      <option value="">Select a coupon</option>
      {coupons.map(coupon => (
        <option key={coupon.code} value={coupon.code}>
          {coupon.code} - {coupon.description}
        </option>
      ))}
    </select>
    <div className="coupon-input-container">
      <TextField
        label="Enter Voucher Code"
        value={voucherCode}
        onChange={handleVoucherCodeChange}
        variant="outlined"
        className="coupon-input"
      />
    </div>
    <button onClick={handleApplyCoupon}>Apply Coupon</button>
  </div>
);

export default Coupons;
