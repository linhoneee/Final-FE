import ProductList from '../components/Product/ProductList';
import './ListProductByAdmin.css';
import React from 'react';

const ListProductByAdmin = () => {


  return (
    <div className="admin-container">
      <div className="add-product-form">
      <ProductList />

      </div>


      </div>
  );
};

export default ListProductByAdmin;
