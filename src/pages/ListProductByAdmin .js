import React from 'react';
import ProductList from '../components/Product/ProductList';
import AddProduct from '../components/Product/AddProduct';
import { useNavigate } from 'react-router-dom';
import './ListProductByAdmin.css'; // Import CSS file

const ListProductByAdmin = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/addproduct');
  };

  return (
    <div className="admin-container">
      <h1 className="admin-header">Quản lý sản phẩm</h1>
      <button className="add-product-button" onClick={handleAddProduct}>Add Product</button>
      <div className="add-product-form">
        <AddProduct />
      </div>
        <ProductList />
      </div>
  );
};

export default ListProductByAdmin;
