import React, { useState, useEffect } from 'react';
import BrandService from '../../services/BrandService';
import './BrandList.css';
import AddBrand from './AddBrand';
import EditBrand from './EditBrand';
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast

const BrandList = () => {
  const [brands, setBrands] = useState([]); // Lưu trữ danh sách thương hiệu
  const [showAddModal, setShowAddModal] = useState(false); // Điều khiển modal thêm thương hiệu
  const [showEditModal, setShowEditModal] = useState(false); // Điều khiển modal chỉnh sửa thương hiệu
  const [brandToEdit, setBrandToEdit] = useState(null); // Thương hiệu cần chỉnh sửa
  const [error, setError] = useState(null); // State để lưu lỗi

  // Fetch danh sách thương hiệu từ API khi component mount
  useEffect(() => {
    BrandService.getAllBrands().then((response) => {
      setBrands(response.data);
    });
  }, []);

  // Xóa thương hiệu
  const deleteBrand = (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa thương hiệu này?");
    if (confirmDelete) {
      BrandService.deleteBrand(id).then(() => {
        // Cập nhật lại danh sách sau khi xóa
        setBrands(brands.filter((brand) => brand.id !== id));
        showGeneralToast("Thương hiệu đã được xóa thành công!", "success");
        setError(null);  // Xóa thông báo lỗi nếu thành công
      }).catch((error) => {
        console.error("Error deleting brand:", error);

        // Hiển thị lỗi nếu có
        if (error.response && error.response.data) {
          const { message } = error.response.data;
          setError(message);
          showGeneralToast(message, "error");
        } else {
          setError("Có lỗi xảy ra khi xóa thương hiệu");
          showGeneralToast("Có lỗi xảy ra khi xóa thương hiệu", "error");
        }
      });
    }
  };

  // Mở modal chỉnh sửa và truyền dữ liệu thương hiệu
  const handleEditClick = (brand) => {
    setBrandToEdit(brand);
    setShowEditModal(true);
  };

  // Thêm thương hiệu mới
  const handleCategoryAdded = (newBrand) => {
    setBrands((prevBrands) => [...prevBrands, newBrand]);  // Thêm brand mới vào danh sách
  };

  return (
    <div className="brand-list-container">
      <h2 className="brand-list-text-center">Danh sách thương hiệu</h2>
      <button onClick={() => setShowAddModal(true)} className="brand-list-btn brand-list-btn-primary mb-2">
        Thêm thương hiệu
      </button>


      <table className="brand-list-table brand-list-table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id}>
              <td>{brand.id}</td>
              <td>{brand.name}</td>
              <td>{brand.description}</td>
              <td>
                <button 
                  onClick={() => handleEditClick(brand)} 
                  className="brand-list-btn brand-list-btn-info"
                >
                  Chỉnh sửa
                </button>
                <button 
                  onClick={() => deleteBrand(brand.id)} 
                  className="brand-list-btn brand-list-btn-danger"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal thêm thương hiệu */}
      {showAddModal && <AddBrand onClose={() => setShowAddModal(false)} onCategoryAdded={handleCategoryAdded} />}

      {/* Modal chỉnh sửa thương hiệu */}
      {showEditModal && (
        <EditBrand 
          brand={brandToEdit} 
          onClose={() => setShowEditModal(false)} 
          setBrands={setBrands} 
        />
      )}
    </div>
  );
};

export default BrandList;
