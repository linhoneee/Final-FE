import React, { useEffect, useState } from 'react';
import CategoryService from '../../services/CategoryService';
import './EditCategory.css';

const EditCategory = ({ category, onClose }) => {
  const [name, setName] = useState(category?.name || '');

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const updateCategory = (e) => {
    e.preventDefault();
    const updatedCategory = { name };
    CategoryService.updateCategory(updatedCategory, category.id).then(() => {
      onClose();
    });
  };

  return (
    <div className="edit-category-modal">
      <div className="edit-category-modal-content">
        <h2 className="edit-category-modal-title">Chỉnh sửa danh mục</h2>
        <form>
          <div className="edit-category-modal-form-group">
            <label>Tên danh mục</label>
            <input
              type="text"
              className="edit-category-modal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button className="edit-category-modal-btn edit-category-modal-btn-primary" onClick={updateCategory}>Cập nhật</button>
          <button className="edit-category-modal-btn edit-category-modal-btn-secondary" onClick={onClose}>Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
