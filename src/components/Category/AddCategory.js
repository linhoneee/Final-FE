import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../services/CategoryService';

const AddCategory = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const saveCategory = (e) => {
    e.preventDefault();
    const category = { name };
    CategoryService.createCategory(category).then(() => {
      navigate('/categories');
    });
  };

  return (
    <div className="container">
      <h2>Add Category</h2>
      <form>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button className="btn btn-success mt-2" onClick={saveCategory}>Save</button>
      </form>
    </div>
  );
};

export default AddCategory;
