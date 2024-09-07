import React, { useState, useEffect } from 'react';
import BrandService from '../../services/BrandService';
import './EditBrand.css';

const EditBrand = ({ brand, onClose }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (brand) {
      setName(brand.name);
    }
  }, [brand]);

  const updateBrand = (e) => {
    e.preventDefault();
    const updatedBrand = { ...brand, name };
    BrandService.updateBrand(brand.id, updatedBrand).then(() => {
      onClose();
      window.location.reload();
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
          </div>
          <button onClick={updateBrand} className="brand-edit-modal-btn brand-edit-modal-btn-info">Cập nhật</button>
          <button onClick={onClose} className="brand-edit-modal-btn brand-edit-modal-btn-danger">Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default EditBrand;
