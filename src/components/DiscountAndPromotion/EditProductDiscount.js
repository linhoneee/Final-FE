import React, { useEffect, useState } from 'react';
import ProductDiscountService from '../../services/ProductDiscountService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EditProductDiscount.css';

const EditProductDiscount = ({ product, closeModal, setProductDiscounts, productDiscounts }) => {
  const [newPrice, setNewPrice] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    ProductDiscountService.getProductDiscountById(product.id).then((response) => {
      setNewPrice(response.data.newPrice);
      setStartDate(new Date(response.data.startDate));
      setEndDate(response.data.endDate ? new Date(response.data.endDate) : null);
    });
  }, [product.id]);

  const updateProductDiscount = (e) => {
    e.preventDefault();
    const productDiscount = { productId: product.id, newPrice, startDate, endDate };
    ProductDiscountService.updateProductDiscount(productDiscount, product.id)
      .then(() => {
        setProductDiscounts(
          productDiscounts.map((discount) =>
            discount.productId === product.id ? productDiscount : discount
          )
        );
        closeModal();
      })
      .catch((err) => {
        console.error("Error updating product discount:", err);
      });
  };

  return (
    <div className="edit-product-discount-container">
      <div className="edit-product-discount-form">
      <h2 className="edit-product-discount-header">Edit Discount for {product.productName}</h2>
      <form >
        <div className="edit-product-discount-form-group">
          <label className="edit-product-discount-label">New Price</label>
          <input type="text" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="edit-product-discount-input" />
        </div>
        <div className="edit-product-discount-form-group">
          <label className="edit-product-discount-label">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            minDate={new Date()}
            className="edit-product-discount-input"
          />
        </div>
        <div className="edit-product-discount-form-group">
          <label className="edit-product-discount-label">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            minDate={new Date()}
            className="edit-product-discount-input"
          />
        </div>
        <div className="edit-product-discount-buttons">
          <button type="button" onClick={updateProductDiscount} className="edit-product-discount-button edit-product-discount-button-primary">Update</button>
          <button type="button" onClick={closeModal} className="edit-product-discount-button edit-product-discount-button-danger">Cancel</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default EditProductDiscount;
