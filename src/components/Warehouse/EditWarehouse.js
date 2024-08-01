// src/components/Warehouse/EditWarehouse.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import WarehouseService from '../../services/WarehouseService';
import WarehouseFields from './WarehouseFields';
import AddressMap from '../AddressMap';
import L from 'leaflet'; 

// Fix the default icon issue for Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EditWarehouse = () => {
  const { id } = useParams();
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
    WarehouseService.getWarehouseById(id).then((response) => {
      const warehouseData = response.data;
      console.log('Warehouse data from database:', warehouseData); // Log dữ liệu từ cơ sở dữ liệu
      setWarehouse({
        ...warehouseData,
        provinceCity: warehouseData.provinceCity,
        provinceCityName: warehouseData.provinceCity,
        district: warehouseData.district,
        districtName: warehouseData.district,
        ward: warehouseData.ward,
        wardName: warehouseData.ward
      });

      axios.get('https://vapi.vnappmob.com/api/province/')
        .then(response => {
          setProvinces(response.data.results);
          const selectedProvince = response.data.results.find(p => p.province_name === warehouseData.provinceCity);
          if (selectedProvince) {
            setWarehouse(prevState => ({
              ...prevState,
              provinceCity: selectedProvince.province_id,
              provinceCityName: selectedProvince.province_name
            }));

            axios.get(`https://vapi.vnappmob.com/api/province/district/${selectedProvince.province_id}`)
              .then(response => {
                setDistricts(response.data.results);
                const selectedDistrict = response.data.results.find(d => d.district_name === warehouseData.district);
                if (selectedDistrict) {
                  setWarehouse(prevState => ({
                    ...prevState,
                    district: selectedDistrict.district_id,
                    districtName: selectedDistrict.district_name
                  }));

                  axios.get(`https://vapi.vnappmob.com/api/province/ward/${selectedDistrict.district_id}`)
                    .then(response => {
                      setWards(response.data.results);
                      const selectedWard = response.data.results.find(w => w.ward_name === warehouseData.ward);
                      if (selectedWard) {
                        setWarehouse(prevState => ({
                          ...prevState,
                          ward: selectedWard.ward_id,
                          wardName: selectedWard.ward_name
                        }));
                      }
                    })
                    .catch(error => console.error(error));
                }
              })
              .catch(error => console.error(error));
          }
        })
        .catch(error => console.error(error));
    });
  }, [id]);

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
    axios.get(`https://nominatim.openstreetmap.org/search`, {
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

  const updateWarehouse = (e) => {
    e.preventDefault();
    const warehouseToSend = {
      ...warehouse,
      provinceCity: warehouse.provinceCityName,
      district: warehouse.districtName,
      ward: warehouse.wardName
    };
    WarehouseService.updateWarehouse(id, warehouseToSend).then(() => {
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
    <div>
      <h2>Edit Warehouse</h2>
      <form onSubmit={updateWarehouse}>
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
            <h3>Coordinates</h3>
            <p>Longitude: {warehouse.longitude}</p>
            <p>Latitude: {warehouse.latitude}</p>
          </div>
        )}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditWarehouse;
