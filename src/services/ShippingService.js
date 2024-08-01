import axios from "axios";

const URL = "http://localhost:8008";

class ShippingService {
  getAllShipping() {
    return axios.get(`${URL}/shipping-types`);
  }

  createShipping(shipping) {
    return axios.post(`${URL}/shipping-types`, shipping);
  }

  findShippingById(shippingId) {
    return axios.get(`${URL}/shipping-types/${shippingId}`);
  }

  updateShippingById(shipping, shippingId) {
    return axios.put(`${URL}/shipping-types/${shippingId}`, shipping);
  }

  deleteShippingById(shippingId) {
    return axios.delete(`${URL}/shipping-types/${shippingId}`);
  }

  calculateDistance(userId, warehouseIds) {
    const params = {
      userId,
      warehouseIds: warehouseIds.join(',')
    };
    return axios.get(`${URL}/distance/calculate`, { params });
  }

  calculateDistanceWithFullAddress(address, warehouseIds) {
    const params = {
      receiverName: address.receiverName,
      street: address.street,
      ward: address.ward,
      district: address.district,
      provinceCity: address.provinceCity,
      latitude: address.latitude,
      longitude: address.longitude,
      warehouseIds: warehouseIds.join(',')
    };
    return axios.get(`${URL}/distance/calculateWithFullAddress`, { params });
  }
}

const instance = new ShippingService();
export default instance;
