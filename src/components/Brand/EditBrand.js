import React, { useState, useEffect } from 'react';
import BrandService from '../../services/BrandService';
import './EditBrand.css';
import showGeneralToast from '../toastUtils/showGeneralToast'; 

const EditBrand = ({ brand, onClose, setBrands }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (brand) {
      setName(brand.name);
      setDescription(brand.description);
      setError('');  
    }
  }, [brand]);

  const updateBrand = (e) => {
    e.preventDefault();
    
    if (!name || !description) {
      setError('Cả tên và mô tả thương hiệu đều là bắt buộc!');
      return; 
    }

    const updatedBrand = { ...brand, name, description };

    BrandService.updateBrand(updatedBrand, brand.id)
      .then(() => {
        onClose();
        setBrands((prevBrands) =>
          prevBrands.map((b) => (b.id === brand.id ? updatedBrand : b))
        );
        showGeneralToast("Cập nhật thương hiệu thành công!", "success");
      })
      .catch((error) => {
        console.error("Error updating brand:", error);
        showGeneralToast("Có lỗi xảy ra khi cập nhật thương hiệu", "error");
      });
  };

  return (
    <div className="brand-edit-modal">
      <div className="brand-edit-modal-content">
        <h2 className="brand-edit-modal-title">Chỉnh sửa thương hiệu</h2>
        
        {error && <div className="error-toast">{error}</div>}

        <form>
          <div className="brand-edit-modal-form-group">
            <label>Tên thương hiệu</label>
            <input 
              type="text" 
              className="brand-edit-modal-input" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <label>Mô Tả thương hiệu</label>
            <input 
              type="text" 
              className="brand-edit-modal-input" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>
          <button onClick={updateBrand} className="brand-edit-modal-btn brand-edit-modal-btn-info">Cập nhật</button>
          <button onClick={onClose} className="brand-edit-modal-btn brand-edit-modal-btn-danger">Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default EditBrand;
