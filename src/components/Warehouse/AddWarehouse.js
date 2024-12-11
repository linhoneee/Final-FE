// src/components/Warehouse/AddWarehouse.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WarehouseService from '../../services/WarehouseService';
import WarehouseForm from './WarehouseForm';
import L from 'leaflet';
import './AddWarehouse.css';

// Fix the default icon issue for Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AddWarehouse = () => {
  const [warehouse, setWarehouse] = useState({
    name: '',
    provinceCity: '',
    provinceCityName: '',
    district: '',
    districtName: '',
    ward: '',
    wardName: '',
    latitude: 21.028511, // Default coordinates for Hanoi
    longitude: 105.804817 // Default coordinates for Hanoi
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://vapi.vnappmob.com/api/province/')
      .then(response => setProvinces(response.data.results))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (warehouse.provinceCity) {
      axios.get(`https://vapi.vnappmob.com/api/province/district/${warehouse.provinceCity}`)
        .then(response => setDistricts(response.data.results))
        .catch(error => console.error(error));
      updateMap(`${warehouse.provinceCityName}, Vietnam`);
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [warehouse.provinceCity, warehouse.provinceCityName]);

  useEffect(() => {
    if (warehouse.district) {
      axios.get(`https://vapi.vnappmob.com/api/province/ward/${warehouse.district}`)
        .then(response => setWards(response.data.results))
        .catch(error => console.error(error));
      updateMap(`${warehouse.districtName}, ${warehouse.provinceCityName}, Vietnam`);
    } else {
      setWards([]);
    }
  }, [warehouse.district, warehouse.districtName, warehouse.provinceCityName]);

  useEffect(() => {
    if (warehouse.ward) {
      updateMap(`${warehouse.wardName}, ${warehouse.districtName}, ${warehouse.provinceCityName}, Vietnam`);
    }
  }, [warehouse.ward, warehouse.wardName, warehouse.districtName, warehouse.provinceCityName]);

  const updateMap = (addressString) => {
    axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: addressString,
        format: 'json',
        addressdetails: 1,
        limit: 1
      }
    })
    .then(response => {
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setWarehouse(prevState => ({
          ...prevState,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon)
        }));
      } else {
        console.error('Could not find coordinates for this address');
      }
    })
    .catch(error => {
      console.error('Error fetching coordinates:', error);
    });
  };

  const addWarehouse = (e) => {
    e.preventDefault();
    const warehouseToSend = {
      ...warehouse,
      provinceCity: warehouse.provinceCityName,
      district: warehouse.districtName,
      ward: warehouse.wardName
    };
    WarehouseService.createWarehouse(warehouseToSend).then(() => {
      navigate('/warehouses');
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWarehouse(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="add-warehouse-container">
      <h2 className="add-warehouse-title">Thêm Kho Hàng</h2>
      <WarehouseForm 
        warehouse={warehouse}
        handleChange={handleChange}
        handleSubmit={addWarehouse}
        provinces={provinces}
        districts={districts}
        wards={wards}
        setWarehouse={setWarehouse}
        className="add-warehouse-form"
      />
      <div className="add-warehouse-map-container">
        {/* Bản đồ sẽ được render ở đây */}
      </div>
    </div>
  );
};

export default AddWarehouse;
