import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryService from '../../services/CategoryService';

const EditCategory = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    CategoryService.getCategoryById(id).then((response) => {
      setName(response.data.name);
    });
  }, [id]);

  const updateCategory = (e) => {
    e.preventDefault();
    const category = { name };
    CategoryService.updateCategory(category, id).then(() => {
      navigate('/categories');
    });
  };

  return (
    <div className="container">
      <h2>Edit Category</h2>
      <form>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button className="btn btn-success mt-2" onClick={updateCategory}>Update</button>
      </form>
    </div>
  );
};

export default EditCategory;
