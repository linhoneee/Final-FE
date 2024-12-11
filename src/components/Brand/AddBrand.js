import React, { useState } from 'react';
import BrandService from '../../services/BrandService';
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast
import './AddBrand.css';

const AddBrand = ({ onClose, onCategoryAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(''); 

  const saveBrand = (e) => {
    e.preventDefault();
    
    if (!name || !description) {
      setError('Cả tên và mô tả thương hiệu đều là bắt buộc!');
      return; 
    }

    const brand = { name, description };

    BrandService.createBrand(brand)
      .then((response) => {
        const newBrand = response.data; 
        showGeneralToast('Thương hiệu đã được thêm thành công!', 'success');
        onClose();
        if (onCategoryAdded) {
          onCategoryAdded(newBrand); 
        }
      })
      .catch((error) => {
        showGeneralToast('Đã xảy ra lỗi khi thêm thương hiệu!', 'error');
        console.error('Error saving brand:', error);
      });
  };

  return (
    <div className="brand-add-modal">
      <div className="brand-add-modal-content">
        <h2 className="brand-add-modal-title">Thêm thương hiệu</h2>
        
        {error && <div className="error-toast">{error}</div>}

        <form>
          <div className="brand-add-modal-form-group">
            <label>Tên thương hiệu</label>
            <input
              type="text"
              className="brand-add-modal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Mô tả thương hiệu</label>
            <input
              type="text"
              className="brand-add-modal-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            onClick={saveBrand}
            className="brand-add-modal-btn brand-add-modal-btn-primary"
          >
            Lưu
          </button>
          <button
            onClick={onClose}
            className="brand-add-modal-btn brand-add-modal-btn-danger"
          >
            Hủy
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBrand;
