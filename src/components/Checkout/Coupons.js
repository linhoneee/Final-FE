import React from 'react';
import { TextField } from '@material-ui/core';

const Coupons = ({ coupons, voucherCode, handleVoucherCodeChange, handleCouponSelect, handleApplyCoupon }) => (
  <div>
    <h3>Coupons</h3>
    <select onChange={handleCouponSelect}>
      <option value="">Select a coupon</option>
      {coupons.map(coupon => (
        <option key={coupon.code} value={coupon.code}>
          {coupon.code} - {coupon.description}
        </option>
      ))}
    </select>
    <TextField
      label="Enter Voucher Code"
      value={voucherCode}
      onChange={handleVoucherCodeChange}
    />
    <button onClick={handleApplyCoupon}>Apply Coupon</button>
  </div>
);

export default Coupons;
