import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../services/CategoryService';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="container">
      <h2 className="text-center">Category List</h2>
      <button onClick={() => navigate('/add-category')} className="btn btn-primary mb-2">Add Category</button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>
                <button onClick={() => navigate(`/edit-category/${category.id}`)} className="btn btn-info">Edit</button>
                <button onClick={() => deleteCategory(category.id)} className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
