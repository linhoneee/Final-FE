import React, { useState } from 'react';
import CategoryService from '../../services/CategoryService';
import './AddCategory.css';

const AddCategory = ({ onClose, onCategoryAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const saveCategory = (e) => {
    e.preventDefault();
    const category = { name, description };
    CategoryService.createCategory(category)
      .then((response) => {
        onCategoryAdded(response.data); // Thêm danh mục mới vào danh sách
        onClose(); // Đóng modal
      })
      .catch((error) => {
        console.error('Error adding category:', error);
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
            <label className="add-category-modal-label">Mô tả danh mục</label>
            <input
              type="text"
              className="add-category-modal-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button onClick={saveCategory} className="add-category-modal-btn add-category-modal-btn-primary">Lưu</button>
          <button onClick={onClose} className="add-category-modal-btn add-category-modal-btn-secondary">Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
