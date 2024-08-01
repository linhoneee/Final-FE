import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandService from '../../services/BrandService';

const AddBrand = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const saveBrand = (e) => {
    e.preventDefault();
    const brand = { name };
    BrandService.createBrand(brand).then(() => {
      navigate('/brands');
    });
  };

  return (
    <div className="container">
      <h2>Add Brand</h2>
      <form>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button className="btn btn-success mt-2" onClick={saveBrand}>Save</button>
      </form>
    </div>
  );
};

export default AddBrand;
