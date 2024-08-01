import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BrandService from '../../services/BrandService';

const EditBrand = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    BrandService.getBrandById(id).then((response) => {
      setName(response.data.name);
    });
  }, [id]);

  const updateBrand = (e) => {
    e.preventDefault();
    const brand = { name };
    BrandService.updateBrand(brand, id).then(() => {
      navigate('/brands');
    });
  };

  return (
    <div className="container">
      <h2>Edit Brand</h2>
      <form>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button className="btn btn-success mt-2" onClick={updateBrand}>Update</button>
      </form>
    </div>
  );
};

export default EditBrand;
