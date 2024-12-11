// src/components/Warehouse/WarehouseForm.js
import React from 'react';
import WarehouseFields from './WarehouseFields';
import AddressMap from '../AddressMap';

const WarehouseForm = ({ warehouse, handleChange, handleSubmit, provinces, districts, wards, setWarehouse }) => {
  return (
    <form onSubmit={handleSubmit}>
      <WarehouseFields 
        warehouse={warehouse}
        handleChange={handleChange}
        provinces={provinces}
        districts={districts}
        wards={wards}
        setWarehouse={setWarehouse}
      />

      <AddressMap address={warehouse} setAddress={setWarehouse} />
      
      {warehouse.latitude && warehouse.longitude && (
        <div>
  <h3>Tọa độ</h3>
  <p>Kinh độ: {warehouse.longitude}</p>
  <p>Vĩ độ: {warehouse.latitude}</p>
</div>

      )}
      
      <button type="submit">Save</button>
    </form>
  );
};

export default WarehouseForm;
