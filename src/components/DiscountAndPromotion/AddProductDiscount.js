import React, { useState } from 'react';
import ProductDiscountService from '../../services/ProductDiscountService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddProductDiscount.css';

const AddProductDiscount = ({ product, closeModal, setProductDiscounts, productDiscounts }) => {
  const [newPrice, setNewPrice] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const saveProductDiscount = (e) => {
    e.preventDefault();
    const productDiscount = { productId: product.id, newPrice, startDate, endDate };
    ProductDiscountService.createProductDiscount(productDiscount)
      .then(() => {
        setProductDiscounts([...productDiscounts, productDiscount]);
        closeModal();
      })
      .catch(err => {
        console.error("Error creating product discount:", err);
      });
  };

  return (
    <div className="add-product-discount-container">
      <div className="add-product-discount-form">
        <h2 className="add-product-discount-header">Thêm giảm giá cho {product.productName}</h2>
        <form>
          <div className="add-product-discount-form-group">
            <label className="add-product-discount-label">Giá mới</label>
            <input type="text" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="add-product-discount-input" />
          </div>
          <div className="add-product-discount-form-group">
            <label className="add-product-discount-label">Ngày bắt đầu</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              minDate={new Date()}
              className="add-product-discount-input"
            />
          </div>
          <div className="add-product-discount-form-group">
            <label className="add-product-discount-label">Ngày kết thúc</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={new Date()}
              className="add-product-discount-input"
            />
          </div>
          <div className="add-product-discount-buttons">
            <button type="button" onClick={saveProductDiscount} className="add-product-discount-button add-product-discount-button-primary">Lưu</button>
            <button type="button" onClick={closeModal} className="add-product-discount-button add-product-discount-button-danger">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductDiscount;
