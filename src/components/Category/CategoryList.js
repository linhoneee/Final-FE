import React, { useEffect, useState } from 'react';
import CategoryService from '../../services/CategoryService';
import './CategoryList.css';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    CategoryService.getAllCategories().then((response) => {
      setCategories(response.data);
    });
  }, []);

  const deleteCategory = (id) => {
    CategoryService.deleteCategory(id).then(() => {
      setCategories(categories.filter((category) => category.id !== id));
    });
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
      
      {showAddModal && (
        <AddCategory
          onClose={() => setShowAddModal(false)}
          onCategoryAdded={handleCategoryAdded} // Truyền hàm này
        />
      )}
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
