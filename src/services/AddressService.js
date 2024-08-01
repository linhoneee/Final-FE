import axios from 'axios';

const BASE_URL = 'http://localhost:8080/addresses';

class AddressService {
  getAllAddresses() {
    return axios.get(BASE_URL);
  }

  createAddress(userId, address) {
    return axios.post(`${BASE_URL}/${userId}`, address);
  }

  getAddressById(addressId) {
    return axios.get(`${BASE_URL}/${addressId}`);
  }

  getAddressesByUserId(userId) {
    return axios.get(`${BASE_URL}/user/${userId}`);
  }

  updateAddress(userId, address, addressId) {
    return axios.put(`${BASE_URL}/${userId}/${addressId}`, address);
  }

  deleteAddress(addressId) {
    return axios.delete(`${BASE_URL}/${addressId}`);
  }

  getPrimaryAddress(userId) {
    return axios.get(`${BASE_URL}/primary/${userId}`);
  }
}

const instance = new AddressService();
export default instance;
