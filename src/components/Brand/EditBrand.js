import React, { useState, useEffect } from 'react';
import BrandService from '../../services/BrandService';
import './EditBrand.css';

const EditBrand = ({ brand, onClose, }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (brand) {
      setName(brand.name);
      setDescription(brand.description);

    }
  }, [brand]);

  const updateBrand = (e) => {
    e.preventDefault();
    const updatedBrand = { ...brand, name, description };
    console.log("Brand ID:", brand.id); // Kiểm tra giá trị ID
    console.log("Updated Brand Data:", updatedBrand); // Kiểm tra dữ liệu gửi đi
  
    BrandService.updateBrand(updatedBrand, brand.id)
    .then(() => {
      
        onClose();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating brand:", error); // Debug lỗi
      });
  };
  

  return (
    <div className="brand-edit-modal">
      <div className="brand-edit-modal-content">
        <h2 className="brand-edit-modal-title">Chỉnh sửa thương hiệu</h2>
        <form>
          <div className="brand-edit-modal-form-group">
            <label>Tên thương hiệu</label>
            <input type="text" className="brand-edit-modal-input" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Mô Tả thương hiệu</label>
            <input type="text" className="brand-edit-modal-input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button onClick={updateBrand} className="brand-edit-modal-btn brand-edit-modal-btn-info">Cập nhật</button>
          <button onClick={onClose} className="brand-edit-modal-btn brand-edit-modal-btn-danger">Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default EditBrand;
