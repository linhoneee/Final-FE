import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AddressService from '../../services/AddressService';
import AddressFields from '../AddressFields';
import AddressMap from '../AddressMap';
import L from 'leaflet'; 
import './EditAddress.css';

// Fix the default icon issue for Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EditAddress = () => {
  const { id, userId } = useParams();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [address, setAddress] = useState({
    receiverName: '',
    provinceCity: '',
    provinceCityName: '',
    district: '',
    districtName: '',
    ward: '',
    wardName: '',
    street: '',
    isPrimary: false,
    latitude: 21.028511, // Default coordinates for Hanoi
    longitude: 105.804817 // Default coordinates for Hanoi
  });
  const [isFirstLoad, setIsFirstLoad] = useState(true); // State to track first load

  const navigate = useNavigate();

  useEffect(() => {
    AddressService.getAddressById(id).then((response) => {
      const addr = response.data;
      console.log('Address data from database:', addr); 
      setAddress({
        receiverName: addr.receiverName,
        provinceCity: addr.provinceCity,
        provinceCityName: addr.provinceCity,
        district: addr.district,
        districtName: addr.district,
        ward: addr.ward,
        wardName: addr.ward,
        street: addr.street,
        isPrimary: addr.isPrimary,
        latitude: addr.latitude,
        longitude: addr.longitude
      });

      axios.get('https://vapi.vnappmob.com/api/province/')
        .then(response => {
          setProvinces(response.data.results);
          const selectedProvince = response.data.results.find(p => p.province_name === addr.provinceCity);
          if (selectedProvince) {
            setAddress(prevState => ({
              ...prevState,
              provinceCity: selectedProvince.province_id,
              provinceCityName: selectedProvince.province_name
            }));
            axios.get(`https://vapi.vnappmob.com/api/province/district/${selectedProvince.province_id}`)
              .then(response => {
                setDistricts(response.data.results);
                const selectedDistrict = response.data.results.find(d => d.district_name === addr.district);
                if (selectedDistrict) {
                  setAddress(prevState => ({
                    ...prevState,
                    district: selectedDistrict.district_id,
                    districtName: selectedDistrict.district_name
                  }));
                  // Fetch wards for the selected district
                  axios.get(`https://vapi.vnappmob.com/api/province/ward/${selectedDistrict.district_id}`)
                    .then(response => {
                      setWards(response.data.results);
                      const selectedWard = response.data.results.find(w => w.ward_name === addr.ward);
                      if (selectedWard) {
                        setAddress(prevState => ({
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

      // Only call updateMap when address is fetched and it's the first load
      if (isFirstLoad) {
        updateMap(`${addr.ward}, ${addr.district}, ${addr.provinceCity}, Vietnam`);
        setIsFirstLoad(false); // Set to false after first map update
      }
    });
  }, [id, isFirstLoad]);

  useEffect(() => {
    if (address.provinceCity && !isFirstLoad) {
      // Get the list of districts based on the selected province
      axios.get(`https://vapi.vnappmob.com/api/province/district/${address.provinceCity}`)
        .then(response => setDistricts(response.data.results))
        .catch(error => console.error(error));

      // Update the map with the coordinates of the selected province
      updateMap(`${address.provinceCityName}, Vietnam`);
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [address.provinceCity, address.provinceCityName]);

  useEffect(() => {
    if (address.district && !isFirstLoad) {
      // Get the list of wards based on the selected district
      axios.get(`https://vapi.vnappmob.com/api/province/ward/${address.district}`)
        .then(response => setWards(response.data.results))
        .catch(error => console.error(error));

      // Update the map with the coordinates of the selected district
      updateMap(`${address.districtName}, ${address.provinceCityName}, Vietnam`);
    } else {
      setWards([]);
    }
  }, [address.district, address.districtName, address.provinceCityName]);

  useEffect(() => {
    if (address.ward && !isFirstLoad) {
      // Update the map with the coordinates of the selected ward
      updateMap(`${address.wardName}, ${address.districtName}, ${address.provinceCityName}, Vietnam`);
    }
  }, [address.ward, address.wardName, address.districtName, address.provinceCityName]);

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
        setAddress(prevState => ({
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

  const updateAddress = (e) => {
    e.preventDefault();
    const addressToSend = {
      ...address,
      provinceCity: address.provinceCityName,
      district: address.districtName,
      ward: address.wardName
    };
    AddressService.updateAddress(userId, addressToSend, id).then(() => {
      navigate(`/user/${userId}/addresses`);
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

<div className="edit-address-container">
  <h2>Chỉnh sửa địa chỉ</h2>
  <form onSubmit={updateAddress}>
    <AddressFields 
      address={address}
      handleChange={handleChange}
      provinces={provinces}
      districts={districts}
      wards={wards}
      setAddress={setAddress}
    />
    <AddressMap address={address} setAddress={setAddress} />
    {address.latitude && address.longitude && (
      <div className="edit-address-coordinates">
        <h3>Tọa độ</h3>
        <p>Kinh độ: {address.longitude}</p>
        <p>Vĩ độ: {address.latitude}</p>
      </div>
    )}
    <button type="submit">Cập nhật</button>
  </form>
</div>

};

export default EditAddress;
