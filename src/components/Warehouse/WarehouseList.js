import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WarehouseService from '../../services/WarehouseService';

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    WarehouseService.getAllWarehouses().then((response) => {
      setWarehouses(response.data);
    });
  }, []);

  const deleteWarehouse = (id) => {
    WarehouseService.deleteWarehouse(id).then(() => {
      setWarehouses(warehouses.filter((warehouse) => warehouse.id !== id));
    });
  };

  return (
    <div>
      <h2>Warehouse List</h2>
      <button onClick={() => navigate('/add-warehouse')}>Add Warehouse</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Province/City</th>
            <th>District</th>
            <th>Ward</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse) => (
            <tr key={warehouse.id}>
              <td>{warehouse.id}</td>
              <td>{warehouse.name}</td>
              <td>{warehouse.provinceCity}</td>
              <td>{warehouse.district}</td>
              <td>{warehouse.ward}</td>
              <td>{warehouse.latitude}</td>
              <td>{warehouse.longitude}</td>
              <td>
                <button onClick={() => navigate(`/edit-warehouse/${warehouse.id}`)}>Edit</button>
                <button onClick={() => deleteWarehouse(warehouse.id)}>Delete</button>
                <button onClick={() => navigate(`/warehouse/${warehouse.id}/inventory`)}>View Inventory</button>
                <button onClick={() => navigate(`/warehouse/${warehouse.id}/addProduct`)}>Add Product</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WarehouseList;
