import React, { useEffect, useState } from 'react';
import CategoryService from '../../services/CategoryService';
import './CategoryList.css';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [error, setError] = useState(null); // State để lưu lỗi

  
  useEffect(() => {
    CategoryService.getAllCategories().then((response) => {
      setCategories(response.data);
    });
  }, []);

  const deleteCategory = (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa danh mục này?");
    if (confirmDelete) {
      CategoryService.deleteCategory(id)
        .then(() => {
          // Cập nhật lại danh sách categories sau khi xóa
          setCategories(categories.filter((category) => category.id !== id));
          showGeneralToast("Danh mục đã được xóa thành công!", "success"); // Thông báo thành công
        })
        .catch((error) => {
          console.error("Error deleting category:", error);
  
          // Hiển thị thông báo lỗi nếu có
          if (error.response && error.response.data) {
            const { message } = error.response.data;
            setError(message);  // Cập nhật thông báo lỗi vào state
            showGeneralToast(message, "error"); // Thông báo lỗi từ server
          } else {
            setError("Có lỗi xảy ra khi xóa danh mục");  // Cập nhật thông báo lỗi chung
            showGeneralToast("Có lỗi xảy ra khi xóa danh mục", "error"); // Thông báo lỗi chung
          }
        });
    }
  };
  

  const handleEditClick = (category) => {
    setCategoryToEdit(category);
    setShowEditModal(true);
  };

  const handleCategoryAdded = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  return (
    <div className="category-list-container">
      <h2 className="category-list-title">Danh sách danh mục</h2>
      <button onClick={() => setShowAddModal(true)} className="category-list-btn category-list-btn-primary">Thêm danh mục</button>
      <table className="category-list-table category-list-table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Mô Tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button onClick={() => handleEditClick(category)} className="category-list-btn category-list-btn-info">Chỉnh sửa</button>
                <button onClick={() => deleteCategory(category.id)} className="category-list-btn category-list-btn-danger">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal thêm danh mục */}
      {showAddModal && (
        <AddCategory
          onClose={() => setShowAddModal(false)}
          onCategoryAdded={handleCategoryAdded} // Truyền hàm này
        />
      )}

      {/* Modal chỉnh sửa danh mục */}
      {showEditModal && (
        <EditCategory
          category={categoryToEdit}
          onClose={() => setShowEditModal(false)}
          onCategoryUpdated={handleCategoryUpdated} // Truyền hàm này
        />
      )}
    </div>
  );
};

export default CategoryList;
