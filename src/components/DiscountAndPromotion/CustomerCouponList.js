import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerCouponService from '../../services/CustomerCouponService';

const CustomerCouponList = () => {
  const [customerCoupons, setCustomerCoupons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    CustomerCouponService.getAllCustomerCoupons().then((response) => {
      setCustomerCoupons(response.data);
    });
  }, []);

  const deleteCustomerCoupon = (id) => {
    CustomerCouponService.deleteCustomerCoupon(id).then(() => {
      setCustomerCoupons(customerCoupons.filter((customerCoupon) => customerCoupon.id !== id));
    });
  };

  return (
    <div>
      <h2>Customer Coupon List</h2>
      <button onClick={() => navigate('/add-customer-coupon')}>Add Customer Coupon</button>
      <table>
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
          {customerCoupons.map((customerCoupon) => (
            <tr key={customerCoupon.id}>
              <td>{customerCoupon.id}</td>
              <td>{customerCoupon.code}</td>
              <td>{customerCoupon.description}</td>
              <td>{customerCoupon.discountPercentage}</td>
              <td>{customerCoupon.startDate}</td>
              <td>{customerCoupon.endDate}</td>
              <td>{customerCoupon.maxUsage}</td>
              <td>{customerCoupon.minimumOrderValue}</td>
              <td>{customerCoupon.discountType}</td>
              <td>
                <button onClick={() => navigate(`/edit-customer-coupon/${customerCoupon.id}`)}>Edit</button>
                <button onClick={() => deleteCustomerCoupon(customerCoupon.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerCouponList;
