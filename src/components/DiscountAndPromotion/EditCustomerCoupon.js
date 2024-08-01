import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerCouponService from '../../services/CustomerCouponService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditCustomerCoupon = () => {
  const { id } = useParams();
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [maxUsage, setMaxUsage] = useState('');
  const [minimumOrderValue, setMinimumOrderValue] = useState('');
  const [discountType, setDiscountType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    CustomerCouponService.getCustomerCouponById(id).then((response) => {
      setCode(response.data.code);
      setDescription(response.data.description);
      setDiscountPercentage(response.data.discountPercentage);
      setStartDate(new Date(response.data.startDate));
      setEndDate(response.data.endDate ? new Date(response.data.endDate) : null);
      setMaxUsage(response.data.maxUsage);
      setMinimumOrderValue(response.data.minimumOrderValue);
      setDiscountType(response.data.discountType);
    });
  }, [id]);

  const updateCustomerCoupon = (e) => {
    e.preventDefault();
    const customerCoupon = { code, description, discountPercentage, startDate, endDate, maxUsage, minimumOrderValue, discountType };
    CustomerCouponService.updateCustomerCoupon(customerCoupon, id).then(() => {
      navigate('/customer-coupons');
    });
  };

  return (
    <div>
      <h2>Edit Customer Coupon</h2>
      <form>
        <div>
          <label>Code</label>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        <div>
          <label>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Discount Percentage</label>
          <input type="text" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} />
        </div>
        <div>
          <label>Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            minDate={new Date()}
          />
        </div>
        <div>
          <label>End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            minDate={new Date()}
          />
        </div>
        <div>
          <label>Max Usage</label>
          <input type="text" value={maxUsage} onChange={(e) => setMaxUsage(e.target.value)} />
        </div>
        <div>
          <label>Minimum Order Value</label>
          <input type="text" value={minimumOrderValue} onChange={(e) => setMinimumOrderValue(e.target.value)} />
        </div>
        <div>
          <label>Discount Type</label>
          <input type="text" value={discountType} onChange={(e) => setDiscountType(e.target.value)} />
        </div>
        <button onClick={updateCustomerCoupon}>Update</button>
      </form>
    </div>
  );
};

export default EditCustomerCoupon;
