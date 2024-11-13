// AddCategory.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../services/CategoryService';
import './AddCategory.css';

const AddCategory = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const saveCategory = (e) => {
    e.preventDefault();
    const category = { name };
    CategoryService.createCategory(category).then(() => {
      navigate('/categories');
    });
  };

  return (
    <div className="add-category-modal-container">
      <div className="add-category-modal-content">
        <h2 className="add-category-modal-title">Thêm danh mục</h2>
        <form className="add-category-modal-form">
          <div className="add-category-modal-form-group">
            <label className="add-category-modal-label">Tên danh mục</label>
            <input
              type="text"
              className="add-category-modal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button onClick={saveCategory} className="add-category-modal-btn add-category-modal-btn-primary">Lưu</button>
          <button onClick={() => navigate('/categories')} className="add-category-modal-btn add-category-modal-btn-secondary">Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
