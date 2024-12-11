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
      console.log("discount", response);
  
      if (response.data && response.data.length > 0) {
        const discount = response.data[0];  
  
        setNewPrice(discount.newPrice);
  
        const start = new Date(discount.startDate);
        const end = discount.endDate ? new Date(discount.endDate) : null;
  
        if (isNaN(start)) {
          console.error("Invalid start date:", discount.startDate);
          setStartDate(new Date());  // Nếu không hợp lệ, đặt ngày hôm nay
        } else {
          setStartDate(start);
        }
  
        if (end && isNaN(end)) {
          console.error("Invalid end date:", discount.endDate);
          setEndDate(null);  // Nếu không hợp lệ, đặt null
        } else {
          setEndDate(end);
        }
      } else {
        console.error("No discount data found");
      }
    }).catch((err) => {
      console.error("Error fetching product discount:", err);
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
        <h2 className="edit-product-discount-header">Chỉnh sửa Giảm giá cho {product.productName}</h2>
        <form>
          <div className="edit-product-discount-form-group">
            <label className="edit-product-discount-label">Giá Mới</label>
            <input
              type="text"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="edit-product-discount-input"
            />
          </div>
          <div className="edit-product-discount-form-group">
            <label className="edit-product-discount-label">Ngày Bắt Đầu</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              minDate={new Date()}
              className="edit-product-discount-input"
            />
          </div>
          <div className="edit-product-discount-form-group">
            <label className="edit-product-discount-label">Ngày Kết Thúc</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={new Date()}
              className="edit-product-discount-input"
            />
          </div>
          <div className="edit-product-discount-buttons">
            <button
              type="button"
              onClick={updateProductDiscount}
              className="edit-product-discount-button edit-product-discount-button-primary"
            >
              Cập Nhật
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="edit-product-discount-button edit-product-discount-button-danger"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default EditProductDiscount;
