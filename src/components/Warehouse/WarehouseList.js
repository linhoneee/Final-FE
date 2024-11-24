import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WarehouseService from '../../services/WarehouseService';
import WarehouseInventory from './WarehouseInventory'; 
import AddProduct from './AddProductWarehouse'; 
import Modal from 'react-modal'; // Import react-modal
import './WarehouseList.css'; // Import CSS

Modal.setAppElement('#root'); // Cấu hình root cho Modal

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [inventoryVisible, setInventoryVisible] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentWarehouseId, setCurrentWarehouseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    WarehouseService.getAllWarehouses().then((response) => {
      setWarehouses(response.data);
      console.log(response.data);
    });
  }, []);

  const deleteWarehouse = (id) => {
    WarehouseService.deleteWarehouse(id).then(() => {
      setWarehouses(warehouses.filter((warehouse) => warehouse.id !== id));
    });
  };

  const toggleInventoryVisibility = (warehouseId) => {
    setInventoryVisible((prevState) => ({
      ...prevState,
      [warehouseId]: !prevState[warehouseId],
    }));
  };

  const openAddProductModal = (warehouseId) => {
    setCurrentWarehouseId(warehouseId);
    setModalIsOpen(true);
  };

  const closeAddProductModal = () => {
    setModalIsOpen(false);
    setCurrentWarehouseId(null);
  };

  return (
    <div className="warehouse-list-container">
      <h2 className="warehouse-list-title">Warehouse List</h2>
      <button onClick={() => navigate('/add-warehouse')} className="warehouse-list-add-btn">Add Warehouse</button>
      <table className="warehouse-list-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Address</th> {/* Cột địa chỉ mới */}
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {warehouses.map((warehouse) => (
      <React.Fragment key={warehouse.id}>
        <tr>
          <td>{warehouse.id}</td>
          <td>{warehouse.name}</td>
          <td>{`${warehouse.ward}, ${warehouse.district}, ${warehouse.provinceCity}`}</td> {/* Nối địa chỉ */}
          <td>
  <div className="warehouse-list-actions">
    <button
      onClick={() => navigate(`/edit-warehouse/${warehouse.id}`)}
      className="warehouse-list-action-btn"
    >
      Edit
    </button>
    <button
      onClick={() => deleteWarehouse(warehouse.id)}
      className="warehouse-list-action-btn warehouse-list-delete-btn"
    >
      Delete
    </button>
    <button
      onClick={() => toggleInventoryVisibility(warehouse.id)}
      className="warehouse-list-action-btn"
    >
      {inventoryVisible[warehouse.id] ? 'Hide Inventory' : 'View Inventory'}
    </button>
    <button
      onClick={() => openAddProductModal(warehouse.id)}
      className="warehouse-list-action-btn"
    >
      Add Product
    </button>
  </div>
</td>

        </tr>
        {inventoryVisible[warehouse.id] && (
          <tr>
            <td colSpan="4">
              <WarehouseInventory warehouseId={warehouse.id} />
            </td>
          </tr>
        )}
      </React.Fragment>
    ))}
  </tbody>
</table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeAddProductModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <AddProduct warehouseId={currentWarehouseId} closeModal={closeAddProductModal} />
      </Modal>
    </div>
  );
};

export default WarehouseList;
