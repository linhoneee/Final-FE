import ProductList from '../components/Product/ProductList';
import AddProduct from '../components/Product/AddProduct';
import { useNavigate } from 'react-router-dom';
import './ListProductByAdmin.css'; // Import CSS file
import React, {  useState } from 'react';

const ListProductByAdmin = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddProduct = () => {
    navigate('/addproduct');
  };

  return (
    <div className="admin-container">
      <h1 className="admin-header">Quản lý sản phẩm</h1>
      <div className="add-product-form">
      <button onClick={() => setShowAddModal(true)} className="category-list-btn category-list-btn-primary">Thêm Product</button>

      </div>
        <ProductList />

        {showAddModal && <AddProduct onClose={() => setShowAddModal(false)} />}

      </div>
  );
};

export default ListProductByAdmin;
