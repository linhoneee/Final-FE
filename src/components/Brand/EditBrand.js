import React, { useState, useEffect } from 'react';
import BrandService from '../../services/BrandService';
import './EditBrand.css';
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast

const EditBrand = ({ brand, onClose, setBrands }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(''); // Thêm state để lưu thông báo lỗi

  useEffect(() => {
    if (brand) {
      setName(brand.name);
      setDescription(brand.description);
      setError('');  // Reset error message khi brand thay đổi
    }
  }, [brand]);

  // Hàm cập nhật thương hiệu
  const updateBrand = (e) => {
    e.preventDefault();
    
    // Kiểm tra tính hợp lệ của các trường
    if (!name || !description) {
      setError('Cả tên và mô tả thương hiệu đều là bắt buộc!');
      return; // Dừng lại nếu có trường không hợp lệ
    }

    const updatedBrand = { ...brand, name, description };

    // Gọi API để cập nhật thương hiệu
    BrandService.updateBrand(updatedBrand, brand.id)
      .then(() => {
        onClose();
        // Cập nhật danh sách thương hiệu mà không cần reload trang
        setBrands((prevBrands) =>
          prevBrands.map((b) => (b.id === brand.id ? updatedBrand : b))
        );
        // Hiển thị thông báo thành công
        showGeneralToast("Cập nhật thương hiệu thành công!", "success");
      })
      .catch((error) => {
        console.error("Error updating brand:", error);
        // Hiển thị thông báo lỗi
        showGeneralToast("Có lỗi xảy ra khi cập nhật thương hiệu", "error");
      });
  };

  return (
    <div className="brand-edit-modal">
      <div className="brand-edit-modal-content">
        <h2 className="brand-edit-modal-title">Chỉnh sửa thương hiệu</h2>
        
        {/* Hiển thị lỗi nếu có */}
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
