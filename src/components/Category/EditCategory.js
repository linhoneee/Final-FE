import React, { useEffect, useState } from 'react';
import CategoryService from '../../services/CategoryService';
import './EditCategory.css';
import showGeneralToast from '../toastUtils/showGeneralToast'; 

const EditCategory = ({ category, onClose, onCategoryUpdated }) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [error, setError] = useState(''); 
  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    }
  }, [category]);

  const updateCategory = (e) => {
    e.preventDefault();

    if (!name || !description) {
      setError('Cả tên và mô tả danh mục đều là bắt buộc!');
      return; 
    }

    const updatedCategory = { id: category.id, name, description };

    CategoryService.updateCategory(updatedCategory, category.id)
      .then(() => {
        onCategoryUpdated(updatedCategory); 
        onClose(); 
        showGeneralToast("Danh mục đã được cập nhật thành công!", "success");
      })
      .catch((error) => {
        console.error('Error updating category:', error);
        showGeneralToast("Có lỗi xảy ra khi cập nhật danh mục", "error"); 
      });
  };

  return (
    <div className="edit-category-modal">
      <div className="edit-category-modal-content">
        <h2 className="edit-category-modal-title">Chỉnh sửa danh mục</h2>

        {error && <div className="error-toast">{error}</div>}

        <form>
          <div className="edit-category-modal-form-group">
            <label>Tên danh mục</label>
            <input
              type="text"
              className="edit-category-modal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Mô tả danh mục</label>
            <input
              type="text"
              className="edit-category-modal-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button 
            className="edit-category-modal-btn edit-category-modal-btn-primary" 
            onClick={updateCategory}
          >
            Cập nhật
          </button>
          <button 
            className="edit-category-modal-btn edit-category-modal-btn-secondary" 
            onClick={onClose}
          >
            Hủy
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
