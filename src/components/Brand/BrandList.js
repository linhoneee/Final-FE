import React, { useState, useEffect } from 'react';
import BrandService from '../../services/BrandService';
import './BrandList.css'; 
import AddBrand from './AddBrand'; 
import EditBrand from './EditBrand';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState(null);

  useEffect(() => {
    BrandService.getAllBrands().then((response) => {
      setBrands(response.data);
    });
  }, []);

  const deleteBrand = (id) => {
    BrandService.deleteBrand(id).then(() => {
      setBrands(brands.filter((brand) => brand.id !== id));
    });
  };

  const handleEditClick = (brand) => {
    setBrandToEdit(brand);
    setShowEditModal(true);
  };

  return (
    <div className="brand-list-container">
      <h2 className="brand-list-text-center">Danh sách thương hiệu</h2>
      <button onClick={() => setShowAddModal(true)} className="brand-list-btn brand-list-btn-primary mb-2">Thêm thương hiệu</button>
      <table className="brand-list-table brand-list-table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên thương hiệu</th>
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
                <button onClick={() => handleEditClick(brand)} className="brand-list-btn brand-list-btn-info">Chỉnh sửa</button>
                <button onClick={() => deleteBrand(brand.id)} className="brand-list-btn brand-list-btn-danger">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddModal && <AddBrand onClose={() => setShowAddModal(false)} />}
      {showEditModal && <EditBrand brand={brandToEdit} onClose={() => setShowEditModal(false)} />}
    </div>
  );
};

export default BrandList;
