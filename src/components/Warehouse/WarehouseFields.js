// src/components/Warehouse/WarehouseFields.js
import React from 'react';

const WarehouseFields = ({ warehouse, handleChange, provinces, districts, wards, setWarehouse }) => {
  return (
    <>
      <label>Tên kho</label>
      <input 
        type="text" 
        name="name" 
        value={warehouse.name} 
        onChange={handleChange} 
        required 
      />

      <label>Tỉnh/Thành phố</label>
      <select 
        name="provinceCity" 
        value={warehouse.provinceCity} 
        onChange={(e) => {
          const selectedIndex = e.target.selectedIndex;
          setWarehouse(prevState => ({
            ...prevState,
            provinceCity: e.target.value,
            provinceCityName: e.target.options[selectedIndex].text,
            district: '',
            districtName: '',
            ward: '',
            wardName: ''
          }));
        }}
      >
        <option value="">Chọn Tỉnh/Thành phố</option>
        {provinces.map((province) => (
          <option key={province.province_id} value={province.province_id}>
            {province.province_name}
          </option>
        ))}
      </select>

      {warehouse.provinceCity && (
        <div>
          <label>Quận/Huyện</label>
          <select 
            name="district" 
            value={warehouse.district} 
            onChange={(e) => {
              const selectedIndex = e.target.selectedIndex;
              setWarehouse(prevState => ({
                ...prevState,
                district: e.target.value,
                districtName: e.target.options[selectedIndex].text,
                ward: '',
                wardName: ''
              }));
            }}
          >
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((district) => (
              <option key={district.district_id} value={district.district_id}>
                {district.district_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {warehouse.district && (
        <div>
          <label>Phường/Xã</label>
          <select 
            name="ward" 
            value={warehouse.ward} 
            onChange={(e) => {
              const selectedIndex = e.target.selectedIndex;
              setWarehouse(prevState => ({
                ...prevState,
                ward: e.target.value,
                wardName: e.target.options[selectedIndex].text
              }));
            }}
          >
            <option value="">Chọn Phường/Xã</option>
            {wards.map((ward) => (
              <option key={ward.ward_id} value={ward.ward_id}>
                {ward.ward_name}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

export default WarehouseFields;
