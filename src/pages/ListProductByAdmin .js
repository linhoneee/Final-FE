import React from 'react';
import ProductList from '../components/Product/ProductList';
import AddProduct from '../components/Product/AddProduct';
import { useNavigate } from 'react-router-dom';

const ListProductByAdmin = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/addproduct');
  };

  return (
    <div>
      <h1>Quản lý sản phẩm</h1>
      <button onClick={handleAddProduct}>Add Product</button>
      <AddProduct />
      <ProductList/>
    </div>
  );
};

export default ListProductByAdmin;
