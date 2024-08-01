import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductDiscountService from '../../services/ProductDiscountService';

const ProductDiscountList = () => {
  const [productDiscounts, setProductDiscounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ProductDiscountService.getAllProductDiscounts().then((response) => {
      setProductDiscounts(response.data);
    });
  }, []);

  const deleteProductDiscount = (id) => {
    ProductDiscountService.deleteProductDiscount(id).then(() => {
      setProductDiscounts(productDiscounts.filter((productDiscount) => productDiscount.id !== id));
    });
  };

  return (
    <div>
      <h2>Product Discount List</h2>
      <button onClick={() => navigate('/add-product-discount')}>Add Product Discount</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product ID</th>
            <th>New Price</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productDiscounts.map((productDiscount) => (
            <tr key={productDiscount.id}>
              <td>{productDiscount.id}</td>
              <td>{productDiscount.productId}</td>
              <td>{productDiscount.newPrice}</td>
              <td>{productDiscount.startDate}</td>
              <td>{productDiscount.endDate}</td>
              <td>
                <button onClick={() => navigate(`/edit-product-discount/${productDiscount.id}`)}>Edit</button>
                <button onClick={() => deleteProductDiscount(productDiscount.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductDiscountList;
