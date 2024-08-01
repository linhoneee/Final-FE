import React from 'react';

const AddressFields = ({ address, handleChange, provinces, districts, wards, setAddress }) => {
  return (
    <>
      <label>Receiver Name</label>
      <input type="text" name="receiverName" value={address.receiverName} onChange={handleChange} required />

      <label>Province/City</label>
      <select 
        name="provinceCity" 
        value={address.provinceCity} 
        onChange={(e) => {
          const selectedIndex = e.target.selectedIndex;
          setAddress(prevState => ({
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
        <option value="">Select Province/City</option>
        {provinces.map((province) => (
          <option key={province.province_id} value={province.province_id}>
            {province.province_name}
          </option>
        ))}
      </select>

      {address.provinceCity && (
        <div>
          <label>District</label>
          <select 
            name="district" 
            value={address.district} 
            onChange={(e) => {
              const selectedIndex = e.target.selectedIndex;
              setAddress(prevState => ({
                ...prevState,
                district: e.target.value,
                districtName: e.target.options[selectedIndex].text,
                ward: '',
                wardName: ''
              }));
            }}
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.district_id} value={district.district_id}>
                {district.district_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {address.district && (
        <div>
          <label>Ward</label>
          <select 
            name="ward" 
            value={address.ward} 
            onChange={(e) => {
              const selectedIndex = e.target.selectedIndex;
              setAddress(prevState => ({
                ...prevState,
                ward: e.target.value,
                wardName: e.target.options[selectedIndex].text
              }));
            }}
          >
            <option value="">Select Ward</option>
            {wards.map((ward) => (
              <option key={ward.ward_id} value={ward.ward_id}>
                {ward.ward_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <label>Street</label>
      <input type="text" name="street" value={address.street} onChange={handleChange} required />

      <label>Is Primary</label>
      <input type="checkbox" name="isPrimary" checked={address.isPrimary} onChange={handleChange} />
    </>
  );
};

export default AddressFields;
