import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandService from '../../services/BrandService';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="container">
      <h2 className="text-center">Brand List</h2>
      <button onClick={() => navigate('/add-brand')} className="btn btn-primary mb-2">Add Brand</button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id}>
              <td>{brand.id}</td>
              <td>{brand.name}</td>
              <td>{brand.description}</td>
              <td>
                <button onClick={() => navigate(`/edit-brand/${brand.id}`)} className="btn btn-info">Edit</button>
                <button onClick={() => deleteBrand(brand.id)} className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrandList;

