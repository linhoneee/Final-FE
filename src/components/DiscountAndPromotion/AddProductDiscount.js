import React, { useState } from 'react';
import ProductDiscountService from '../../services/ProductDiscountService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddProductDiscount = ({ product, closeModal, setProductDiscounts, productDiscounts }) => {
  const [newPrice, setNewPrice] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const saveProductDiscount = (e) => {
    e.preventDefault();
    const productDiscount = { productId: product.id, newPrice, startDate, endDate };
    ProductDiscountService.createProductDiscount(productDiscount).then(() => {
      setProductDiscounts([...productDiscounts, productDiscount]);
      closeModal();
    }).catch(err => {
      console.error("Error creating product discount:", err);
    });
  };

  return (
    <div>
      <h2>Add Discount for {product.productName}</h2>
      <form>
        <div>
          <label>New Price</label>
          <input type="text" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
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
          <button type="button" onClick={saveProductDiscount}>Save</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddProductDiscount;
