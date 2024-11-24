import React, { useState } from 'react';
import BrandService from '../../services/BrandService';
import './AddBrand.css';

const AddBrand = ({ onClose, onCategoryAdded  }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const saveBrand = (e) => {
    const brand = { name,description };
    BrandService.createBrand(brand).then(() => {
      onClose();
    });
  };

  return (
    <div className="brand-add-modal">
      <div className="brand-add-modal-content">
        <h2 className="brand-add-modal-title">Thêm thương hiệu</h2>
        <form>
          <div className="brand-add-modal-form-group">
            <label>Tên thương hiệu</label>
            <input type="text" className="brand-add-modal-input" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Mô tả thương hiệu</label>
            <input type="text" className="brand-add-modal-input" value={description} onChange={(e) => setDescription(e.target.value)} />

          </div>
          <button onClick={saveBrand} className="brand-add-modal-btn brand-add-modal-btn-primary">Lưu</button>
          <button onClick={onClose} className="brand-add-modal-btn brand-add-modal-btn-danger">Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default AddBrand;
